import { Check } from '@phosphor-icons/react'

export default function SetRow({ index, set, onChange, onToggle }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '20px 1fr 1fr 32px',
        gap: 10,
        alignItems: 'center',
        padding: '8px 0',
      }}
    >
      <div style={{ font: "600 11px/1 'Inter'", color: 'var(--muted)' }}>{index + 1}</div>
      <input
        type="number"
        value={set.reps}
        onChange={(e) => onChange({ ...set, reps: Number(e.target.value) })}
        style={{
          background: 'var(--surface2)',
          border: '1px solid var(--line)',
          borderRadius: 10,
          padding: '8px 10px',
          color: 'var(--bone)',
          font: "600 13px/1 'Inter'",
          width: '100%',
        }}
      />
      <input
        type="number"
        value={set.weight}
        onChange={(e) => onChange({ ...set, weight: Number(e.target.value) })}
        style={{
          background: 'var(--surface2)',
          border: '1px solid var(--line)',
          borderRadius: 10,
          padding: '8px 10px',
          color: 'var(--bone)',
          font: "600 13px/1 'Inter'",
          width: '100%',
        }}
      />
      <button
        onClick={onToggle}
        aria-label={set.done ? 'Mark set not done' : 'Mark set done'}
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          border: '1px solid ' + (set.done ? 'var(--sage)' : 'var(--line)'),
          background: set.done ? 'var(--sageDim)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Check size={16} weight="bold" color={set.done ? 'var(--sage)' : 'var(--muted)'} />
      </button>
    </div>
  )
}
