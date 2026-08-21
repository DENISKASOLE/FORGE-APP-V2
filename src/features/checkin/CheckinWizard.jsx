import { useState } from 'react'
import StepStepper from './StepStepper'
import StepStart from './StepStart'
import StepWellbeing from './StepWellbeing'
import StepNutrition from './StepNutrition'
import StepPhotos from './StepPhotos'
import StepSubmitted from './StepSubmitted'

const initialForm = {
  weight: 80.0,
  energy: 7,
  sleep: 7,
  stress: 4,
  adherence: 75,
  habits: { workouts: false, water: false, steps: false },
  notes: '',
  photos: { Front: false, Back: false, Side: false },
}

export default function CheckinWizard({ week = 8, coach = 'Coach Denis' }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [busy, setBusy] = useState(false)

  function submit() {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      setStep(4)
    }, 600)
  }

  return (
    <div style={{ padding: '20px 24px 40px', minHeight: '100%' }}>
      {step < 4 && <StepStepper step={step} />}
      {step === 0 && <StepStart week={week} coach={coach} onStart={() => setStep(1)} />}
      {step === 1 && <StepWellbeing form={form} setForm={setForm} onNext={() => setStep(2)} />}
      {step === 2 && <StepNutrition form={form} setForm={setForm} onNext={() => setStep(3)} />}
      {step === 3 && <StepPhotos form={form} setForm={setForm} onSubmit={submit} busy={busy} />}
      {step === 4 && <StepSubmitted coach={coach} />}
    </div>
  )
}
