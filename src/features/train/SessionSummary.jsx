import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle } from '@phosphor-icons/react'
import Button from '../../components/Button'
import Pill from '../../components/Pill'

export default function SessionSummary() {
  const { state } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!state) navigate('/train', { replace: true })
  }, [state, navigate])

  if (!state) return null

  const mm = String(Math.floor(state.duration / 60)).padStart(2, '0')
  const ss = String(state.duration % 60).padStart(2, '0')

  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 0%, var(--emberGlowSoft), transparent 60%)',
      }}
    >
      <CheckCircle size={64} weight="fill" color="var(--sage)" />
      <div style={{ font: "800 24px/1.1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.5px', marginTop: 20 }}>
        Workout Complete!
      </div>
      <div style={{ font: "500 13px/1 'Inter'", color: 'var(--muted)', marginTop: 6 }}>{state.name}</div>

      <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 28 }}>
        <Stat label="Duration" value={`${mm}:${ss}`} />
        <Stat label="Volume (kg)" value={state.totalVolume} />
        <Stat label="Sets Done" value={`${state.setsCompleted}/${state.totalSets}`} />
      </div>

      {state.prCount > 0 && (
        <Pill tone="amber" style={{ marginTop: 20 }}>
          {state.prCount} personal record{state.prCount > 1 ? 's' : ''} today
        </Pill>
      )}

      {state.synced === false && (
        <div style={{ font: "500 10px/1.4 'Inter'", color: 'var(--muted)', marginTop: 16 }}>
          This session wasn't saved to your log.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', marginTop: 32 }}>
        <Button full>Save &amp; Share</Button>
        <Button variant="outline" full onClick={() => navigate('/today')}>
          Back to Plan
        </Button>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        flex: 1,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        padding: '14px 8px',
      }}
    >
      <div style={{ font: "800 20px/1 'Inter'", color: 'var(--bone)' }}>{value}</div>
      <div className="label" style={{ marginTop: 6 }}>{label}</div>
    </div>
  )
}
