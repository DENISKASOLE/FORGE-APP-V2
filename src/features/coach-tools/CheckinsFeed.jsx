import { useEffect, useState } from 'react'
import { getCoachCheckins } from '../../data/coachData'
import BackHeader from '../../components/BackHeader'
import FilterChips from '../../components/FilterChips'
import Pill from '../../components/Pill'
import Button from '../../components/Button'

export default function CheckinsFeed() {
  const [checkins, setCheckins] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getCoachCheckins().then(setCheckins)
  }, [])

  function markReviewed(id) {
    setCheckins((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'reviewed' } : c)))
  }

  const pendingCount = checkins.filter((c) => c.status === 'pending').length
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending', count: pendingCount },
    { value: 'reviewed', label: 'Reviewed' },
  ]
  const filtered = checkins.filter((c) => filter === 'all' || c.status === filter)

  return (
    <div style={{ paddingBottom: 24 }}>
      <BackHeader title="Check-ins" />
      <FilterChips options={filters} active={filter} onSelect={setFilter} />
      <div style={{ padding: '0 24px' }}>
        {filtered.length === 0 && (
          <div style={{ font: "500 12px/1.5 'Inter'", color: 'var(--muted)', padding: '20px 0' }}>
            No check-ins submitted yet.
          </div>
        )}
        {filtered.map((c) => (
          <div
            key={c.id}
            style={{
              background: c.status === 'pending' ? 'rgba(242,133,61,0.07)' : 'var(--surface)',
              border: '1px solid ' + (c.status === 'pending' ? 'var(--ember)' : 'var(--line)'),
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ font: "700 14px/1 'Inter'", color: 'var(--bone)', marginBottom: 4 }}>{c.clientName}</div>
                <div style={{ font: "500 11px/1 'Inter'", color: 'var(--muted)' }}>Week {c.week} check-in · {c.date}</div>
              </div>
              {c.status === 'pending' ? (
                <span style={{ background: 'var(--red)', color: '#fff', borderRadius: 6, padding: '3px 8px', font: "700 9px/1.4 'Inter'" }}>
                  NEW
                </span>
              ) : (
                <Pill tone="sage">Reviewed</Pill>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
              <QuickStat label="Weight" value={`${c.weight}kg`} />
              <QuickStat label="Energy" value={`${c.energy}/10`} />
              <QuickStat label="Nutrition" value={`${c.nutrition}%`} />
              <QuickStat label="Photos" value={c.photos} />
            </div>

            {c.status === 'pending' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button style={{ flex: 1, padding: '10px 0' }} onClick={() => markReviewed(c.id)}>
                  Review
                </Button>
                <Button variant="surface" style={{ flex: 1, padding: '10px 0' }}>
                  Compare vs Wk {c.week - 1}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickStat({ label, value }) {
  return (
    <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '8px 4px', textAlign: 'center' }}>
      <div style={{ font: "700 12px/1 'Inter'", color: 'var(--bone)' }}>{value}</div>
      <div style={{ font: "500 8px/1 'Inter'", color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}
