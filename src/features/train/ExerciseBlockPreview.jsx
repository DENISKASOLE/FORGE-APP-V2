import Card from '../../components/Card'

export default function ExerciseBlockPreview({ label, programExercises }) {
  return (
    <Card style={{ marginBottom: 12 }}>
      <div className="label" style={{ marginBottom: 10 }}>{label}</div>
      {programExercises.map((pe) => (
        <div
          key={pe.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderTop: '1px solid var(--line)',
          }}
        >
          <div>
            <div style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)' }}>{pe.exercises.name}</div>
            <div style={{ font: "500 10px/1 'Inter'", color: 'var(--muted)', marginTop: 4 }}>
              {pe.exercises.muscle_group}
            </div>
          </div>
          <div style={{ font: "600 11px/1 'Inter'", color: 'var(--boneDim)' }}>
            {pe.sets} × {pe.reps}
          </div>
        </div>
      ))}
    </Card>
  )
}
