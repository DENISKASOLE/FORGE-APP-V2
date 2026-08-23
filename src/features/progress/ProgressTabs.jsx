import { useEffect, useRef, useState } from 'react'
import { TrendUp, TrendDown, Minus, Plus, CircleNotch } from '@phosphor-icons/react'
import {
  getWeightHistory,
  getPersonalRecords,
  getMeasurements,
  addMeasurement,
  getProgressPhotos,
  uploadProgressPhoto,
} from '../../data/progress'
import Card from '../../components/Card'
import Button from '../../components/Button'
import WeightChart from './WeightChart'

const tabs = ['Weight', 'PRs', 'Measurements', 'Photos']
const trendIcon = { up: TrendUp, flat: Minus, down: TrendDown }
const trendColor = { up: 'var(--sage)', flat: 'var(--muted)', down: 'var(--red)' }

// clientId: whose progress to show. readOnly: hides the client-only write
// actions (add measurement / add photo) -- used for the coach's view.
export default function ProgressTabs({ clientId, readOnly = false }) {
  const [tab, setTab] = useState('Weight')
  const [weightHistory, setWeightHistory] = useState(null)
  const [personalRecords, setPersonalRecords] = useState(null)
  const [measurements, setMeasurements] = useState(null)
  const [photos, setPhotos] = useState(null)

  useEffect(() => {
    getWeightHistory(clientId).then(setWeightHistory)
    getPersonalRecords(clientId).then(setPersonalRecords)
    getMeasurements(clientId).then(setMeasurements)
    getProgressPhotos(clientId).then(setPhotos)
  }, [clientId])

  if (!weightHistory || !personalRecords || !measurements || !photos) return null

  const start = weightHistory[0]
  const current = weightHistory[weightHistory.length - 1]
  const change = weightHistory.length > 1 ? (current - start).toFixed(1) : '0.0'

  function handleMeasurementAdded(row) {
    setMeasurements((prev) => {
      const existing = prev.find((m) => m.label === row.label)
      const rest = prev.filter((m) => m.label !== row.label)
      return [{ id: row.id, label: row.label, current: row.value, previous: existing ? existing.current : null }, ...rest]
    })
  }

  function handlePhotoAdded(photo) {
    setPhotos((prev) => [photo, ...prev])
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto' }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flexShrink: 0,
              background: tab === t ? 'var(--ember)' : 'var(--surface)',
              color: tab === t ? '#fff' : 'var(--boneDim)',
              border: '1px solid ' + (tab === t ? 'var(--ember)' : 'var(--line)'),
              borderRadius: 100,
              padding: '8px 16px',
              font: "600 11px/1 'Inter'",
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Weight' && (
        <Card>
          {weightHistory.length > 1 ? (
            <>
              <WeightChart history={weightHistory} />
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <MiniStat label="Start" value={`${start}kg`} />
                <MiniStat label="Current" value={`${current}kg`} />
                <MiniStat
                  label="Change"
                  value={`${change > 0 ? '+' : ''}${change}kg`}
                  color={change <= 0 ? 'var(--sage)' : 'var(--red)'}
                />
              </div>
            </>
          ) : (
            <EmptyState text="Weight logged at check-in shows up here — submit a check-in to start tracking." />
          )}
        </Card>
      )}

      {tab === 'PRs' &&
        (personalRecords.length === 0 ? (
          <EmptyState text="No logged sets yet — personal records appear once workouts are logged." />
        ) : (
          personalRecords.map((pr) => {
            const Icon = trendIcon[pr.trend]
            return (
              <Card key={pr.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)', marginBottom: 6 }}>{pr.lift}</div>
                    <div style={{ font: "500 11px/1 'Inter'", color: 'var(--muted)' }}>
                      Best {pr.best} · Recent {pr.recent}
                    </div>
                  </div>
                  <Icon size={20} color={trendColor[pr.trend]} />
                </div>
              </Card>
            )
          })
        ))}

      {tab === 'Measurements' && (
        <div>
          {measurements.length === 0 && <EmptyState text="No measurements logged yet." />}
          {measurements.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <span style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)' }}>{m.label}</span>
              <span style={{ font: "600 12px/1 'Inter'", color: 'var(--boneDim)' }}>
                {m.current}cm{' '}
                {m.previous != null && <span style={{ color: 'var(--muted)' }}>(was {m.previous}cm)</span>}
              </span>
            </div>
          ))}
          {!readOnly && <AddMeasurementRow clientId={clientId} onAdded={handleMeasurementAdded} />}
        </div>
      )}

      {tab === 'Photos' && (
        <PhotosGrid photos={photos} clientId={clientId} readOnly={readOnly} onAdded={handlePhotoAdded} />
      )}
    </div>
  )
}

function MiniStat({ label, value, color = 'var(--bone)' }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ font: "800 15px/1 'Inter'", color }}>{value}</div>
      <div className="label" style={{ marginTop: 6 }}>{label}</div>
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div style={{ font: "500 12px/1.5 'Inter'", color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>
      {text}
    </div>
  )
}

const inputStyle = {
  flex: 1,
  background: 'var(--surface2)',
  border: '1px solid var(--line)',
  borderRadius: 10,
  padding: '10px 12px',
  color: 'var(--bone)',
  font: "500 13px/1 'Inter'",
  outline: 'none',
}

function AddMeasurementRow({ clientId, onAdded }) {
  const [adding, setAdding] = useState(false)
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    if (!label.trim() || !value) return
    setBusy(true)
    setError('')
    try {
      const row = await addMeasurement(clientId, label.trim(), Number(value))
      onAdded(row)
      setLabel('')
      setValue('')
      setAdding(false)
    } catch (err) {
      setError(err.message || 'Could not save that measurement.')
    } finally {
      setBusy(false)
    }
  }

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'none',
          border: 'none',
          color: 'var(--ember)',
          font: "600 12px/1 'Inter'",
          padding: '16px 0',
          cursor: 'pointer',
        }}
      >
        <Plus size={14} weight="bold" /> Add measurement
      </button>
    )
  }

  return (
    <div style={{ padding: '14px 0' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Chest, Waist…" style={inputStyle} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="number"
          step="0.1"
          placeholder="cm"
          style={{ ...inputStyle, width: 80, flex: 'none' }}
        />
      </div>
      {error && <div style={{ color: 'var(--red)', font: "600 11px/1.4 'Inter'", marginBottom: 8 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button style={{ flex: 1, padding: '8px 0' }} onClick={save} disabled={busy}>
          {busy ? 'Saving…' : 'Save'}
        </Button>
        <Button variant="surface" style={{ flex: 1, padding: '8px 0' }} onClick={() => setAdding(false)}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

function PhotosGrid({ photos, clientId, readOnly, onAdded }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file) {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const photo = await uploadProgressPhoto(clientId, file)
      onAdded(photo)
    } catch (err) {
      setError(err.message || 'Could not upload that photo.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {error && <div style={{ color: 'var(--red)', font: "600 12px/1.4 'Inter'", marginBottom: 12 }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {!readOnly && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{
              aspectRatio: '3/4',
              borderRadius: 14,
              background: 'var(--surface)',
              border: '1.5px dashed var(--lineS)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
              style={{ display: 'none' }}
            />
            {uploading ? <CircleNotch size={20} color="var(--muted)" className="spin" /> : <Plus size={20} color="var(--muted)" />}
            <span style={{ font: "600 10px/1 'Inter'", color: 'var(--muted)' }}>Add Photo</span>
          </button>
        )}
        {photos.map((p) => (
          <div
            key={p.id}
            style={{ aspectRatio: '3/4', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--line)', position: 'relative' }}
          >
            <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <span
              style={{
                position: 'absolute',
                bottom: 8,
                left: 10,
                font: "600 10px/1 'Inter'",
                color: '#fff',
                textShadow: '0 1px 3px rgba(0,0,0,0.6)',
              }}
            >
              {new Date(p.takenAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        ))}
        {photos.length === 0 && readOnly && (
          <div style={{ gridColumn: '1 / -1', font: "500 12px/1.5 'Inter'", color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>
            No photos yet.
          </div>
        )}
      </div>
    </div>
  )
}
