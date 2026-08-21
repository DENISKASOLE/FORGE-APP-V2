import Pill from '../../components/Pill'

export default function LearnCarousel({ tips }) {
  return (
    <div style={{ padding: '0 0 24px' }}>
      <div className="label" style={{ padding: '0 24px 12px' }}>Learn</div>
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '0 24px' }}>
        {tips.map((tip) => (
          <div
            key={tip.id}
            style={{
              flexShrink: 0,
              width: 200,
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: 90,
                background: `linear-gradient(135deg, var(--surface2), var(--ink2))`,
              }}
            />
            <div style={{ padding: 14 }}>
              <Pill tone="violet" style={{ marginBottom: 10 }}>{tip.tag}</Pill>
              <div style={{ font: "600 12px/1.4 'Inter'", color: 'var(--bone)' }}>{tip.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
