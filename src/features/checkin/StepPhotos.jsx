import { Camera } from '@phosphor-icons/react'
import Button from '../../components/Button'

const slots = ['Front', 'Back', 'Side']

export default function StepPhotos({ form, setForm, onSubmit, busy }) {
  function toggle(slot) {
    setForm({ ...form, photos: { ...form.photos, [slot]: !form.photos[slot] } })
  }

  return (
    <div>
      <div style={{ font: "800 22px/1.1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.4px', marginBottom: 24 }}>
        Progress Photos
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => toggle(slot)}
            style={{
              flex: 1,
              aspectRatio: '3/4',
              borderRadius: 16,
              border: '1.5px dashed ' + (form.photos[slot] ? 'var(--sage)' : 'var(--lineS)'),
              background: form.photos[slot] ? 'var(--sageDim)' : 'var(--surface)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <Camera size={22} color={form.photos[slot] ? 'var(--sage)' : 'var(--muted)'} />
            <span style={{ font: "600 10px/1 'Inter'", color: form.photos[slot] ? 'var(--sage)' : 'var(--muted)' }}>
              {slot}
            </span>
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center', font: "500 11px/1 'Inter'", color: 'var(--ember)', marginBottom: 26 }}>
        Upload from Library
      </div>
      <Button full onClick={onSubmit} disabled={busy} style={{ opacity: busy ? 0.7 : 1 }}>
        {busy ? 'Submitting…' : 'Submit Check-in'}
      </Button>
    </div>
  )
}
