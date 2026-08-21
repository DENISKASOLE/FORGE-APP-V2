import Card from '../../components/Card'

export default function ExerciseBlockPreview({ block }) {
  return (
    <Card style={{ marginBottom: 12 }}>
      <div className="label" style={{ marginBottom: 10 }}>{block.label}</div>
      {block.exercises.map((ex) => (
        <div
          key={ex.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderTop: '1px solid var(--line)',
          }}
        >
          <div>
            <div style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)' }}>{ex.name}</div>
            <div style={{ font: "500 10px/1 'Inter'", color: 'var(--muted)', marginTop: 4 }}>{ex.group}</div>
          </div>
          <div style={{ font: "600 11px/1 'Inter'", color: 'var(--boneDim)' }}>
            {ex.sets.length} × {ex.sets[0]?.reps}
          </div>
        </div>
      ))}
    </Card>
  )
}
