export default function Avatar({ name = '', size = 44, online = false }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'var(--emberGradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          font: `700 ${Math.round(size * 0.4)}px/1 'Inter'`,
        }}
      >
        {initial}
      </div>
      {online && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size * 0.26,
            height: size * 0.26,
            borderRadius: '50%',
            background: 'var(--sage)',
            border: '2px solid var(--ink)',
          }}
        />
      )}
    </div>
  )
}
