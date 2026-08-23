import { CheckCircle } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'

export default function IntakeSubmitted() {
  const navigate = useNavigate()
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '50px 0 0',
        background: 'radial-gradient(circle at 50% 20%, var(--emberGlowSoft), transparent 60%)',
      }}
    >
      <CheckCircle size={64} weight="fill" color="var(--sage)" />
      <div style={{ font: "800 26px/1.1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.6px', margin: '20px 0 16px' }}>
        Intake<br />Submitted!
      </div>
      <div style={{ font: "500 13px/1.5 'Inter'", color: 'var(--boneDim)', marginBottom: 28 }}>
        Thanks — your coach can now see your answers and build your program.
      </div>
      <Button full onClick={() => navigate('/today')}>Back to Today</Button>
    </div>
  )
}
