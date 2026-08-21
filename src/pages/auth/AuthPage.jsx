import { useState } from 'react'
import LoginForm from '../../features/auth/LoginForm'
import SignupForm from '../../features/auth/SignupForm'

export default function AuthPage() {
  const [mode, setMode] = useState('login')

  return (
    <div
      data-app="client"
      className="app-shell"
      style={{ justifyContent: 'center', padding: '0 24px' }}
    >
      <div style={{ position: 'absolute', top: 60, left: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ font: "800 15px/1 'Inter'", color: 'var(--bone)', letterSpacing: '0.14em' }}>
          FORGE
        </div>
      </div>
      <div style={{ marginTop: 40 }}>
        {mode === 'login' ? (
          <LoginForm onSwitch={() => setMode('signup')} />
        ) : (
          <SignupForm onSwitch={() => setMode('login')} />
        )}
      </div>
    </div>
  )
}
