import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardText, Barbell, BookOpen, CreditCard, Files, ChartLineUp } from '@phosphor-icons/react'
import { useAuth } from '../../hooks/useAuth'
import { getCoachTools } from '../../data/coachData'

const icons = {
  templates: Barbell,
  library: ClipboardText,
  learn: BookOpen,
  payments: CreditCard,
  intake: Files,
  checkins: ClipboardText,
}

const routes = {
  checkins: '/coach/tools/checkins',
  templates: '/coach/tools/builder',
  library: '/coach/tools/library',
  intake: '/coach/tools/intake',
}

export default function ToolsGrid() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tools, setTools] = useState([])

  useEffect(() => {
    getCoachTools(user?.id).then(setTools)
  }, [user?.id])

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: '20px 24px 18px' }}>
        <div style={{ font: "800 26px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.5px' }}>Tools</div>
      </div>

      <div style={{ padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {tools.map((tool) => {
          const Icon = icons[tool.id] || ClipboardText
          return (
            <button
              key={tool.id}
              onClick={() => navigate(routes[tool.id] || '/coach/tools')}
              style={{
                position: 'relative',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 18,
                padding: '18px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
              }}
            >
              {tool.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'var(--red)',
                    color: '#fff',
                    borderRadius: 100,
                    padding: '2px 6px',
                    font: "700 8px/1.4 'Inter'",
                  }}
                >
                  {tool.badge} new
                </span>
              )}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `var(--${tool.tone}Dim)`,
                  border: `1px solid rgba(255,255,255,0.06)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} color={`var(--${tool.tone})`} />
              </div>
              <span style={{ font: "600 11px/1.3 'Inter'", color: 'var(--bone)', textAlign: 'center' }}>{tool.label}</span>
            </button>
          )
        })}

        <button
          onClick={() => {}}
          style={{
            gridColumn: '1 / -1',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 18,
            padding: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--sageDim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ChartLineUp size={20} color="var(--sage)" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ font: "600 12px/1 'Inter'", color: 'var(--bone)', marginBottom: 4 }}>Analytics</div>
            <div style={{ font: "400 10px/1.4 'Inter'", color: 'var(--muted)' }}>
              Revenue, retention, and compliance trends
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
