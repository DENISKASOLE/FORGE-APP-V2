import { useState } from 'react'
import Button from '../../components/Button'
import TextField from '../../components/TextField'

export default function NewExerciseDetailsForm({ exerciseName, onCancel, onConfirm }) {
  const [blockLabel, setBlockLabel] = useState('Block 1')
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(10)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,12,9,0.6)',
        backdropFilter: 'blur(3px)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          background: 'var(--ink2)',
          border: '1px solid var(--lineS)',
          borderRadius: 20,
          padding: 22,
        }}
      >
        <div style={{ font: "700 15px/1.3 'Inter'", color: 'var(--bone)', marginBottom: 4 }}>{exerciseName}</div>
        <div style={{ font: "500 11px/1.4 'Inter'", color: 'var(--muted)', marginBottom: 18 }}>
          Set the block label, sets, and reps for this exercise.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          <TextField
            label="Block label"
            value={blockLabel}
            onChange={(e) => setBlockLabel(e.target.value)}
            placeholder="e.g. Block 2 — Superset"
          />
          <div style={{ display: 'flex', gap: 12 }}>
            <label style={{ flex: 1 }}>
              <div className="label" style={{ marginBottom: 8 }}>Sets</div>
              <input
                type="number"
                min={1}
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: 'var(--surface2)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  color: 'var(--bone)',
                  font: "600 15px/1 'Inter'",
                  outline: 'none',
                }}
              />
            </label>
            <label style={{ flex: 1 }}>
              <div className="label" style={{ marginBottom: 8 }}>Reps</div>
              <input
                type="number"
                min={1}
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: 'var(--surface2)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  color: 'var(--bone)',
                  font: "600 15px/1 'Inter'",
                  outline: 'none',
                }}
              />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="surface" style={{ flex: 1 }} onClick={onCancel}>
            Cancel
          </Button>
          <Button style={{ flex: 1 }} onClick={() => onConfirm({ blockLabel, sets, reps })}>
            Add to Day
          </Button>
        </div>
      </div>
    </div>
  )
}
