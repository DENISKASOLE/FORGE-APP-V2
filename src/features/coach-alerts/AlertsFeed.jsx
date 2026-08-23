import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WarningCircle, CreditCard } from '@phosphor-icons/react'
import { getCoachAlerts } from '../../data/coachData'
import FilterChips from '../../components/FilterChips'

const severityTint = {
  red: { bg: 'rgba(220,80,70,0.08)', border: 'var(--red)' },
  amber: { bg: 'rgba(240,190,60,0.08)', border: 'var(--amber)' },
  ember: { bg: 'var(--emberDim)', border: 'var(--ember)' },
  sage: { bg: 'var(--sageDim)', border: 'var(--sage)' },
  violet: { bg: 'var(--violetDim)', border: 'var(--violet)' },
}

const icon = {
  'payment-overdue': <WarningCircle size={20} color="var(--red)" />,
  'food-gap': <span style={{ fontSize: 18 }}>🍎</span>,
  'workout-gap': <span style={{ fontSize: 18 }}>💪</span>,
  'payment-due': <CreditCard size={20} color="var(--sage)" />,
  birthday: <span style={{ fontSize: 18 }}>🎂</span>,
}

export default function AlertsFeed() {
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState([])
  const [handled, setHandled] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getCoachAlerts().then(setAlerts)
  }, [])

  const unhandledCount = alerts.filter((a) => !handled.includes(a.id)).length
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'unhandled', label: 'Unhandled', count: unhandledCount },
    { value: 'handled', label: 'Handled' },
  ]

  const visible = alerts.filter((a) => {
    const isHandled = handled.includes(a.id)
    if (filter === 'unhandled') return !isHandled
    if (filter === 'handled') return isHandled
    return true
  })

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 24px 16px' }}>
        <div style={{ font: "800 26px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.5px' }}>Alerts</div>
        {unhandledCount > 0 && (
          <span style={{ background: 'var(--red)', color: '#fff', borderRadius: 100, padding: '3px 9px', font: "700 10px/1.4 'Inter'" }}>
            {unhandledCount} unhandled
          </span>
        )}
      </div>

      <FilterChips options={filters} active={filter} onSelect={setFilter} />

      <div style={{ padding: '0 24px' }}>
        {visible.length === 0 && (
          <div style={{ font: "500 12px/1.5 'Inter'", color: 'var(--muted)', padding: '20px 0' }}>
            Nothing needs your attention right now.
          </div>
        )}
        {visible.map((a) => {
          const tint = severityTint[a.severity]
          const isHandled = handled.includes(a.id)
          return (
            <div
              key={a.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                background: tint.bg,
                border: `1px solid ${tint.border}`,
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                opacity: isHandled ? 0.5 : 1,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {icon[a.type]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)', marginBottom: 4 }}>{a.clientName}</div>
                <div style={{ font: "500 11px/1 'Inter'", color: 'var(--boneDim)', marginBottom: 10 }}>{a.detail}</div>
                {!isHandled && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => navigate(`/coach/clients/${a.clientId}`)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: tint.border,
                        font: "700 11px/1 'Inter'",
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {a.type === 'birthday' ? 'Send wishes' : 'Open Client'}
                    </button>
                    <button
                      onClick={() => setHandled((prev) => [...prev, a.id])}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--muted)',
                        font: "700 11px/1 'Inter'",
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {a.type === 'birthday' ? 'Dismiss' : 'Mark Handled'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
