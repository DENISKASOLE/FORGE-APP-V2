import Button from '../../components/Button'

const habits = [
  { key: 'workouts', label: 'Hit all workout days' },
  { key: 'water', label: 'Hit water target' },
  { key: 'steps', label: 'Hit step target' },
]

export default function StepNutrition({ form, setForm, onNext }) {
  function toggleHabit(key) {
    setForm({ ...form, habits: { ...form.habits, [key]: !form.habits[key] } })
  }

  return (
    <div>
      <div style={{ font: "800 22px/1.1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.4px', marginBottom: 24 }}>
        Nutrition &amp; Habits
      </div>
      <div className="label" style={{ marginBottom: 10 }}>Nutrition adherence</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 26 }}>
        {[25, 50, 75, 100].map((pct) => (
          <button
            key={pct}
            onClick={() => setForm({ ...form, adherence: pct })}
            style={{
              flex: 1,
              padding: '12px 0',
              borderRadius: 12,
              border: '1px solid ' + (form.adherence === pct ? 'var(--sage)' : 'var(--line)'),
              background: form.adherence === pct ? 'var(--sageDim)' : 'var(--surface)',
              color: form.adherence === pct ? 'var(--sage)' : 'var(--boneDim)',
              font: "700 12px/1 'Inter'",
              cursor: 'pointer',
            }}
          >
            {pct}%
          </button>
        ))}
      </div>

      <div className="label" style={{ marginBottom: 10 }}>This week</div>
      <div style={{ marginBottom: 26 }}>
        {habits.map((h) => (
          <label
            key={h.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 0',
              borderBottom: '1px solid var(--line)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={form.habits[h.key]}
              onChange={() => toggleHabit(h.key)}
              style={{ width: 18, height: 18, accentColor: 'var(--ember)' }}
            />
            <span style={{ font: "500 13px/1 'Inter'", color: 'var(--bone)' }}>{h.label}</span>
          </label>
        ))}
      </div>

      <div className="label" style={{ marginBottom: 8 }}>Any notes for your coach?</div>
      <textarea
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        placeholder="Optional"
        rows={3}
        style={{
          width: '100%',
          background: 'var(--surface2)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          padding: '12px 14px',
          color: 'var(--bone)',
          font: "500 13px/1.4 'Inter'",
          resize: 'none',
          marginBottom: 20,
        }}
      />
      <Button full onClick={onNext}>Continue</Button>
    </div>
  )
}
