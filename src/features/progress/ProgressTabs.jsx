import { useEffect, useState } from 'react'
import { TrendUp, TrendDown, Minus } from '@phosphor-icons/react'
import { getProgressData } from '../../data/clientData'
import BackHeader from '../../components/BackHeader'
import Card from '../../components/Card'
import WeightChart from './WeightChart'

const tabs = ['Weight', 'PRs', 'Measurements', 'Photos']
const trendIcon = { up: TrendUp, flat: Minus, down: TrendDown }
const trendColor = { up: 'var(--sage)', flat: 'var(--muted)', down: 'var(--red)' }

export default function ProgressTabs() {
  const [tab, setTab] = useState('Weight')
  const [data, setData] = useState(null)

  useEffect(() => {
    getProgressData().then(setData)
  }, [])

  if (!data) return null

  const start = data.weightHistory[0]
  const current = data.weightHistory[data.weightHistory.length - 1]
  const change = (current - start).toFixed(1)

  return (
    <div style={{ paddingBottom: 24 }}>
      <BackHeader title="Progress" />
      <div style={{ display: 'flex', gap: 6, padding: '0 24px 20px', overflowX: 'auto' }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flexShrink: 0,
              background: tab === t ? 'var(--ember)' : 'var(--surface)',
              color: tab === t ? '#fff' : 'var(--boneDim)',
              border: '1px solid ' + (tab === t ? 'var(--ember)' : 'var(--line)'),
              borderRadius: 100,
              padding: '8px 16px',
              font: "600 11px/1 'Inter'",
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 24px' }}>
        {tab === 'Weight' && (
          <Card>
            <WeightChart history={data.weightHistory} />
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <MiniStat label="Start" value={`${start}kg`} />
              <MiniStat label="Current" value={`${current}kg`} />
              <MiniStat
                label="Change"
                value={`${change > 0 ? '+' : ''}${change}kg`}
                color={change <= 0 ? 'var(--sage)' : 'var(--red)'}
              />
            </div>
          </Card>
        )}

        {tab === 'PRs' &&
          data.personalRecords.map((pr) => {
            const Icon = trendIcon[pr.trend]
            return (
              <Card key={pr.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)', marginBottom: 6 }}>{pr.lift}</div>
                    <div style={{ font: "500 11px/1 'Inter'", color: 'var(--muted)' }}>
                      Best {pr.best} · Recent {pr.recent}
                    </div>
                  </div>
                  <Icon size={20} color={trendColor[pr.trend]} />
                </div>
              </Card>
            )
          })}

        {tab === 'Measurements' &&
          data.measurements.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <span style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)' }}>{m.label}</span>
              <span style={{ font: "600 12px/1 'Inter'", color: 'var(--boneDim)' }}>
                {m.current}cm <span style={{ color: 'var(--muted)' }}>(was {m.previous}cm)</span>
              </span>
            </div>
          ))}

        {tab === 'Photos' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '3/4',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, var(--surface2), var(--ink2))',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 10,
                }}
              >
                <span style={{ font: "600 10px/1 'Inter'", color: 'var(--muted)' }}>Week {9 - i}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MiniStat({ label, value, color = 'var(--bone)' }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ font: "800 15px/1 'Inter'", color }}>{value}</div>
      <div className="label" style={{ marginTop: 6 }}>{label}</div>
    </div>
  )
}
