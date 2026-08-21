import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'

export default function TodayWorkoutCard({ workout }) {
  const navigate = useNavigate()
  return (
    <div style={{ padding: '0 24px 20px' }}>
      <Card>
        <div
          className="label"
          style={{ color: 'var(--ember)', marginBottom: 7, textTransform: 'uppercase' }}
        >
          Today's Workout · Week {workout.week}
        </div>
        <div style={{ font: "800 20px/1.15 'Inter'", color: 'var(--bone)', letterSpacing: '-0.3px', marginBottom: 6 }}>
          {workout.name}
        </div>
        <div style={{ font: "500 12px/1 'Inter'", color: 'var(--boneDim)', marginBottom: 16 }}>
          {workout.exerciseCount} exercises
        </div>
        <Button full onClick={() => navigate(`/train/session/${workout.id}`)}>
          Start Workout
        </Button>
      </Card>
    </div>
  )
}
