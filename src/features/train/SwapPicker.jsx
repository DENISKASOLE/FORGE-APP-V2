import { ArrowsClockwise, Check } from '@phosphor-icons/react'

export default function SwapPicker({ planned, options, selectedId, onPick }) {
  return (
    <div
      style={{
        background: 'var(--surface2)',
        border: '1px solid var(--line)',
        borderRadius: 12,
        padding: 10,
        marginTop: 10,
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <ArrowsClockwise size={13} color="var(--ember)" />
        <span className="label" style={{ color: 'var(--ember)' }}>Coach-approved swaps</span>
      </div>
      {[planned, ...options].map((ex) => {
        const active = ex.id === selectedId
        return (
          <button
            key={ex.id}
            onClick={() => onPick(ex)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: active ? 'var(--emberDim)' : 'none',
              border: 'none',
              borderRadius: 8,
              padding: '8px 10px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{ font: "600 12px/1 'Inter'", color: active ? 'var(--ember)' : 'var(--boneDim)' }}>
              {ex.name}
              {ex.id === planned.id && <span style={{ color: 'var(--muted)', fontWeight: 500 }}> (original)</span>}
            </span>
            {active && <Check size={14} weight="bold" color="var(--ember)" />}
          </button>
        )
      })}
    </div>
  )
}
