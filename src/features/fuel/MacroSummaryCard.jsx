import Card from '../../components/Card'
import Pill from '../../components/Pill'
import ProgressRing from '../../components/ProgressRing'
import MacroBar from './MacroBar'

export default function MacroSummaryCard({ targets, coachName }) {
  const kcalLeft = Math.max(targets.kcalTarget - targets.kcalConsumed, 0)
  const proteinLeft = Math.max(targets.protein.target - targets.protein.consumed, 0)

  return (
    <Card style={{ margin: '0 24px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span className="label">Today's Targets</span>
        <Pill tone="sage">{coachName}</Pill>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 18 }}>
        <ProgressRing size={88} stroke={8} progress={targets.kcalConsumed / targets.kcalTarget}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ font: "800 18px/1 'Inter'", color: 'var(--bone)' }}>{targets.kcalConsumed}</div>
            <div style={{ font: "500 8px/1 'Inter'", color: 'var(--muted)', marginTop: 2 }}>
              / {targets.kcalTarget} kcal
            </div>
          </div>
        </ProgressRing>
        <div style={{ flex: 1 }}>
          <MacroBar label="Protein" consumed={targets.protein.consumed} target={targets.protein.target} color={targets.protein.color} />
          <MacroBar label="Carbs" consumed={targets.carbs.consumed} target={targets.carbs.target} color={targets.carbs.color} />
          <MacroBar label="Fat" consumed={targets.fat.consumed} target={targets.fat.target} color={targets.fat.color} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Callout value={kcalLeft} label="Kcal Left" color="var(--ember)" />
        <Callout value={`${proteinLeft}g`} label="Protein Left" color="var(--court)" />
        <Callout value={`${targets.adherence}%`} label="Adherence" color="var(--sage)" />
        <Callout value={targets.streak != null ? targets.streak : '—'} label="Streak" color="var(--amber)" />
      </div>
    </Card>
  )
}

function Callout({ value, label, color }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ font: "800 15px/1 'Inter'", color }}>{value}</div>
      <div style={{ font: "500 8px/1 'Inter'", color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
    </div>
  )
}
