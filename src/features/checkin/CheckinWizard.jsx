import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getProfile } from '../../data/profiles'
import { submitCheckin, uploadProgressPhoto } from '../../data/progress'
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
  photos: { Front: null, Back: null, Side: null },
}

export default function CheckinWizard() {
  const { user, profile } = useAuth()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [coachName, setCoachName] = useState('your coach')

  useEffect(() => {
    if (!profile?.coach_id) return
    getProfile(profile.coach_id).then((c) => c?.full_name && setCoachName(c.full_name))
  }, [profile?.coach_id])

  async function submit() {
    setError('')
    setBusy(true)
    try {
      await submitCheckin(user.id, form)
      const files = Object.values(form.photos).filter(Boolean)
      for (const file of files) {
        await uploadProgressPhoto(user.id, file)
      }
      setStep(4)
    } catch (err) {
      setError(err.message || 'Could not submit your check-in.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ padding: '20px 24px 40px', minHeight: '100%' }}>
      {step < 4 && <StepStepper step={step} />}
      {step === 0 && <StepStart coach={coachName} onStart={() => setStep(1)} />}
      {step === 1 && <StepWellbeing form={form} setForm={setForm} onNext={() => setStep(2)} />}
      {step === 2 && <StepNutrition form={form} setForm={setForm} onNext={() => setStep(3)} />}
      {step === 3 && <StepPhotos form={form} setForm={setForm} onSubmit={submit} busy={busy} error={error} />}
      {step === 4 && <StepSubmitted coach={coachName} />}
    </div>
  )
}
