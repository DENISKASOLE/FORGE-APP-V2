import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaretRight, SignOut } from '@phosphor-icons/react'
import { getMeHubData } from '../../data/clientData'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../../components/Avatar'
import Pill from '../../components/Pill'

const links = [
  { to: '/me/profile', label: 'Profile' },
  { to: '/me/payments', label: 'Payments' },
  { to: '/me/messages', label: 'Message Coach' },
  { to: '/me/learn', label: 'Learn' },
]

export default function MeHub() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    getMeHubData().then(setData)
  }, [])

  if (!data) return null

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: '32px 24px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <Avatar name={data.client.fullName} size={72} />
        </div>
        <div style={{ font: "800 20px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.3px', marginBottom: 8 }}>
          {data.client.fullName}
        </div>
        <Pill tone="sage">{data.client.coach.name}</Pill>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 24px 24px' }}>
        <MiniStat label="Week" value={data.client.week} />
        <MiniStat label="Program" value={data.client.program} small />
        <MiniStat label="Days Active" value={data.client.daysActive} />
      </div>

      <div style={{ padding: '0 24px' }}>
        {links.map((link) => (
          <button
            key={link.to}
            onClick={() => navigate(link.to)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              padding: '16px 18px',
              marginBottom: 10,
              cursor: 'pointer',
            }}
          >
            <span style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)' }}>{link.label}</span>
            <CaretRight size={16} color="var(--muted)" />
          </button>
        ))}

        <button
          onClick={signOut}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'none',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: '16px 18px',
            marginTop: 8,
            color: 'var(--red)',
            font: "600 12px/1 'Inter'",
            cursor: 'pointer',
          }}
        >
          <SignOut size={16} /> Log Out
        </button>
      </div>
    </div>
  )
}

function MiniStat({ label, value, small }) {
  return (
    <div
      style={{
        flex: 1,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        padding: '12px 10px',
        textAlign: 'center',
      }}
    >
      <div style={{ font: `700 ${small ? 11 : 16}px/1.2 'Inter'`, color: 'var(--bone)' }}>{value}</div>
      <div className="label" style={{ marginTop: 6 }}>{label}</div>
    </div>
  )
}
