import { useState } from 'react'
import { Copy, Check, Camera, CircleNotch } from '@phosphor-icons/react'
import { useAuth } from '../../hooks/useAuth'
import { useAccentColor, accentSwatches } from '../../hooks/useAccentColor'
import { generateInviteCode, setInviteCode as saveInviteCode, updateProfile, uploadAvatar } from '../../data/profiles'
import Avatar from '../../components/Avatar'
import Button from '../../components/Button'
import ThemeToggle from '../../components/ThemeToggle'
import ChangePasswordRow from '../../components/ChangePasswordRow'

export default function CoachSettings() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [accent, setAccent] = useAccentColor()
  const [inviteCode, setInviteCode] = useState(profile?.invite_code || '')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [inviteError, setInviteError] = useState('')

  async function handleGenerateCode() {
    setInviteError('')
    setGenerating(true)
    try {
      const code = generateInviteCode()
      await saveInviteCode(user.id, code)
      setInviteCode(code)
    } catch (err) {
      setInviteError(err.message || 'Could not generate a code. Try again.')
    } finally {
      setGenerating(false)
    }
  }

  function handleCopy() {
    navigator.clipboard?.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  async function handleAccentChange(key) {
    setAccent(key)
    try {
      await updateProfile(user.id, { accent_color: key })
    } catch {
      // Local accent already applied; a failed sync just means clients
      // keep seeing the previous color until this succeeds on retry.
    }
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: '20px 24px 18px', font: "800 26px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.5px' }}>
        Settings
      </div>

      <div style={{ padding: '0 24px 20px' }}>
        <ProfileHeader profile={profile} user={user} onSaved={refreshProfile} />
      </div>

      <Section title="Client Invite Code">
        <div style={{ padding: '14px 0' }}>
          <div style={{ font: "500 11px/1.5 'Inter'", color: 'var(--muted)', marginBottom: 14 }}>
            Share this code with new clients — they enter it when they sign up
            and get linked to you automatically.
          </div>

          {inviteCode ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  flex: 1,
                  background: 'var(--surface2)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  font: "800 20px/1 'Inter'",
                  color: 'var(--bone)',
                  letterSpacing: '0.15em',
                  textAlign: 'center',
                }}
              >
                {inviteCode}
              </div>
              <button
                onClick={handleCopy}
                style={{
                  width: 46,
                  height: 46,
                  flexShrink: 0,
                  background: copied ? 'var(--sageDim)' : 'var(--surface2)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {copied ? <Check size={18} color="var(--sage)" /> : <Copy size={18} color="var(--bone)" />}
              </button>
            </div>
          ) : (
            <Button full onClick={handleGenerateCode} disabled={generating} style={{ opacity: generating ? 0.7 : 1 }}>
              {generating ? 'Generating…' : 'Generate Invite Code'}
            </Button>
          )}

          {inviteCode && (
            <button
              onClick={handleGenerateCode}
              disabled={generating}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                font: "600 10px/1 'Inter'",
                padding: '12px 0 0',
                cursor: 'pointer',
              }}
            >
              {generating ? 'Generating…' : 'Generate a new code'}
            </button>
          )}

          {inviteError && (
            <div style={{ color: 'var(--red)', font: "600 12px/1.4 'Inter'", marginTop: 10 }}>{inviteError}</div>
          )}
        </div>
      </Section>

      <Section title="App Appearance">
        <div style={{ padding: '14px 0' }}>
          <div className="label" style={{ marginBottom: 10 }}>Accent Color</div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            {Object.entries(accentSwatches).map(([key, swatch]) => (
              <button
                key={key}
                onClick={() => handleAccentChange(key)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: swatch.base,
                  border: accent === key ? '2px solid var(--bone)' : '2px solid transparent',
                  boxShadow: accent === key ? `0 0 0 3px ${swatch.base}55` : 'none',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
          <div style={{ font: "400 10px/1.4 'Inter'", color: 'var(--muted)' }}>Clients see this too.</div>
        </div>
        <div style={{ padding: '14px 0' }}>
          <div className="label" style={{ marginBottom: 10 }}>Theme</div>
          <ThemeToggle />
          <div style={{ font: "400 10px/1.4 'Inter'", color: 'var(--muted)', marginTop: 8 }}>
            Just for this device — clients pick their own.
          </div>
        </div>
      </Section>

      <Section title="Package">
        <PackageEditor profile={profile} user={user} onSaved={refreshProfile} />
      </Section>

      <Section title="Account">
        <ChangePasswordRow />
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

function ProfileHeader({ profile, user, onSaved }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    if (!name.trim()) return
    setSaving(true)
    setError('')
    try {
      await updateProfile(user.id, { full_name: name.trim() })
      await onSaved?.()
      setEditing(false)
    } catch (err) {
      setError(err.message || 'Could not save your name.')
    } finally {
      setSaving(false)
    }
  }

  async function handlePhoto(file) {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      await uploadAvatar(user.id, file)
      await onSaved?.()
    } catch (err) {
      setError(err.message || 'Could not upload that photo.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <label style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhoto(e.target.files?.[0])}
            style={{ display: 'none' }}
          />
          <Avatar name={profile?.full_name || user?.email || ''} url={profile?.avatar_url} size={56} />
          <div
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'var(--ember)',
              border: '2px solid var(--surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {uploading ? <CircleNotch size={11} color="#fff" className="spin" /> : <Camera size={11} color="#fff" weight="fill" />}
          </div>
        </label>
        <div style={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--surface2)',
                border: '1px solid var(--line)',
                borderRadius: 10,
                padding: '8px 10px',
                color: 'var(--bone)',
                font: "700 14px/1 'Inter'",
                marginBottom: 6,
              }}
            />
          ) : (
            <div style={{ font: "700 15px/1 'Inter'", color: 'var(--bone)', marginBottom: 4 }}>
              {profile?.full_name || 'Add your name'}
            </div>
          )}
          <div style={{ font: "400 11px/1 'Inter'", color: 'var(--muted)' }}>{user?.email}</div>
        </div>
        {editing ? (
          <button
            onClick={save}
            disabled={saving}
            style={{ background: 'var(--ember)', border: 'none', color: '#fff', borderRadius: 100, padding: '8px 14px', font: "700 11px/1 'Inter'", cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            style={{ background: 'var(--surface2)', border: 'none', color: 'var(--bone)', borderRadius: 100, padding: '8px 14px', font: "700 11px/1 'Inter'", cursor: 'pointer' }}
          >
            Edit
          </button>
        )}
      </div>
      {error && <div style={{ color: 'var(--red)', font: "600 11px/1.4 'Inter'", marginTop: 10 }}>{error}</div>}
    </div>
  )
}

function PackageEditor({ profile, user, onSaved }) {
  const [name, setName] = useState(profile?.package_name || '')
  const [price, setPrice] = useState(profile?.package_price || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    setSaving(true)
    setError('')
    try {
      await updateProfile(user.id, { package_name: name.trim() || null, package_price: price.trim() || null })
      await onSaved?.()
    } catch (err) {
      setError(err.message || 'Could not save your package.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding: '14px 0' }}>
      <div style={{ font: "500 11px/1.5 'Inter'", color: 'var(--muted)', marginBottom: 14 }}>
        What every client sees as their package on their Profile screen.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Coached Monthly"
          style={inputStyle}
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="500 AED / month"
          style={inputStyle}
        />
      </div>
      {error && <div style={{ color: 'var(--red)', font: "600 12px/1.4 'Inter'", marginBottom: 10 }}>{error}</div>}
      <Button onClick={save} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
        {saving ? 'Saving…' : 'Save Package'}
      </Button>
    </div>
  )
}

const inputStyle = {
  background: 'var(--surface2)',
  border: '1px solid var(--line)',
  borderRadius: 10,
  padding: '10px 12px',
  color: 'var(--bone)',
  font: "500 13px/1 'Inter'",
  outline: 'none',
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
