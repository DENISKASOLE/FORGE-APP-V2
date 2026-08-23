import Button from '../../components/Button'

export default function IntakeStart({ onStart }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0 0' }}>
      <div style={{ font: "800 28px/1.1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.6px', marginBottom: 10 }}>
        Client<br />Intake
      </div>
      <div style={{ font: "500 13px/1.5 'Inter'", color: 'var(--boneDim)', marginBottom: 36 }}>
        A few minutes of questions so your coach can build a program around
        you — your goals, training history, health, and how you like to be
        coached.
      </div>
      <Button full onClick={onStart}>Start</Button>
    </div>
  )
}
