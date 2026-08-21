import Slider from './Slider'
import Button from '../../components/Button'

export default function StepWellbeing({ form, setForm, onNext }) {
  return (
    <div>
      <div style={{ font: "800 22px/1.1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.4px', marginBottom: 24 }}>
        How was your week?
      </div>
      <div className="label" style={{ marginBottom: 8 }}>Current weight (kg)</div>
      <div
        style={{
          background: 'var(--surface2)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          padding: '12px 0',
          textAlign: 'center',
          marginBottom: 26,
        }}
      >
        <input
          type="number"
          step="0.1"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--bone)',
            font: "800 28px/1 'Inter'",
            letterSpacing: '-0.5px',
            textAlign: 'center',
            width: '100%',
          }}
        />
      </div>
      <Slider label="Energy level" value={form.energy} onChange={(v) => setForm({ ...form, energy: v })} color="var(--sage)" />
      <Slider label="Sleep quality" value={form.sleep} onChange={(v) => setForm({ ...form, sleep: v })} color="var(--court)" />
      <Slider label="Stress level" value={form.stress} onChange={(v) => setForm({ ...form, stress: v })} color="var(--red)" />
      <Button full onClick={onNext} style={{ marginTop: 12 }}>Continue</Button>
    </div>
  )
}
