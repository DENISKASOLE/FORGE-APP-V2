export default function Slider({ label, value, onChange, color = 'var(--sage)' }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span className="label">{label}</span>
        <span
          style={{
            background: 'var(--surface2)',
            color,
            borderRadius: 100,
            padding: '2px 10px',
            font: "700 11px/1.6 'Inter'",
          }}
        >
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: color }}
      />
    </div>
  )
}
