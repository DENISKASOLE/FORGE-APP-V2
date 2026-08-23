import { useEffect, useState } from 'react'
import { getNutritionTargetsForClient, setNutritionTargets, getTodaysNutritionTotals } from '../../data/nutrition'
import Button from '../../components/Button'

const fields = [
  { key: 'kcal', label: 'Calories (kcal)' },
  { key: 'protein', label: 'Protein (g)' },
  { key: 'carbs', label: 'Carbs (g)' },
  { key: 'fat', label: 'Fat (g)' },
]

export default function NutritionTargetsTab({ clientId }) {
  const [targets, setTargets] = useState(undefined)
  const [form, setForm] = useState({ kcal: '', protein: '', carbs: '', fat: '' })
  const [totals, setTotals] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getNutritionTargetsForClient(clientId).then((t) => {
      setTargets(t)
      if (t) setForm({ kcal: t.kcal, protein: t.protein, carbs: t.carbs, fat: t.fat })
    })
    getTodaysNutritionTotals(clientId).then(setTotals)
  }, [clientId])

  async function handleSave() {
    setError('')
    setSaving(true)
    try {
      const saved = await setNutritionTargets(clientId, {
        kcal: Number(form.kcal) || 0,
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fat: Number(form.fat) || 0,
      })
      setTargets(saved)
    } catch (err) {
      setError(err.message || 'Could not save targets.')
    } finally {
      setSaving(false)
    }
  }

  if (targets === undefined) return null

  return (
    <div>
      <div className="label" style={{ marginBottom: 4 }}>Daily Targets</div>
      <div style={{ font: "500 11px/1.5 'Inter'", color: 'var(--muted)', marginBottom: 16 }}>
        {targets ? 'Update this client\'s daily nutrition targets.' : "This client doesn't have targets set yet."}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
        {fields.map((f) => (
          <label key={f.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ font: "500 12px/1 'Inter'", color: 'var(--boneDim)' }}>{f.label}</span>
            <input
              type="number"
              min={0}
              value={form[f.key]}
              onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
              style={{
                width: 100,
                background: 'var(--surface2)',
                border: '1px solid var(--line)',
                borderRadius: 10,
                padding: '10px 12px',
                color: 'var(--bone)',
                font: "700 13px/1 'Inter'",
                textAlign: 'right',
              }}
            />
          </label>
        ))}
      </div>

      {error && <div style={{ color: 'var(--red)', font: "600 12px/1.4 'Inter'", marginBottom: 12 }}>{error}</div>}

      <Button full onClick={handleSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
        {saving ? 'Saving…' : targets ? 'Update Targets' : 'Set Targets'}
      </Button>

      {totals && (
        <div style={{ marginTop: 24 }}>
          <div className="label" style={{ marginBottom: 10 }}>Logged Today</div>
          {[
            { label: 'Calories', value: `${totals.kcal} kcal` },
            { label: 'Protein', value: `${totals.protein}g` },
            { label: 'Carbs', value: `${totals.carbs}g` },
            { label: 'Fat', value: `${totals.fat}g` },
          ].map((row) => (
            <div
              key={row.label}
              style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}
            >
              <span style={{ font: "500 12px/1 'Inter'", color: 'var(--boneDim)' }}>{row.label}</span>
              <span style={{ font: "700 12px/1 'Inter'", color: 'var(--bone)' }}>{row.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
