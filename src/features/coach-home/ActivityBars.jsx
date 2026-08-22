const defaultLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function ActivityBars({ activity, labels = defaultLabels }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {activity.map((state, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div
            style={{
              width: 12,
              height: 20,
              borderRadius: 3,
              background: state === 'done' ? 'var(--sage)' : 'var(--surface2)',
              border: state === 'miss' ? '1px solid var(--red)' : 'none',
            }}
          />
          <span style={{ font: "500 8px/1 'Inter'", color: 'var(--muted)' }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}
