import { useNavigate } from 'react-router-dom'
import { ClipboardText, CaretRight } from '@phosphor-icons/react'

export default function IntakeBanner() {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/intake')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        width: 'calc(100% - 48px)',
        margin: '0 24px 20px',
        background: 'var(--emberGradient)',
        border: 'none',
        borderRadius: 18,
        padding: '16px 18px',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: 'rgba(255,255,255,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <ClipboardText size={20} color="#fff" weight="fill" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ font: "700 13px/1 'Inter'", color: '#fff', marginBottom: 4 }}>Complete your intake form</div>
        <div style={{ font: "500 11px/1.4 'Inter'", color: 'rgba(255,255,255,0.85)' }}>
          A few minutes so your coach can build your program.
        </div>
      </div>
      <CaretRight size={18} color="#fff" />
    </button>
  )
}
