import { useNavigate } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import Pill from '../../components/Pill'

export default function RosterCard({ client }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(`/coach/clients/${client.id}`)}
      style={{
        width: '100%',
        textAlign: 'left',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        cursor: 'pointer',
      }}
    >
      <Avatar name={client.name} url={client.avatarUrl} size={44} />
      <div style={{ flex: 1 }}>
        <div style={{ font: "700 14px/1 'Inter'", color: 'var(--bone)', marginBottom: 4 }}>{client.name}</div>
        {client.week && (
          <div style={{ font: "500 11px/1 'Inter'", color: 'var(--muted)', marginBottom: 6 }}>{client.week}</div>
        )}
        <div style={{ display: 'flex', gap: 12, font: "600 11px/1 'Inter'", color: 'var(--boneDim)' }}>
          <span>{client.compliance != null ? `${client.compliance}% compliance` : 'No data yet'}</span>
          {client.nextPayment && <span>Next: {client.nextPayment}</span>}
        </div>
      </div>
      <Pill tone={client.tone} style={{ position: 'absolute', top: 12, right: 12 }}>
        {client.status}
      </Pill>
    </button>
  )
}
