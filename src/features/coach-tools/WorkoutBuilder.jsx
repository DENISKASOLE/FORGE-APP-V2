import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getClientById } from '../../data/coachData'
import { getTrainingProgram } from '../../data/clientData'
import BackHeader from '../../components/BackHeader'
import Button from '../../components/Button'

const blockTypes = ['Straight Set', 'Superset', 'Circuit']

export default function WorkoutBuilder() {
  const [params] = useSearchParams()
  const clientId = params.get('client')
  const [client, setClient] = useState(null)
  const [program, setProgram] = useState(null)
  const [dayId, setDayId] = useState(null)
  const [blockType, setBlockType] = useState('Straight Set')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (clientId) getClientById(clientId).then(setClient)
    getTrainingProgram().then((p) => {
      setProgram(p)
      setDayId(p.days[0].id)
    })
  }, [clientId])

  if (!program) return null
  const day = program.days.find((d) => d.id === dayId)

  function updateField(exId, field, value) {
    setProgram((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.id !== dayId
          ? d
          : {
              ...d,
              blocks: d.blocks.map((b) => ({
                ...b,
                exercises: b.exercises.map((ex) =>
                  ex.id === exId
                    ? { ...ex, sets: ex.sets.map((s, i) => (i === 0 ? { ...s, [field]: Number(value) } : s)) }
                    : ex,
                ),
              })),
            },
      ),
    }))
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      <BackHeader
        title={client ? client.name : 'Workout Builder'}
        action={
          <Button
            style={{ padding: '8px 14px' }}
            onClick={() => {
              setSaved(true)
              setTimeout(() => setSaved(false), 1800)
            }}
          >
            Save &amp; Publish
          </Button>
        }
      />

      {saved && (
        <div style={{ margin: '0 24px 16px', padding: '10px 14px', background: 'var(--sageDim)', color: 'var(--sage)', borderRadius: 12, font: "600 12px/1 'Inter'" }}>
          Program saved and published to {client?.name || 'client'}.
        </div>
      )}

      <div style={{ padding: '0 24px 14px', font: "500 12px/1 'Inter'", color: 'var(--muted)' }}>
        Week {program.week}
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 24px 16px', overflowX: 'auto' }}>
        {program.days.map((d) => (
          <button
            key={d.id}
            onClick={() => setDayId(d.id)}
            style={{
              flexShrink: 0,
              background: d.id === dayId ? 'var(--ember)' : 'var(--surface)',
              color: d.id === dayId ? '#fff' : 'var(--boneDim)',
              border: '1px solid ' + (d.id === dayId ? 'var(--ember)' : 'var(--line)'),
              borderRadius: 100,
              padding: '8px 16px',
              font: "600 11px/1 'Inter'",
              cursor: 'pointer',
            }}
          >
            {d.label} ({d.name})
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '0 24px 20px' }}>
        {blockTypes.map((t) => (
          <button
            key={t}
            onClick={() => setBlockType(t)}
            style={{
              flex: 1,
              background: t === blockType ? 'var(--surface2)' : 'transparent',
              color: t === blockType ? 'var(--bone)' : 'var(--muted)',
              border: '1px solid var(--line)',
              borderRadius: 10,
              padding: '8px 0',
              font: "600 10px/1 'Inter'",
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 24px' }}>
        {day.blocks.map((block) => (
          <div
            key={block.id}
            style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 14, marginBottom: 12 }}
          >
            <div className="label" style={{ marginBottom: 10 }}>{block.label}</div>
            {block.exercises.map((ex) => (
              <div key={ex.id} style={{ marginBottom: 12 }}>
                <div style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)', marginBottom: 10 }}>{ex.name}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                  <EditableTile label="Sets" value={ex.sets.length} onChange={() => {}} />
                  <EditableTile label="Reps" value={ex.sets[0]?.reps} onChange={(v) => updateField(ex.id, 'reps', v)} />
                  <EditableTile label="Kg" value={ex.sets[0]?.weight} onChange={(v) => updateField(ex.id, 'weight', v)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <EditableTile label="RPE" value={8} tint="var(--emberDim)" tone="var(--ember)" onChange={() => {}} />
                  <EditableTile label="Tempo" value="2010" onChange={() => {}} />
                  <EditableTile label="Rest" value="90s" onChange={() => {}} />
                </div>
              </div>
            ))}
          </div>
        ))}

        <button
          style={{
            width: '100%',
            border: '1px dashed var(--lineS)',
            borderRadius: 14,
            background: 'transparent',
            color: 'var(--boneDim)',
            padding: '14px',
            font: "600 12px/1 'Inter'",
            cursor: 'pointer',
            marginBottom: 12,
          }}
        >
          + Add Block
        </button>

        <Button variant="outline" full>Save as Template</Button>
      </div>
    </div>
  )
}

function EditableTile({ label, value, onChange, tint, tone }) {
  return (
    <div style={{ background: tint || 'var(--surface2)', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          outline: 'none',
          textAlign: 'center',
          color: tone || 'var(--bone)',
          font: "700 14px/1 'Inter'",
        }}
      />
      <div style={{ font: "500 8px/1 'Inter'", color: 'var(--muted)', marginTop: 6, textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}
