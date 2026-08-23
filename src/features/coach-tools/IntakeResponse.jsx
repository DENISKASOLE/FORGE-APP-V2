import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getIntakeForm } from '../../data/intake'
import { getClientById } from '../../data/coachData'
import { INTAKE_SECTIONS } from '../../data/intakeSchema'
import BackHeader from '../../components/BackHeader'

export default function IntakeResponse() {
  const { clientId } = useParams()
  const [client, setClient] = useState(null)
  const [form, setForm] = useState(undefined)

  useEffect(() => {
    getClientById(clientId).then(setClient)
    getIntakeForm(clientId).then(setForm)
  }, [clientId])

  if (form === undefined) return null

  return (
    <div style={{ paddingBottom: 24 }}>
      <BackHeader title={client?.name || 'Intake'} />
      {!form?.submitted_at ? (
        <div style={{ padding: '0 24px', font: "500 12px/1.5 'Inter'", color: 'var(--muted)' }}>
          Not submitted yet.
        </div>
      ) : (
        <div style={{ padding: '0 24px' }}>
          {INTAKE_SECTIONS.map((section) => (
            <div key={section.title} style={{ marginBottom: 22 }}>
              <div className="label" style={{ marginBottom: 10 }}>{section.title}</div>
              {section.fields.map((field) => (
                <AnswerRow key={field.key} field={field} value={form[field.key]} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AnswerRow({ field, value }) {
  let display = value
  if (field.type === 'checkbox' || field.type === 'boolean') {
    display = value === true ? field.trueLabel || 'Yes' : value === false ? field.falseLabel || 'No' : '—'
  } else if (value === null || value === undefined || value === '') {
    display = '—'
  }
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
      <div style={{ font: "500 11px/1.4 'Inter'", color: 'var(--muted)', marginBottom: 4 }}>{field.label}</div>
      <div style={{ font: "600 13px/1.4 'Inter'", color: 'var(--bone)' }}>{display}</div>
    </div>
  )
}
