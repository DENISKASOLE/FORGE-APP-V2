import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import TextField from '../../components/TextField'
import Button from '../../components/Button'

export default function SignupForm({ onSwitch }) {
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error: err } = await signUp(email, password, fullName, inviteCode.trim().toUpperCase())
    setBusy(false)
    if (err) setError(err.message)
    else setDone(true)
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ font: "800 26px/1.1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.6px', marginBottom: 12 }}>
          You're in.
        </div>
        <div style={{ font: "500 13px/1.5 'Inter'", color: 'var(--boneDim)' }}>
          Check your email to confirm your account, then sign in.
        </div>
        <Button variant="outline" style={{ marginTop: 24 }} onClick={onSwitch}>
          Back to Sign In
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ font: "800 30px/1.05 'Inter'", color: 'var(--bone)', letterSpacing: '-0.9px' }}>
        Let's get you<br />an account.
      </div>
      <TextField
        label="Full name"
        required
        autoComplete="name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Marcus Reid"
      />
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
        minLength={6}
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />
      <TextField
        label="Coach Invite Code (optional)"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        placeholder="e.g. K7P2QX"
        inputStyle={{ textTransform: 'uppercase' }}
      />
      {error && (
        <div style={{ color: 'var(--red)', font: "600 12px/1.4 'Inter'" }}>{error}</div>
      )}
      <Button type="submit" full disabled={busy} style={{ marginTop: 8, opacity: busy ? 0.7 : 1 }}>
        {busy ? 'Creating…' : 'Create Account'}
      </Button>
      <div style={{ textAlign: 'center', font: "500 12px/1 'Inter'", color: 'var(--muted)' }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          style={{ background: 'none', border: 'none', color: 'var(--ember)', font: '600 12px Inter', cursor: 'pointer', padding: 0 }}
        >
          Sign in
        </button>
      </div>
    </form>
  )
}
