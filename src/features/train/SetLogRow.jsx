import { Check } from '@phosphor-icons/react'

export default function SetLogRow({ index, set, previous, onChange, onToggle }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '18px 1fr 1fr 44px 32px',
        gap: 8,
        alignItems: 'center',
        padding: '8px 0',
      }}
    >
      <div style={{ font: "600 11px/1 'Inter'", color: 'var(--muted)' }}>{index + 1}</div>
      <input
        type="number"
        value={set.reps}
        placeholder={previous ? String(previous.reps) : ''}
        onChange={(e) => onChange({ ...set, reps: e.target.value === '' ? '' : Number(e.target.value) })}
        style={inputStyle}
      />
      <input
        type="number"
        value={set.weight}
        placeholder={previous ? String(previous.weight) : ''}
        onChange={(e) => onChange({ ...set, weight: e.target.value === '' ? '' : Number(e.target.value) })}
        style={inputStyle}
      />
      <input
        type="number"
        step={0.5}
        min={0}
        max={10}
        value={set.rpe}
        placeholder="—"
        onChange={(e) => onChange({ ...set, rpe: e.target.value === '' ? '' : Number(e.target.value) })}
        style={{ ...inputStyle, padding: '8px 4px', textAlign: 'center' }}
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

const inputStyle = {
  background: 'var(--surface2)',
  border: '1px solid var(--line)',
  borderRadius: 10,
  padding: '8px 10px',
  color: 'var(--bone)',
  font: "600 13px/1 'Inter'",
  width: '100%',
}
