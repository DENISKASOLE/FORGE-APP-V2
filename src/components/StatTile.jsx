export default function StatTile({ label, value, color = 'var(--bone)', tint }) {
  return (
    <div
      style={{
        flex: 1,
        background: tint || 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        padding: '14px 12px',
        textAlign: 'center',
      }}
    >
      <div style={{ font: "800 22px/1 'Inter'", color, letterSpacing: '-0.4px' }}>{value}</div>
      <div className="label" style={{ marginTop: 6 }}>
        {label}
      </div>
    </div>
  )
}
