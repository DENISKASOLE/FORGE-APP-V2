import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import TextField from '../../components/TextField'
import Button from '../../components/Button'

export default function LoginForm({ onSwitch }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error: err } = await signIn(email, password)
    setBusy(false)
    if (err) setError(err.message)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ font: "800 30px/1.05 'Inter'", color: 'var(--bone)', letterSpacing: '-0.9px' }}>
        Good to see you.
      </div>
      <TextField
        label="Email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      <TextField
        label="Password"
        type="password"
        required
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••••"
      />
      {error && (
        <div style={{ color: 'var(--red)', font: "600 12px/1.4 'Inter'" }}>{error}</div>
      )}
      <Button type="submit" full disabled={busy} style={{ marginTop: 8, opacity: busy ? 0.7 : 1 }}>
        {busy ? 'Signing in…' : 'Sign In'}
      </Button>
      <div style={{ textAlign: 'center', font: "500 12px/1 'Inter'", color: 'var(--muted)' }}>
        New here?{' '}
        <button
          type="button"
          onClick={onSwitch}
          style={{ background: 'none', border: 'none', color: 'var(--ember)', font: '600 12px Inter', cursor: 'pointer', padding: 0 }}
        >
          Create an account
        </button>
      </div>
    </form>
  )
}
