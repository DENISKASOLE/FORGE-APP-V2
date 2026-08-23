import { useRef } from 'react'
import { Camera, Check } from '@phosphor-icons/react'
import Button from '../../components/Button'

const slots = ['Front', 'Back', 'Side']

export default function StepPhotos({ form, setForm, onSubmit, busy, error }) {
  const inputRefs = useRef({})

  function pick(slot, file) {
    if (!file) return
    setForm({ ...form, photos: { ...form.photos, [slot]: file } })
  }

  return (
    <div>
      <div style={{ font: "800 22px/1.1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.4px', marginBottom: 24 }}>
        Progress Photos
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {slots.map((slot) => {
          const file = form.photos[slot]
          return (
            <button
              key={slot}
              onClick={() => inputRefs.current[slot]?.click()}
              style={{
                flex: 1,
                aspectRatio: '3/4',
                borderRadius: 16,
                border: '1.5px dashed ' + (file ? 'var(--sage)' : 'var(--lineS)'),
                background: file ? 'var(--sageDim)' : 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
              }}
            >
              <input
                ref={(el) => (inputRefs.current[slot] = el)}
                type="file"
                accept="image/*"
                onChange={(e) => pick(slot, e.target.files?.[0])}
                style={{ display: 'none' }}
              />
              {file ? <Check size={22} color="var(--sage)" /> : <Camera size={22} color="var(--muted)" />}
              <span style={{ font: "600 10px/1 'Inter'", color: file ? 'var(--sage)' : 'var(--muted)' }}>
                {slot}
              </span>
            </button>
          )
        })}
      </div>
      {error && (
        <div style={{ color: 'var(--red)', font: "600 12px/1.4 'Inter'", marginBottom: 16, textAlign: 'center' }}>
          {error}
        </div>
      )}
      <Button full onClick={onSubmit} disabled={busy} style={{ opacity: busy ? 0.7 : 1 }}>
        {busy ? 'Submitting…' : 'Submit Check-in'}
      </Button>
    </div>
  )
}
