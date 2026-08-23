import Button from '../../components/Button'

export default function StepStart({ coach, onStart }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0 0' }}>
      <div style={{ font: "800 28px/1.1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.6px', marginBottom: 10 }}>
        Weekly<br />Check-in
      </div>
      <div style={{ font: "500 13px/1.5 'Inter'", color: 'var(--boneDim)', marginBottom: 36 }}>
        A few quick questions for {coach}.
      </div>
      <Button full onClick={onStart}>Start Check-in</Button>
    </div>
  )
}
