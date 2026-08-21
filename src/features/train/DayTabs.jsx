export default function DayTabs({ days, activeId, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '0 24px 18px', overflowX: 'auto' }}>
      {days.map((d) => {
        const active = d.id === activeId
        return (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            style={{
              flexShrink: 0,
              background: active ? 'var(--ember)' : 'var(--surface)',
              color: active ? '#fff' : 'var(--boneDim)',
              border: '1px solid ' + (active ? 'var(--ember)' : 'var(--line)'),
              borderRadius: 100,
              padding: '9px 16px',
              font: "600 12px/1 'Inter'",
              cursor: 'pointer',
            }}
          >
            {d.label} <span style={{ opacity: 0.75 }}>({d.name})</span>
          </button>
        )
      })}
    </div>
  )
}
