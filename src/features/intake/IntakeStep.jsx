import Button from '../../components/Button'

export default function IntakeStep({ section, form, setForm, onNext, isLast, submitting, error }) {
  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const canContinue = section.fields.every((f) => !f.required || form[f.key])

  return (
    <div>
      <div style={{ font: "800 22px/1.1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.4px', marginBottom: section.intro ? 8 : 24 }}>
        {section.title}
      </div>
      {section.intro && (
        <div style={{ font: "600 12px/1.4 'Inter'", color: 'var(--red)', marginBottom: 20 }}>{section.intro}</div>
      )}

      {section.fields.map((field) => (
        <FieldInput key={field.key} field={field} value={form[field.key]} onChange={(v) => setField(field.key, v)} />
      ))}

      {error && <div style={{ color: 'var(--red)', font: "600 12px/1.4 'Inter'", marginBottom: 16 }}>{error}</div>}

      <Button
        full
        onClick={onNext}
        disabled={!canContinue || submitting}
        style={{ opacity: !canContinue || submitting ? 0.7 : 1, marginTop: 8 }}
      >
        {submitting ? 'Submitting…' : isLast ? 'Submit Intake Form' : 'Continue'}
      </Button>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  background: 'var(--surface2)',
  border: '1px solid var(--line)',
  borderRadius: 12,
  padding: '12px 14px',
  color: 'var(--bone)',
  font: "500 13px/1.4 'Inter'",
  outline: 'none',
}

function FieldInput({ field, value, onChange }) {
  if (field.type === 'checkbox') {
    return (
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: 'var(--ember)', marginTop: 1, flexShrink: 0 }}
        />
        <span style={{ font: "500 12px/1.5 'Inter'", color: 'var(--bone)' }}>
          {field.label}
          {field.required && <span style={{ color: 'var(--red)' }}> *</span>}
        </span>
      </label>
    )
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <span style={{ font: "600 12px/1.4 'Inter'", color: 'var(--boneDim)', marginBottom: 8, display: 'block' }}>
        {field.label}
      </span>

      {field.type === 'textarea' && (
        <textarea
          rows={3}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, resize: 'none' }}
        />
      )}

      {field.type === 'text' && (
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
      )}

      {field.type === 'date' && (
        <input type="date" value={value || ''} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
      )}

      {field.type === 'number' && (
        <input
          type="number"
          min={0}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          style={inputStyle}
        />
      )}

      {field.type === 'select' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {field.options.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                padding: '9px 14px',
                borderRadius: 100,
                border: '1px solid ' + (value === opt ? 'var(--ember)' : 'var(--line)'),
                background: value === opt ? 'var(--emberDim)' : 'var(--surface)',
                color: value === opt ? 'var(--ember)' : 'var(--boneDim)',
                font: "600 12px/1 'Inter'",
                cursor: 'pointer',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {field.type === 'boolean' && (
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { v: true, label: field.trueLabel || 'Yes' },
            { v: false, label: field.falseLabel || 'No' },
          ].map((opt) => (
            <button
              key={String(opt.v)}
              onClick={() => onChange(opt.v)}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 12,
                border: '1px solid ' + (value === opt.v ? 'var(--ember)' : 'var(--line)'),
                background: value === opt.v ? 'var(--emberDim)' : 'var(--surface)',
                color: value === opt.v ? 'var(--ember)' : 'var(--boneDim)',
                font: "700 12px/1 'Inter'",
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
