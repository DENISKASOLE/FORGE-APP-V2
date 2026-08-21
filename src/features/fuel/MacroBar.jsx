export default function MacroBar({ label, consumed, target, color }) {
  const pct = Math.min((consumed / target) * 100, 100)
  const over = consumed > target
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span className="label">{label}</span>
        <span style={{ font: "600 11px/1 'Inter'", color: 'var(--boneDim)' }}>
          {consumed}g / {target}g
        </span>
      </div>
      <div style={{ height: 5, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: over ? 'var(--red)' : color,
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  )
}
