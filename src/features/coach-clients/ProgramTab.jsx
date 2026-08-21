import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTrainingProgram } from '../../data/clientData'
import Button from '../../components/Button'

const weeks = [6, 7, 8, 9, 10]

export default function ProgramTab({ clientId }) {
  const navigate = useNavigate()
  const [program, setProgram] = useState(null)
  const [week, setWeek] = useState(8)
  const [dayId, setDayId] = useState(null)

  useEffect(() => {
    getTrainingProgram().then((p) => {
      setProgram(p)
      setDayId(p.days[0].id)
    })
  }, [])

  if (!program) return null
  const day = program.days.find((d) => d.id === dayId)

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
        {weeks.map((w) => (
          <button
            key={w}
            onClick={() => setWeek(w)}
            style={{
              flexShrink: 0,
              background: w === week ? 'var(--ember)' : 'var(--surface)',
              color: w === week ? '#fff' : 'var(--boneDim)',
              border: '1px solid ' + (w === week ? 'var(--ember)' : 'var(--line)'),
              borderRadius: 100,
              padding: '7px 14px',
              font: "600 11px/1 'Inter'",
              cursor: 'pointer',
            }}
          >
            Wk {w}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {program.days.map((d) => (
          <button
            key={d.id}
            onClick={() => setDayId(d.id)}
            style={{
              flex: 1,
              background: d.id === dayId ? 'var(--ember)' : 'var(--surface)',
              color: d.id === dayId ? '#fff' : 'var(--boneDim)',
              border: '1px solid ' + (d.id === dayId ? 'var(--ember)' : 'var(--line)'),
              borderRadius: 10,
              padding: '9px 0',
              font: "600 11px/1 'Inter'",
              cursor: 'pointer',
            }}
          >
            {d.label} ({d.name})
          </button>
        ))}
      </div>

      {day.blocks.map((block) => (
        <div
          key={block.id}
          style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 14, marginBottom: 12 }}
        >
          <div className="label" style={{ marginBottom: 10 }}>{block.label}</div>
          {block.exercises.map((ex) => (
            <div key={ex.id} style={{ marginBottom: 10 }}>
              <div style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)', marginBottom: 8 }}>{ex.name}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Chip label="Sets" value={ex.sets.length} />
                <Chip label="Reps" value={ex.sets[0]?.reps} />
                <Chip label="Kg" value={ex.sets[0]?.weight} />
              </div>
            </div>
          ))}
        </div>
      ))}

      <Button
        variant="ghost"
        full
        onClick={() => navigate(`/coach/tools/builder?client=${clientId}`)}
      >
        Edit Program
      </Button>
    </div>
  )
}

function Chip({ label, value }) {
  return (
    <div style={{ background: 'var(--surface2)', borderRadius: 9, padding: '6px 10px', textAlign: 'center' }}>
      <div style={{ font: "700 12px/1 'Inter'", color: 'var(--bone)' }}>{value}</div>
      <div style={{ font: "500 8px/1 'Inter'", color: 'var(--muted)', marginTop: 2, textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}
