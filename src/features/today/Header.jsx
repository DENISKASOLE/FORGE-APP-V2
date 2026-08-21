export default function Header({ name }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
  return (
    <div style={{ padding: '20px 24px 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <div style={{ font: "800 13px/1 'Inter'", color: 'var(--bone)', letterSpacing: '0.1em' }}>
          FORGE
        </div>
        <div style={{ font: "600 8px/1 'Inter'", color: 'var(--muted)', letterSpacing: '0.14em' }}>
          PERFORMANCE
        </div>
      </div>
      <div style={{ font: "400 11px/1 'Inter'", color: 'var(--muted)', marginBottom: 4 }}>{today}</div>
      <div style={{ font: "800 26px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.4px' }}>
        Good morning,<br />
        {name}.
      </div>
    </div>
  )
}
