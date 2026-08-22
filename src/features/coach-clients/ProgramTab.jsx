import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getCoachProgramForClient, groupProgramExercisesByBlock } from '../../data/programs'
import Button from '../../components/Button'
import DayTabs from '../train/DayTabs'
import ExerciseBlockPreview from '../train/ExerciseBlockPreview'

export default function ProgramTab({ clientId, clientName }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [program, setProgram] = useState(undefined)
  const [dayId, setDayId] = useState(null)

  useEffect(() => {
    if (!user?.id) return
    getCoachProgramForClient(user.id, clientId).then((p) => {
      setProgram(p)
      if (p?.program_days?.length) setDayId(p.program_days[0].id)
    })
  }, [user?.id, clientId])

  if (program === undefined) return null

  if (program === null) {
    return (
      <div style={{ padding: '20px 0', textAlign: 'center' }}>
        <div style={{ font: "700 15px/1.3 'Inter'", color: 'var(--bone)', marginBottom: 6 }}>No program yet</div>
        <div style={{ font: "500 12px/1.5 'Inter'", color: 'var(--muted)', marginBottom: 20 }}>
          {clientName ? `${clientName} doesn't have a training program yet.` : 'This client doesn\'t have a training program yet.'}
        </div>
        <Button full onClick={() => navigate(`/coach/tools/builder?client=${clientId}`)}>
          Create Program
        </Button>
      </div>
    )
  }

  const day = program.program_days.find((d) => d.id === dayId)
  const blocks = day ? groupProgramExercisesByBlock(day.program_exercises) : []

  return (
    <div>
      <div style={{ font: "700 15px/1.3 'Inter'", color: 'var(--bone)', marginBottom: 4 }}>{program.name}</div>
      {program.notes && (
        <div style={{ font: "500 12px/1.4 'Inter'", color: 'var(--muted)', marginBottom: 16 }}>{program.notes}</div>
      )}

      {program.program_days.length === 0 ? (
        <div style={{ font: "500 12px/1.5 'Inter'", color: 'var(--muted)', marginBottom: 16 }}>
          This program doesn't have any days yet.
        </div>
      ) : (
        <>
          <DayTabs days={program.program_days} activeId={dayId} onSelect={setDayId} />
          {blocks.map((block, i) => (
            <ExerciseBlockPreview key={i} label={block.label} programExercises={block.programExercises} />
          ))}
        </>
      )}

      <Button variant="ghost" full onClick={() => navigate(`/coach/tools/builder?client=${clientId}&program=${program.id}`)}>
        Edit Program
      </Button>
    </div>
  )
}
