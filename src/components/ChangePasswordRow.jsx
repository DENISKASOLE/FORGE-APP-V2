import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Button from './Button'

const inputStyle = {
  background: 'var(--surface2)',
  border: '1px solid var(--line)',
  borderRadius: 10,
  padding: '10px 12px',
  color: 'var(--bone)',
  font: "500 13px/1 'Inter'",
  outline: 'none',
}

// Shared by the coach's Settings tab and the client's Profile screen --
// same account-security action either side of the app.
export default function ChangePasswordRow() {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function save() {
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setDone(true)
      setPassword('')
      setConfirm('')
      setTimeout(() => {
        setDone(false)
        setOpen(false)
      }, 1500)
    } catch (err) {
      setError(err.message || 'Could not change your password.')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          width: '100%',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          padding: '14px 0',
          borderBottom: '1px solid var(--line)',
          color: 'var(--bone)',
          font: "500 12px/1 'Inter'",
          cursor: 'pointer',
        }}
      >
        Change Password
      </button>
    )
  }

  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          style={inputStyle}
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm new password"
          style={inputStyle}
        />
      </div>
      {error && <div style={{ color: 'var(--red)', font: "600 11px/1.4 'Inter'", marginBottom: 8 }}>{error}</div>}
      {done && <div style={{ color: 'var(--sage)', font: "600 11px/1.4 'Inter'", marginBottom: 8 }}>Password updated.</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button style={{ flex: 1, padding: '8px 0' }} onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
        <Button variant="surface" style={{ flex: 1, padding: '8px 0' }} onClick={() => setOpen(false)} disabled={saving}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
