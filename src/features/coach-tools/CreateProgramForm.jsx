import { useState } from 'react'
import Button from '../../components/Button'
import TextField from '../../components/TextField'

export default function CreateProgramForm({ clientName, onCreate }) {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate() {
    if (!name.trim()) {
      setError('Give the program a name.')
      return
    }
    setError('')
    setBusy(true)
    try {
      await onCreate({ name: name.trim(), notes: notes.trim() })
    } catch (err) {
      setError(err.message || 'Could not create this program.')
      setBusy(false)
    }
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ font: "700 15px/1.3 'Inter'", color: 'var(--bone)', marginBottom: 6 }}>
        No program yet
      </div>
      <div style={{ font: "500 12px/1.5 'Inter'", color: 'var(--muted)', marginBottom: 20 }}>
        {clientName ? `Create a training program for ${clientName}.` : 'Create a training program.'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <TextField
          label="Program name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Hypertrophy Block II"
        />
        <label style={{ display: 'block' }}>
          <div className="label" style={{ marginBottom: 8 }}>Notes (optional)</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything worth noting about this program"
            rows={3}
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
        {error && <div style={{ color: 'var(--red)', font: "600 12px/1.4 'Inter'" }}>{error}</div>}
        <Button full onClick={handleCreate} disabled={busy} style={{ opacity: busy ? 0.7 : 1 }}>
          {busy ? 'Creating…' : 'Create Program'}
        </Button>
      </div>
    </div>
  )
}
