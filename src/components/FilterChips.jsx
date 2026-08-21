export default function FilterChips({ options, active, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '0 24px 18px', overflowX: 'auto' }}>
      {options.map((opt) => {
        const isActive = opt.value === active
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: isActive ? 'var(--ember)' : 'var(--surface)',
              color: isActive ? '#fff' : 'var(--boneDim)',
              border: '1px solid ' + (isActive ? 'var(--ember)' : 'var(--line)'),
              borderRadius: 100,
              padding: '8px 14px',
              font: "600 11px/1 'Inter'",
              cursor: 'pointer',
            }}
          >
            {opt.label}
            {opt.count != null && (
              <span
                style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--surface2)',
                  borderRadius: 100,
                  padding: '1px 6px',
                  font: "700 10px/1.4 'Inter'",
                }}
              >
                {opt.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
