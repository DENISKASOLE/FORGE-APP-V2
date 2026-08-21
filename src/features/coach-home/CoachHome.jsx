import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from '@phosphor-icons/react'
import { getCoachHomeData } from '../../data/coachData'
import Avatar from '../../components/Avatar'
import FilterChips from '../../components/FilterChips'
import ClientListCard from './ClientListCard'

const filters = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'attention', label: '⚠ Attention' },
  { value: 'checkins', label: 'Check-ins' },
]

export default function CoachHome() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getCoachHomeData().then(setData)
  }, [])

  if (!data) return null

  const clients = data.coachClients.filter((c) => {
    if (filter === 'attention') return c.attention
    if (filter === 'checkins') return c.status === 'Check-in due'
    return true
  })

  return (
    <div style={{ paddingBottom: 24, position: 'relative', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 24px 18px' }}>
        <div>
          <div style={{ font: "800 13px/1 'Inter'", color: 'var(--bone)', letterSpacing: '0.1em', marginBottom: 14 }}>
            FORGE
          </div>
          <div style={{ font: "800 22px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.4px' }}>
            Good morning, Coach
          </div>
          <div style={{ font: "400 11px/1 'Inter'", color: 'var(--muted)', marginTop: 4 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <Avatar name={data.coachProfile.name} size={46} online />
      </div>

      <div style={{ display: 'flex', gap: 10, padding: '0 24px 20px' }}>
        <Stat value={data.coachProfile.activeClients} label="Active Clients" color="var(--bone)" />
        <Stat value={data.coachProfile.monthRevenue} label="Month Revenue" color="var(--sage)" />
        <Stat
          value={data.coachProfile.needsAttention}
          label="Needs Attention"
          color="var(--red)"
          tint="rgba(220,80,70,0.08)"
        />
      </div>

      <FilterChips options={filters} active={filter} onSelect={setFilter} />

      <div style={{ padding: '0 24px' }}>
        {clients.map((c) => (
          <ClientListCard key={c.id} client={c} />
        ))}
      </div>

      <button
        onClick={() => navigate('/coach/clients')}
        style={{
          position: 'absolute',
          bottom: 160,
          right: 16,
          width: 50,
          height: 50,
          borderRadius: 15,
          background: 'var(--ember)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(242,133,61,0.45)',
          zIndex: 30,
        }}
      >
        <Plus size={22} color="#fff" weight="bold" />
      </button>
    </div>
  )
}

function Stat({ value, label, color, tint }) {
  return (
    <div
      style={{
        flex: 1,
        background: tint || 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        padding: '14px 10px',
        textAlign: 'center',
      }}
    >
      <div style={{ font: "800 24px/1 'Inter'", color }}>{value}</div>
      <div className="label" style={{ marginTop: 6 }}>{label}</div>
    </div>
  )
}
