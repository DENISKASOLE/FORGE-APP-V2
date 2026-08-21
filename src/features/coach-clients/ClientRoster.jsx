import { useEffect, useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { getCoachClients } from '../../data/coachData'
import FilterChips from '../../components/FilterChips'
import RosterCard from './RosterCard'

export default function ClientRoster() {
  const [clients, setClients] = useState([])
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    getCoachClients().then(setClients)
  }, [])

  const filtered = clients
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    .filter((c) => {
      if (filter === 'ontrack') return c.status === 'On track'
      if (filter === 'attention') return c.attention
      if (filter === 'checkin') return c.status === 'Check-in due'
      return true
    })

  const filters = [
    { value: 'all', label: 'All', count: clients.length },
    { value: 'ontrack', label: 'On Track' },
    { value: 'attention', label: 'Needs Attention' },
    { value: 'checkin', label: 'Check-in Due' },
  ]

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px' }}>
        <div style={{ font: "800 26px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.5px' }}>Clients</div>
        <button
          style={{
            background: 'var(--ember)',
            color: '#fff',
            border: 'none',
            borderRadius: 100,
            padding: '9px 16px',
            font: "700 11px/1 'Inter'",
            cursor: 'pointer',
          }}
        >
          + Add Client
        </button>
      </div>

      <div style={{ padding: '0 24px 16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            padding: '10px 14px',
          }}
        >
          <MagnifyingGlass size={16} color="var(--muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients…"
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--bone)', font: "500 13px/1 'Inter'", flex: 1 }}
          />
        </div>
      </div>

      <FilterChips options={filters} active={filter} onSelect={setFilter} />

      <div style={{ padding: '0 24px' }}>
        {filtered.map((c) => (
          <RosterCard key={c.id} client={c} />
        ))}
      </div>
    </div>
  )
}
