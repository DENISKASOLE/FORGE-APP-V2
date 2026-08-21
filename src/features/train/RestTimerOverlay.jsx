import ProgressRing from '../../components/ProgressRing'

export default function RestTimerOverlay({ seconds, total, nextExercise, onSkip, onAdd }) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        zIndex: 20,
      }}
    >
      <div className="label">Rest</div>
      <ProgressRing size={180} stroke={8} progress={1 - seconds / total} color="var(--ember)">
        <span style={{ font: "800 48px/1 'Inter'", color: 'var(--ember)', letterSpacing: '-1px' }}>
          {mm}:{ss}
        </span>
      </ProgressRing>
      {nextExercise && (
        <div style={{ font: "500 12px/1 'Inter'", color: 'var(--boneDim)' }}>
          Next: {nextExercise}
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <button
          onClick={onAdd}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            color: 'var(--bone)',
            borderRadius: 100,
            padding: '10px 20px',
            font: "700 12px/1 'Inter'",
            cursor: 'pointer',
          }}
        >
          +30s
        </button>
        <button
          onClick={onSkip}
          style={{
            background: 'var(--emberDim)',
            border: 'none',
            color: 'var(--ember)',
            borderRadius: 100,
            padding: '10px 20px',
            font: "700 12px/1 'Inter'",
            cursor: 'pointer',
          }}
        >
          Skip
        </button>
      </div>
    </div>
  )
}
