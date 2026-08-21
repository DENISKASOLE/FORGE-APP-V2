import { useEffect, useState } from 'react'
import { getLearnArticles } from '../../data/clientData'
import Pill from '../../components/Pill'

export default function LearnFeed() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    getLearnArticles().then(setArticles)
  }, [])

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: '20px 24px 16px' }}>
        <div style={{ font: "800 22px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.4px' }}>Learn</div>
        <div style={{ font: "500 12px/1 'Inter'", color: 'var(--muted)', marginTop: 6 }}>
          Tips from your coach and the FORGE library
        </div>
      </div>
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {articles.map((a) => (
          <div
            key={a.id}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 16,
              padding: 16,
              display: 'flex',
              gap: 14,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                flexShrink: 0,
                background: 'linear-gradient(135deg, var(--surface2), var(--ink2))',
              }}
            />
            <div>
              <Pill tone={a.color} style={{ marginBottom: 8 }}>{a.tag}</Pill>
              <div style={{ font: "600 13px/1.4 'Inter'", color: 'var(--bone)' }}>{a.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
