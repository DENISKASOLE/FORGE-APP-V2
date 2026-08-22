import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getClientActiveProgram, groupProgramExercisesByBlock } from '../../data/programs'
import Button from '../../components/Button'
import DayTabs from './DayTabs'
import ExerciseBlockPreview from './ExerciseBlockPreview'

export default function TrainOverview() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [program, setProgram] = useState(undefined)
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    getClientActiveProgram(user?.id).then((p) => {
      setProgram(p)
      if (p?.program_days?.length) setActiveId(p.program_days[0].id)
    })
  }, [user?.id])

  if (program === undefined) return null

  if (!program) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ font: "700 16px/1.3 'Inter'", color: 'var(--bone)', marginBottom: 8 }}>
          No program yet
        </div>
        <div style={{ font: "500 12px/1.5 'Inter'", color: 'var(--muted)' }}>
          Your coach hasn't assigned a training program yet. Check back soon.
        </div>
      </div>
    )
  }

  const day = program.program_days.find((d) => d.id === activeId)
  const blocks = day ? groupProgramExercisesByBlock(day.program_exercises) : []

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: '20px 24px 16px' }}>
        <div style={{ font: "800 22px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.4px' }}>
          Train
        </div>
        <div style={{ font: "500 12px/1 'Inter'", color: 'var(--muted)', marginTop: 6 }}>{program.name}</div>
      </div>
      <DayTabs days={program.program_days} activeId={activeId} onSelect={setActiveId} />
      {day && (
        <div style={{ padding: '0 24px' }}>
          {blocks.map((block, i) => (
            <ExerciseBlockPreview key={i} label={block.label} programExercises={block.programExercises} />
          ))}
          <Button full onClick={() => navigate(`/train/session/${day.id}`)}>
            Start {day.day_label}
          </Button>
        </div>
      )}
    </div>
  )
}
