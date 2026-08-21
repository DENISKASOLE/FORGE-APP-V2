import { CheckCircle } from '@phosphor-icons/react'
import Avatar from '../../components/Avatar'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'

export default function StepSubmitted({ coach }) {
  const navigate = useNavigate()
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '50px 0 0',
        background: 'radial-gradient(circle at 50% 20%, rgba(102,199,155,0.16), transparent 60%)',
      }}
    >
      <CheckCircle size={64} weight="fill" color="var(--sage)" />
      <div style={{ font: "800 30px/1.1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.8px', margin: '20px 0 24px' }}>
        Check-in<br />Submitted!
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 16,
          padding: 16,
          textAlign: 'left',
          marginBottom: 28,
        }}
      >
        <Avatar name={coach} size={40} online />
        <div>
          <div style={{ font: "700 9px/1 'Inter'", color: 'var(--ember)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>
            {coach}
          </div>
          <div style={{ font: "500 12px/1.4 'Inter'", color: 'var(--boneDim)' }}>
            Will review your check-in within 24h.
          </div>
        </div>
      </div>
      <Button full onClick={() => navigate('/today')}>Back to Today</Button>
    </div>
  )
}
