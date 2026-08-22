import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import Button from '../../components/Button'
import TextField from '../../components/TextField'

export default function AddExerciseSheet({ muscleGroups, equipmentOptions, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    muscleGroup: '',
    equipment: '',
    instructions: '',
    mediaUrl: '',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    if (!form.name.trim() || !form.muscleGroup.trim()) {
      setError('Name and muscle group are required.')
      return
    }
    setError('')
    setBusy(true)
    try {
      await onSave(form)
    } catch (err) {
      setError(err.message || 'Could not save this exercise.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--ink)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px' }}>
        <div style={{ font: "700 18px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.3px' }}>
          Add Exercise
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={20} color="var(--bone)" />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="e.g. Cable Face Pull"
        />

        <label style={{ display: 'block' }}>
          <div className="label" style={{ marginBottom: 8 }}>Muscle group</div>
          <input
            list="muscle-group-options"
            value={form.muscleGroup}
            onChange={(e) => update('muscleGroup', e.target.value)}
            placeholder="e.g. Shoulders"
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
          <datalist id="muscle-group-options">
            {muscleGroups.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </label>

        <label style={{ display: 'block' }}>
          <div className="label" style={{ marginBottom: 8 }}>Equipment</div>
          <input
            list="equipment-options"
            value={form.equipment}
            onChange={(e) => update('equipment', e.target.value)}
            placeholder="e.g. Cable"
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
          <datalist id="equipment-options">
            {equipmentOptions.map((e) => (
              <option key={e} value={e} />
            ))}
          </datalist>
        </label>

        <label style={{ display: 'block' }}>
          <div className="label" style={{ marginBottom: 8 }}>Instructions</div>
          <textarea
            value={form.instructions}
            onChange={(e) => update('instructions', e.target.value)}
            placeholder="How to perform this exercise"
            rows={4}
            style={{
              width: '100%',
              background: 'var(--surface2)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              padding: '14px 16px',
              color: 'var(--bone)',
              font: "500 13px/1.5 'Inter'",
              resize: 'none',
            }}
          />
        </label>

        <TextField
          label="Media URL"
          value={form.mediaUrl}
          onChange={(e) => update('mediaUrl', e.target.value)}
          placeholder="Link to a gif/image demo"
        />

        {error && <div style={{ color: 'var(--red)', font: "600 12px/1.4 'Inter'" }}>{error}</div>}

        <Button full onClick={handleSave} disabled={busy} style={{ opacity: busy ? 0.7 : 1 }}>
          {busy ? 'Saving…' : 'Save Exercise'}
        </Button>
      </div>
    </div>
  )
}
