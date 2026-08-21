import { useNavigate } from 'react-router-dom'
import { useViewMode } from '../hooks/useViewMode'

export default function ViewToggle() {
  const [mode, setMode] = useViewMode()
  const navigate = useNavigate()

  function toggle() {
    const next = mode === 'client' ? 'coach' : 'client'
    setMode(next)
    navigate(next === 'client' ? '/today' : '/coach')
  }

  return (
    <button
      onClick={toggle}
      style={{
        position: 'absolute',
        bottom: 96,
        right: 16,
        zIndex: 50,
        background: 'var(--surface)',
        border: '1px solid var(--lineS)',
        color: 'var(--bone)',
        borderRadius: 100,
        padding: '9px 14px',
        font: "700 9px/1 'Inter'",
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
      }}
      title="Temporary dev toggle between client and coach views"
    >
      {mode === 'client' ? 'View as Coach' : 'View as Client'}
    </button>
  )
}
