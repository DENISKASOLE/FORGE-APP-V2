import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle } from '@phosphor-icons/react'
import WorkoutSession from '../train/WorkoutSession'
import Button from '../../components/Button'

export default function LogSessionForClient() {
  const { clientId, dayId } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)

  if (result) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <CheckCircle size={48} weight="fill" color="var(--sage)" />
        <div style={{ font: "700 18px/1.3 'Inter'", color: 'var(--bone)', marginTop: 16, marginBottom: 6 }}>
          Session logged
        </div>
        <div style={{ font: "500 12px/1.5 'Inter'", color: 'var(--muted)', marginBottom: 28 }}>
          {result.setsCompleted}/{result.totalSets} sets · {result.totalVolume}kg volume
          {result.synced === false && (
            <>
              <br />
              This session wasn't saved.
            </>
          )}
        </div>
        <Button full onClick={() => navigate(`/coach/clients/${clientId}`)}>
          Back to Client
        </Button>
      </div>
    )
  }

  return (
    <WorkoutSession
      dayId={dayId}
      clientId={clientId}
      onBack={() => navigate(-1)}
      onFinish={setResult}
    />
  )
}
