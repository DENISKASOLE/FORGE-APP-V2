export default function BottomTimerSection({ rest, onAdd30, onSubtract30, onSkip }) {
  if (!rest) {
    return (
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 18,
          padding: '16px 18px',
          textAlign: 'center',
          font: "500 11px/1.4 'Inter'",
          color: 'var(--muted)',
        }}
      >
        Rest timer starts automatically once you check off a set.
      </div>
    )
  }

  const mm = String(Math.floor(rest.remaining / 60)).padStart(2, '0')
  const ss = String(rest.remaining % 60).padStart(2, '0')

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--ember)',
        borderRadius: 18,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <button onClick={onSubtract30} style={timerButtonStyle}>
        −30s
      </button>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div className="label" style={{ marginBottom: 2 }}>Rest</div>
        <div style={{ font: "800 26px/1 'Inter'", color: 'var(--ember)', letterSpacing: '-0.5px', fontVariantNumeric: 'tabular-nums' }}>
          {mm}:{ss}
        </div>
        {rest.next && (
          <div style={{ font: "500 10px/1 'Inter'", color: 'var(--muted)', marginTop: 4 }}>Next: {rest.next}</div>
        )}
      </div>
      <button onClick={onAdd30} style={timerButtonStyle}>
        +30s
      </button>
      <button onClick={onSkip} style={{ ...timerButtonStyle, background: 'var(--emberDim)', color: 'var(--ember)', border: 'none' }}>
        Skip
      </button>
    </div>
  )
}

const timerButtonStyle = {
  background: 'var(--surface2)',
  border: '1px solid var(--line)',
  color: 'var(--bone)',
  borderRadius: 100,
  padding: '9px 12px',
  font: "700 11px/1 'Inter'",
  cursor: 'pointer',
  flexShrink: 0,
}
