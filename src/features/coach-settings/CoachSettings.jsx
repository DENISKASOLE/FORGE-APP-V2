import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useAccentColor, accentSwatches } from '../../hooks/useAccentColor'
import { coachProfile } from '../../data/sampleData'
import Avatar from '../../components/Avatar'

const fonts = ['Inter', 'Montserrat', 'DM Sans']

export default function CoachSettings() {
  const { user, signOut } = useAuth()
  const [accent, setAccent] = useAccentColor()
  const [font, setFont] = useState('Inter')

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: '20px 24px 18px', font: "800 26px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.5px' }}>
        Settings
      </div>

      <div style={{ padding: '0 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 16 }}>
          <Avatar name={coachProfile.name} size={56} />
          <div style={{ flex: 1 }}>
            <div style={{ font: "700 15px/1 'Inter'", color: 'var(--bone)', marginBottom: 4 }}>{coachProfile.name}</div>
            <div style={{ font: "500 11px/1 'Inter'", color: 'var(--muted)', marginBottom: 2 }}>{coachProfile.role}</div>
            <div style={{ font: "400 11px/1 'Inter'", color: 'var(--muted)' }}>{user?.email}</div>
          </div>
          <button style={{ background: 'var(--surface2)', border: 'none', color: 'var(--bone)', borderRadius: 100, padding: '8px 14px', font: "700 11px/1 'Inter'", cursor: 'pointer' }}>
            Edit
          </button>
        </div>
      </div>

      <Section title="App Appearance">
        <div style={{ padding: '14px 0' }}>
          <div className="label" style={{ marginBottom: 10 }}>Accent Color</div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            {Object.entries(accentSwatches).map(([key, hex]) => (
              <button
                key={key}
                onClick={() => setAccent(key)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: hex,
                  border: accent === key ? '2px solid #fff' : '2px solid transparent',
                  boxShadow: accent === key ? `0 0 0 3px ${hex}55` : 'none',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
          <div style={{ font: "400 10px/1.4 'Inter'", color: 'var(--muted)' }}>Clients see this too.</div>
        </div>
        <div style={{ padding: '14px 0' }}>
          <div className="label" style={{ marginBottom: 10 }}>Font</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {fonts.map((f) => (
              <button
                key={f}
                onClick={() => setFont(f)}
                style={{
                  background: f === font ? 'var(--ember)' : 'var(--surface)',
                  color: f === font ? '#fff' : 'var(--boneDim)',
                  border: '1px solid ' + (f === font ? 'var(--ember)' : 'var(--line)'),
                  borderRadius: 100,
                  padding: '8px 14px',
                  font: "600 11px/1 'Inter'",
                  cursor: 'pointer',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Payments">
        <Row label="PayPal" value="Connected · coach@forge.app" />
        <Row label="Package Price" value="500 AED / month" action="Edit" />
      </Section>

      <Section title="Account">
        <Row label="Change Password" />
        <button
          onClick={signOut}
          style={{
            width: '100%',
            textAlign: 'left',
            background: 'none',
            border: 'none',
            padding: '14px 0',
            color: 'var(--red)',
            font: "600 13px/1 'Inter'",
            cursor: 'pointer',
          }}
        >
          Log Out
        </button>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ margin: '0 24px 20px' }}>
      <div
        style={{
          padding: '10px 14px',
          font: "500 8px/1 'Inter'",
          color: 'var(--muted)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
        }}
      >
        {title}
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderTop: 'none', borderBottomLeftRadius: 14, borderBottomRightRadius: 14, padding: '0 14px' }}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, value, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
      <span style={{ font: "500 12px/1 'Inter'", color: 'var(--bone)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {value && <span style={{ font: "500 11px/1 'Inter'", color: 'var(--muted)' }}>{value}</span>}
        {action && <span style={{ font: "700 11px/1 'Inter'", color: 'var(--ember)' }}>{action}</span>}
      </div>
    </div>
  )
}
