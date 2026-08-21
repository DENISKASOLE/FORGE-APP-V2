import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'

export default function BackHeader({ title, action }) {
  const navigate = useNavigate()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginLeft: -4 }}
        >
          <ArrowLeft size={20} color="var(--bone)" />
        </button>
        <div style={{ font: "700 17px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.3px' }}>{title}</div>
      </div>
      {action}
    </div>
  )
}
