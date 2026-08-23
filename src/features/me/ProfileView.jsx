import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, CircleNotch, PencilSimple, SignOut } from '@phosphor-icons/react'
import { useAuth } from '../../hooks/useAuth'
import { getMeHubData } from '../../data/clientData'
import { updateProfile, uploadAvatar } from '../../data/profiles'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'
import ChangePasswordRow from '../../components/ChangePasswordRow'

export default function ProfileView() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getMeHubData(profile).then(setData)
  }, [profile])

  useEffect(() => {
    // Intentional: keeps the edit buffer in sync with the canonical name
    // after refreshProfile() resolves post-save, not just on first mount.
    // eslint-disable-next-line react/set-state-in-effect
    setName(profile?.full_name || '')
  }, [profile?.full_name])

  async function saveName() {
    if (!name.trim()) return
    setSaving(true)
    setError('')
    try {
      await updateProfile(user.id, { full_name: name.trim() })
      await refreshProfile()
      setEditingName(false)
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
      await refreshProfile()
    } catch (err) {
      setError(err.message || 'Could not upload that photo.')
    } finally {
      setUploading(false)
    }
  }

  if (!data) return null

  return (
    <div style={{ paddingBottom: 24 }}>
      <BackHeader title="Profile" />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 24px 24px' }}>
        <label style={{ position: 'relative', cursor: 'pointer' }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhoto(e.target.files?.[0])}
            style={{ display: 'none' }}
          />
          <Avatar name={data.client.fullName} url={profile?.avatar_url} size={84} />
          <div
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--ember)',
              border: '2px solid var(--ink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {uploading ? <CircleNotch size={14} color="#fff" className="spin" /> : <Camera size={14} color="#fff" weight="fill" />}
          </div>
        </label>

        {editingName ? (
          <div style={{ display: 'flex', gap: 8, marginTop: 16, width: '100%', maxWidth: 280 }}>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                flex: 1,
                background: 'var(--surface2)',
                border: '1px solid var(--line)',
                borderRadius: 10,
                padding: '10px 12px',
                color: 'var(--bone)',
                font: "700 15px/1 'Inter'",
                outline: 'none',
              }}
            />
            <button
              onClick={saveName}
              disabled={saving}
              style={{
                background: 'var(--ember)',
                border: 'none',
                color: '#fff',
                borderRadius: 10,
                padding: '0 14px',
                font: "700 12px/1 'Inter'",
                cursor: 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? '…' : 'Save'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingName(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', marginTop: 16 }}
          >
            <span style={{ font: "800 18px/1 'Inter'", color: 'var(--bone)' }}>{data.client.fullName}</span>
            <PencilSimple size={14} color="var(--muted)" />
          </button>
        )}
      </div>

      {error && <div style={{ margin: '0 24px 16px', color: 'var(--red)', font: "600 12px/1.4 'Inter'" }}>{error}</div>}

      <div style={{ padding: '0 24px' }}>
        <Row label="Email" value={user?.email} />
        <Row label="Coach" value={data.client.coach.name} />
      </div>

      <Section title="Package & Payments">
        <Row label="Current package" value={data.client.coach.packageLabel || 'Not set yet'} />
        <Row
          label="Next payment"
          value={data.payments.next ? `${data.payments.next.amount} · Due ${data.payments.next.date}` : 'Nothing due'}
        />
        <button onClick={() => navigate('/me/payments')} style={linkRowStyle}>
          View payment history
        </button>
      </Section>

      <Section title="Account">
        <ChangePasswordRow />
      </Section>

      <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={signOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'none',
            border: '1px solid var(--line)',
            borderRadius: 100,
            padding: '12px 22px',
            color: 'var(--red)',
            font: "600 12px/1 'Inter'",
            cursor: 'pointer',
          }}
        >
          <SignOut size={16} /> Log Out
        </button>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="label" style={{ marginBottom: 6 }}>{label}</div>
      <div style={{ font: "600 14px/1 'Inter'", color: 'var(--bone)' }}>{value}</div>
    </div>
  )
}

const linkRowStyle = {
  width: '100%',
  textAlign: 'left',
  background: 'none',
  border: 'none',
  padding: '14px 0',
  color: 'var(--ember)',
  font: "700 12px/1 'Inter'",
  cursor: 'pointer',
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
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderTop: 'none',
          borderBottomLeftRadius: 14,
          borderBottomRightRadius: 14,
          padding: '0 14px',
        }}
      >
        {children}
      </div>
    </div>
  )
}
