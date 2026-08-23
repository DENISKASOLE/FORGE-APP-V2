import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { INTAKE_SECTIONS, emptyIntakeForm } from '../../data/intakeSchema'
import { submitIntakeForm } from '../../data/intake'
import StepStepper from '../checkin/StepStepper'
import IntakeStart from './IntakeStart'
import IntakeStep from './IntakeStep'
import IntakeSubmitted from './IntakeSubmitted'

const TOTAL_STEPS = INTAKE_SECTIONS.length

// step 0 = intro, 1..TOTAL_STEPS = one section each, TOTAL_STEPS+1 = done.
export default function IntakeWizard() {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(emptyIntakeForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const sectionIndex = step - 1
  const inSection = step >= 1 && step <= TOTAL_STEPS
  const isLastSection = sectionIndex === TOTAL_STEPS - 1

  async function handleNext() {
    if (!isLastSection) {
      setStep((s) => s + 1)
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await submitIntakeForm(user.id, form)
      setStep(TOTAL_STEPS + 1)
    } catch (err) {
      setError(err.message || 'Could not submit your intake form.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '20px 24px 40px', minHeight: '100%' }}>
      {inSection && <StepStepper step={sectionIndex} total={TOTAL_STEPS} />}
      {step === 0 && <IntakeStart onStart={() => setStep(1)} />}
      {inSection && (
        <IntakeStep
          section={INTAKE_SECTIONS[sectionIndex]}
          form={form}
          setForm={setForm}
          onNext={handleNext}
          isLast={isLastSection}
          submitting={submitting}
          error={error}
        />
      )}
      {step === TOTAL_STEPS + 1 && <IntakeSubmitted />}
    </div>
  )
}
