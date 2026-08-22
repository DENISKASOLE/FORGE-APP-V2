import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getClientById } from '../../data/coachData'
import {
  getCoachProgramForClient,
  getProgramDetail,
  createProgram,
  createProgramDay,
  createProgramExercise,
  deleteProgramExercise,
  addExerciseSwap,
  deleteExerciseSwap,
} from '../../data/programs'
import BackHeader from '../../components/BackHeader'
import ClientPicker from './ClientPicker'
import CreateProgramForm from './CreateProgramForm'
import ProgramDayEditor from './ProgramDayEditor'

export default function WorkoutBuilder() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const clientId = searchParams.get('client')
  const programId = searchParams.get('program')

  const [clientName, setClientName] = useState('')
  const [program, setProgram] = useState(undefined) // undefined = loading, null = none yet
  const [activeDayId, setActiveDayId] = useState(null)
  const [error, setError] = useState('')

  // Resolve a display name for the header (works for both the sample
  // roster's ids and real profile ids picked via ClientPicker).
  useEffect(() => {
    if (!clientId) return
    getClientById(clientId).then((c) => setClientName(c?.name || ''))
  }, [clientId])

  useEffect(() => {
    if (!clientId) return
    // Intentional: resets to the loading state before the fetch below starts,
    // so switching client/program doesn't briefly show the previous program.
    // eslint-disable-next-line react/set-state-in-effect
    setProgram(undefined)
    if (programId) {
      getProgramDetail(programId).then((p) => {
        setProgram(p)
        if (p?.program_days?.length) setActiveDayId(p.program_days[0].id)
      })
    } else {
      // Runs even before `user` has loaded: the query then fails safely
      // and getCoachProgramForClient resolves to null, same as a real
      // coach whose client just doesn't have a program yet.
      getCoachProgramForClient(user?.id, clientId).then((p) => {
        if (p) {
          setProgram(p)
          if (p.program_days?.length) setActiveDayId(p.program_days[0].id)
          setSearchParams({ client: clientId, program: p.id }, { replace: true })
        } else {
          setProgram(null)
        }
      })
    }
  }, [clientId, programId, user?.id, setSearchParams])

  async function handlePickClient(client) {
    setClientName(client.full_name || '')
    setSearchParams({ client: client.id })
  }

  async function handleCreateProgram({ name, notes }) {
    const created = await createProgram({ coachId: user?.id, clientId, name, notes })
    const withDays = { ...created, program_days: [] }
    setProgram(withDays)
    setSearchParams({ client: clientId, program: created.id })
  }

  async function handleAddDay(dayLabel) {
    try {
      const day = await createProgramDay({
        programId: program.id,
        dayLabel,
        sortOrder: program.program_days.length,
      })
      const withExercises = { ...day, program_exercises: [] }
      setProgram((prev) => ({ ...prev, program_days: [...prev.program_days, withExercises] }))
      setActiveDayId(day.id)
    } catch (err) {
      setError(err.message || 'Could not add that day.')
    }
  }

  async function handleAddExercise(dayId, { exerciseId, blockLabel, sets, reps }) {
    try {
      const day = program.program_days.find((d) => d.id === dayId)
      const created = await createProgramExercise({
        programDayId: dayId,
        exerciseId,
        blockLabel,
        sets,
        reps,
        sortOrder: day.program_exercises.length,
      })
      setProgram((prev) => ({
        ...prev,
        program_days: prev.program_days.map((d) =>
          d.id === dayId ? { ...d, program_exercises: [...d.program_exercises, created] } : d,
        ),
      }))
    } catch (err) {
      setError(err.message || 'Could not add that exercise.')
    }
  }

  async function handleDeleteExercise(dayId, programExerciseId) {
    try {
      await deleteProgramExercise(programExerciseId)
      setProgram((prev) => ({
        ...prev,
        program_days: prev.program_days.map((d) =>
          d.id === dayId
            ? { ...d, program_exercises: d.program_exercises.filter((pe) => pe.id !== programExerciseId) }
            : d,
        ),
      }))
    } catch (err) {
      setError(err.message || 'Could not remove that exercise.')
    }
  }

  async function handleAddSwaps(dayId, programExerciseId, exercises) {
    try {
      const created = await Promise.all(
        exercises.map((ex) => addExerciseSwap({ programExerciseId, alternateExerciseId: ex.id })),
      )
      setProgram((prev) => ({
        ...prev,
        program_days: prev.program_days.map((d) =>
          d.id !== dayId
            ? d
            : {
                ...d,
                program_exercises: d.program_exercises.map((pe) =>
                  pe.id === programExerciseId
                    ? { ...pe, exercise_swaps: [...pe.exercise_swaps, ...created] }
                    : pe,
                ),
              },
        ),
      }))
    } catch (err) {
      setError(err.message || 'Could not add that swap.')
    }
  }

  async function handleDeleteSwap(dayId, programExerciseId, swapId) {
    try {
      await deleteExerciseSwap(swapId)
      setProgram((prev) => ({
        ...prev,
        program_days: prev.program_days.map((d) =>
          d.id !== dayId
            ? d
            : {
                ...d,
                program_exercises: d.program_exercises.map((pe) =>
                  pe.id === programExerciseId
                    ? { ...pe, exercise_swaps: pe.exercise_swaps.filter((s) => s.id !== swapId) }
                    : pe,
                ),
              },
        ),
      }))
    } catch (err) {
      setError(err.message || 'Could not remove that swap.')
    }
  }

  if (!clientId) {
    return <ClientPicker onPick={handlePickClient} />
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      <BackHeader title={clientName || 'Workout Builder'} />

      {error && (
        <div
          style={{
            margin: '0 24px 16px',
            padding: '10px 14px',
            background: 'rgba(220,80,70,0.1)',
            color: 'var(--red)',
            borderRadius: 12,
            font: "600 12px/1.4 'Inter'",
          }}
        >
          {error}
        </div>
      )}

      {program === undefined && null}

      {program === null && (
        <div style={{ padding: '0 24px' }}>
          <CreateProgramForm clientName={clientName} onCreate={handleCreateProgram} />
        </div>
      )}

      {program && (
        <ProgramDayEditor
          program={program}
          activeDayId={activeDayId}
          onSelectDay={setActiveDayId}
          onAddDay={handleAddDay}
          onAddExercise={handleAddExercise}
          onDeleteExercise={handleDeleteExercise}
          onAddSwaps={handleAddSwaps}
          onDeleteSwap={handleDeleteSwap}
        />
      )}
    </div>
  )
}
