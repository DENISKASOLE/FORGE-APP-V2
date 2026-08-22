import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getCoachClientProfiles } from '../../data/coachData'
import Avatar from '../../components/Avatar'
import BackHeader from '../../components/BackHeader'

export default function ClientPicker({ onPick }) {
  const { user } = useAuth()
  const [clients, setClients] = useState(null)

  useEffect(() => {
    getCoachClientProfiles(user?.id).then(setClients)
  }, [user?.id])

  return (
    <div style={{ paddingBottom: 24 }}>
      <BackHeader title="Choose a Client" />
      <div style={{ padding: '0 24px' }}>
        <div style={{ font: "500 12px/1.5 'Inter'", color: 'var(--muted)', marginBottom: 16 }}>
          Pick who this program is for.
        </div>
        {clients?.length === 0 && (
          <div style={{ font: "500 12px/1.5 'Inter'", color: 'var(--muted)' }}>
            No clients are linked to your coach account yet.
          </div>
        )}
        {clients?.map((c) => (
          <button
            key={c.id}
            onClick={() => onPick(c)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              padding: '14px 16px',
              marginBottom: 10,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <Avatar name={c.full_name || c.email} size={36} />
            <div>
              <div style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)' }}>{c.full_name || 'Unnamed client'}</div>
              <div style={{ font: "400 11px/1 'Inter'", color: 'var(--muted)', marginTop: 4 }}>{c.email}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
