import { useNavigate } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import ActivityBars from './ActivityBars'

function complianceColor(pct) {
  if (pct == null) return 'var(--muted)'
  if (pct >= 80) return 'var(--sage)'
  if (pct >= 60) return 'var(--amber)'
  return 'var(--red)'
}

export default function ClientListCard({ client }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(`/coach/clients/${client.id}`)}
      style={{
        width: '100%',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        background: client.attention ? 'rgba(220,80,70,0.05)' : 'var(--surface)',
        border: '1px solid ' + (client.attention ? 'var(--red)' : 'var(--line)'),
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={client.name} size={40} />
        <div style={{ flex: 1 }}>
          <div style={{ font: "600 14px/1 'Inter'", color: 'var(--bone)' }}>{client.name}</div>
          <div style={{ font: "500 11px/1 'Inter'", color: 'var(--muted)', marginTop: 4 }}>{client.status}</div>
        </div>
        <div style={{ font: "800 16px/1 'Inter'", color: complianceColor(client.compliance) }}>
          {client.compliance != null ? `${client.compliance}%` : '—'}
        </div>
      </div>
      <ActivityBars activity={client.activity} />
    </button>
  )
}
