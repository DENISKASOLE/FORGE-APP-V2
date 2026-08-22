import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import WorkoutSession from './WorkoutSession'

export default function ActiveSession() {
  const { dayId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <WorkoutSession
      dayId={dayId}
      clientId={user?.id}
      onBack={() => navigate(-1)}
      onFinish={(stats) => navigate('/train/summary', { state: stats })}
    />
  )
}
