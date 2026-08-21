import ProgressRing from '../../components/ProgressRing'

export default function HabitRings({ rings }) {
  return (
    <div style={{ display: 'flex', gap: 18, overflowX: 'auto', padding: '8px 24px 20px' }}>
      {rings.map((r) => (
        <div key={r.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <ProgressRing size={64} stroke={6} progress={r.value / r.target} color={r.color}>
            <span style={{ font: "700 12px/1 'Inter'", color: 'var(--bone)' }}>
              {r.value}
              <span style={{ fontSize: 8, color: 'var(--muted)' }}>{r.unit}</span>
            </span>
          </ProgressRing>
          <div className="label">{r.label}</div>
        </div>
      ))}
    </div>
  )
}
