import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import { getProgramDayForSession, groupProgramExercisesByBlock } from '../../data/programs'
import { createWorkoutLog, createSetLogs, getPreviousSetsForExercise } from '../../data/workoutLogs'
import Button from '../../components/Button'
import WorkoutOverview from './WorkoutOverview'
import ExerciseFocusView from './ExerciseFocusView'

const REST_SECONDS = 90

// Builds one slot per program_exercise, in block order, tagging every
// slot in a multi-exercise block with the full sibling index list
// (groupIndices) -- that's what makes a block a "superset" for logging
// purposes: 2+ exercises sharing a block_label, same as the read-only
// preview on the Train tab already groups them via block_label.
function buildSlots(day) {
  const blocks = groupProgramExercisesByBlock(day.program_exercises)
  const slots = []
  blocks.forEach((block) => {
    const startIndex = slots.length
    const groupIndices = block.programExercises.length > 1
      ? block.programExercises.map((_, i) => startIndex + i)
      : null
    block.programExercises.forEach((pe) => {
      const planned = pe.exercises
      const swapOptions = (pe.exercise_swaps || []).map((s) => s.exercises)
      slots.push({
        programExerciseId: pe.id,
        blockLabel: pe.block_label,
        plannedSets: pe.sets,
        plannedReps: pe.reps,
        planned,
        swapOptions,
        selected: planned,
        swapOpen: false,
        groupIndices,
        sets: Array.from({ length: pe.sets }, () => ({ reps: pe.reps, weight: '', rpe: '', done: false })),
      })
    })
  })
  return slots
}

// Shared by the client's own active session (ActiveSession, clientId = the
// logged-in user) and the coach logging a session on a client's behalf
// (LogSessionForClient, clientId = that client's id).
export default function WorkoutSession({ dayId, clientId, onBack, onFinish }) {
  const [day, setDay] = useState(null)
  const [slots, setSlots] = useState([])
  const [mode, setMode] = useState('overview') // 'overview' | 'focus'
  const [focusIndex, setFocusIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [rest, setRest] = useState(null)
  const [previousSets, setPreviousSets] = useState(null)
  const [saving, setSaving] = useState(false)
  const restInterval = useRef(null)

  useEffect(() => {
    getProgramDayForSession(dayId).then((found) => {
      if (!found) return
      setDay(found)
      setSlots(buildSlots(found))
    })
  }, [dayId])

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [])

  // Previous-session performance for whichever exercise is currently
  // focused, shown as the grey placeholder in each set row.
  const focusedExerciseId = slots[focusIndex]?.selected?.id
  useEffect(() => {
    if (mode !== 'focus' || !focusedExerciseId) return
    let cancelled = false
    getPreviousSetsForExercise(clientId, focusedExerciseId).then((rows) => {
      if (!cancelled) setPreviousSets(rows)
    })
    return () => {
      cancelled = true
    }
    // Depends on the exercise's identity, not the whole `slots` array --
    // slots gets a new reference on every keystroke while logging (each
    // updateSet call), which would otherwise refetch "previous" on every
    // digit typed instead of only when the focused exercise changes.
  }, [mode, focusedExerciseId, clientId])

  useEffect(() => {
    if (!rest) return
    // Keyed on startedAt (not `rest`) so the interval isn't torn down every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    restInterval.current = setInterval(() => {
      setRest((r) => {
        if (!r) return r
        if (r.remaining <= 1) {
          clearInterval(restInterval.current)
          if (r.returnToIndex != null) setFocusIndex(r.returnToIndex)
          return null
        }
        return { ...r, remaining: r.remaining - 1 }
      })
    }, 1000)
    return () => clearInterval(restInterval.current)
  }, [rest?.startedAt])

  const totalSets = useMemo(() => slots.reduce((n, s) => n + s.sets.length, 0), [slots])
  const doneSets = useMemo(
    () => slots.reduce((n, s) => n + s.sets.filter((set) => set.done).length, 0),
    [slots],
  )

  function updateSet(slotIndex, setIndex, next) {
    setSlots((prev) => {
      const copy = [...prev]
      const slot = { ...copy[slotIndex] }
      slot.sets = slot.sets.map((s, i) => (i === setIndex ? next : s))
      copy[slotIndex] = slot
      return copy
    })
  }

  function addSet(slotIndex) {
    setSlots((prev) => {
      const copy = [...prev]
      const slot = { ...copy[slotIndex] }
      const last = slot.sets[slot.sets.length - 1]
      slot.sets = [...slot.sets, { reps: last?.reps ?? slot.plannedReps, weight: last?.weight ?? '', rpe: '', done: false }]
      copy[slotIndex] = slot
      return copy
    })
  }

  // Supersets: finishing a set for any exercise except the last one in the
  // group hops straight to its partner with no rest -- the rest timer only
  // starts once the whole group's round is done, then lands back on the
  // group's first exercise for the next round. Standalone exercises behave
  // as before.
  function toggleSet(slotIndex, setIndex) {
    const slot = slots[slotIndex]
    const set = slot.sets[setIndex]
    const wasDone = set.done
    updateSet(slotIndex, setIndex, { ...set, done: !wasDone })
    if (wasDone) return

    const group = slot.groupIndices || [slotIndex]
    const posInGroup = group.indexOf(slotIndex)

    if (group.length > 1 && posInGroup < group.length - 1) {
      setFocusIndex(group[posInGroup + 1])
      return
    }

    const next = findNextExerciseName(slots, slotIndex, setIndex, group)
    const returnToIndex = group.length > 1 ? group[0] : null
    setRest({ remaining: REST_SECONDS, total: REST_SECONDS, startedAt: Date.now(), next, returnToIndex })
  }

  function findNextExerciseName(list, slotIndex, setIndex, group) {
    if (group.length > 1) {
      const firstInGroup = list[group[0]]
      if (setIndex < firstInGroup.sets.length - 1) return firstInGroup.selected.name
      const afterSlot = list[Math.max(...group) + 1]
      return afterSlot ? afterSlot.selected.name : null
    }
    if (setIndex < list[slotIndex].sets.length - 1) return list[slotIndex].selected.name
    const nextSlot = list[slotIndex + 1]
    return nextSlot ? nextSlot.selected.name : null
  }

  function toggleSwapPanel(slotIndex) {
    setSlots((prev) => prev.map((s, i) => (i === slotIndex ? { ...s, swapOpen: !s.swapOpen } : s)))
  }

  function pickSwap(slotIndex, exercise) {
    setSlots((prev) => prev.map((s, i) => (i === slotIndex ? { ...s, selected: exercise, swapOpen: false } : s)))
  }

  function startLogging() {
    const firstIncomplete = slots.findIndex((s) => s.sets.some((set) => !set.done))
    setFocusIndex(firstIncomplete === -1 ? 0 : firstIncomplete)
    setMode('focus')
  }

  function handleBack() {
    if (mode === 'focus') {
      setMode('overview')
      return
    }
    onBack()
  }

  async function finish() {
    const totalVolume = slots.reduce(
      (sum, s) => sum + s.sets.filter((set) => set.done).reduce((n, set) => n + (Number(set.reps) || 0) * (Number(set.weight) || 0), 0),
      0,
    )
    const prCount = slots.filter((s) =>
      s.sets.some((set) => set.done && Number(set.weight) >= (Number(s.sets[0]?.weight) || 0) && Number(set.weight) > 0),
    ).length

    let synced = false
    if (clientId) {
      setSaving(true)
      try {
        const log = await createWorkoutLog({ clientId, programDayId: day.id })
        const setRows = []
        slots.forEach((slot) => {
          let setNumber = 0
          slot.sets.forEach((set) => {
            if (!set.done) return
            setNumber += 1
            setRows.push({
              exerciseId: slot.selected.id,
              setNumber,
              weight: Number(set.weight) || 0,
              reps: Number(set.reps) || 0,
              rpe: set.rpe === '' || set.rpe == null ? null : Number(set.rpe),
            })
          })
        })
        await createSetLogs(log.id, setRows)
        synced = true
      } catch {
        synced = false
      } finally {
        setSaving(false)
      }
    }

    onFinish({
      name: day?.day_label,
      duration: elapsed,
      totalVolume: Math.round(totalVolume),
      setsCompleted: doneSets,
      totalSets,
      prCount,
      synced,
    })
  }

  if (!day) return null

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')
  const hh = String(Math.floor(elapsed / 3600)).padStart(2, '0')

  const focusSlot = slots[focusIndex]
  const focusGroup = focusSlot?.groupIndices
  const groupPosition = focusGroup
    ? `${focusGroup.indexOf(focusIndex) + 1} of ${focusGroup.length}`
    : null
  const partnerNames = focusGroup
    ? focusGroup.filter((i) => i !== focusIndex).map((i) => slots[i].selected.name).join(', ')
    : null

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 14px' }}>
        <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ArrowLeft size={20} color="var(--bone)" />
        </button>
        <div style={{ font: "700 15px/1 'Inter'", color: 'var(--bone)' }}>{day.day_label}</div>
        <Button onClick={finish} disabled={saving} style={{ padding: '8px 14px', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving…' : 'Finish'}
        </Button>
      </div>

      <div style={{ padding: '0 24px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ font: "700 13px/1 'Inter'", color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>
          {hh}:{mm}:{ss}
        </div>
        <div style={{ flex: 1, height: 3, background: 'var(--surface2)', borderRadius: 2, overflow: 'hidden' }}>
          <div
            style={{
              width: `${totalSets ? (doneSets / totalSets) * 100 : 0}%`,
              height: '100%',
              background: 'var(--ember)',
              transition: 'width 0.3s',
            }}
          />
        </div>
        <div style={{ font: "600 11px/1 'Inter'", color: 'var(--muted)' }}>
          {doneSets}/{totalSets}
        </div>
      </div>

      {mode === 'overview' && (
        <WorkoutOverview slots={slots} onSelectExercise={(i) => { setFocusIndex(i); setMode('focus') }} onStart={startLogging} />
      )}

      {mode === 'focus' && focusSlot && (
        <ExerciseFocusView
          slot={focusSlot}
          position={focusIndex + 1}
          total={slots.length}
          groupPosition={groupPosition}
          partnerNames={partnerNames}
          previousSets={previousSets}
          rest={rest}
          onChangeSet={(setIndex, next) => updateSet(focusIndex, setIndex, next)}
          onToggleSet={(setIndex) => toggleSet(focusIndex, setIndex)}
          onAddSet={() => addSet(focusIndex)}
          onToggleSwap={() => toggleSwapPanel(focusIndex)}
          onPickSwap={(ex) => pickSwap(focusIndex, ex)}
          onPrev={() => setFocusIndex((i) => Math.max(0, i - 1))}
          onNext={() => (focusIndex === slots.length - 1 ? finish() : setFocusIndex((i) => Math.min(slots.length - 1, i + 1)))}
          onRestAdd30={() => setRest((r) => (r ? { ...r, remaining: r.remaining + 30, total: r.total + 30 } : r))}
          onRestSubtract30={() => setRest((r) => (r ? { ...r, remaining: Math.max(0, r.remaining - 30) } : r))}
          onRestSkip={() => {
            if (rest?.returnToIndex != null) setFocusIndex(rest.returnToIndex)
            setRest(null)
          }}
          isLast={focusIndex === slots.length - 1}
        />
      )}
    </div>
  )
}
