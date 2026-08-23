import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaretRight } from '@phosphor-icons/react'
import { useAuth } from '../../hooks/useAuth'
import { getCoachIntakeList } from '../../data/intake'
import BackHeader from '../../components/BackHeader'
import Pill from '../../components/Pill'

export default function IntakeList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [clients, setClients] = useState([])

  useEffect(() => {
    getCoachIntakeList(user?.id).then(setClients)
  }, [user?.id])

  return (
    <div style={{ paddingBottom: 24 }}>
      <BackHeader title="Intake Forms" />
      <div style={{ padding: '0 24px' }}>
        {clients.length === 0 && (
          <div style={{ font: "500 12px/1.5 'Inter'", color: 'var(--muted)', padding: '20px 0' }}>
            No clients yet.
          </div>
        )}
        {clients.map((c) => (
          <button
            key={c.id}
            onClick={() => c.submitted && navigate(`/coach/tools/intake/${c.id}`)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              padding: '14px 16px',
              marginBottom: 10,
              cursor: c.submitted ? 'pointer' : 'default',
              opacity: c.submitted ? 1 : 0.7,
            }}
          >
            <span style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)' }}>{c.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Pill tone={c.submitted ? 'sage' : 'muted'}>{c.submitted ? 'Submitted' : 'Pending'}</Pill>
              {c.submitted && <CaretRight size={16} color="var(--muted)" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
