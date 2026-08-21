import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTrainingProgram } from '../../data/clientData'
import Button from '../../components/Button'
import DayTabs from './DayTabs'
import ExerciseBlockPreview from './ExerciseBlockPreview'

export default function TrainOverview() {
  const navigate = useNavigate()
  const [program, setProgram] = useState(null)
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    getTrainingProgram().then((p) => {
      setProgram(p)
      setActiveId(p.days[0].id)
    })
  }, [])

  if (!program) return null
  const day = program.days.find((d) => d.id === activeId)

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: '20px 24px 16px' }}>
        <div style={{ font: "800 22px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.4px' }}>
          Train
        </div>
        <div style={{ font: "500 12px/1 'Inter'", color: 'var(--muted)', marginTop: 6 }}>
          Week {program.week} of your program
        </div>
      </div>
      <DayTabs days={program.days} activeId={activeId} onSelect={setActiveId} />
      <div style={{ padding: '0 24px' }}>
        {day.blocks.map((block) => (
          <ExerciseBlockPreview key={block.id} block={block} />
        ))}
        <Button full onClick={() => navigate(`/train/session/${day.id}`)}>
          Start {day.label} — {day.name}
        </Button>
      </div>
    </div>
  )
}
