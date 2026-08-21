import { useEffect, useState } from 'react'
import { getTodayData } from '../../data/clientData'
import Header from './Header'
import CoachBadge from './CoachBadge'
import HabitRings from './HabitRings'
import TodayWorkoutCard from './TodayWorkoutCard'
import LearnCarousel from './LearnCarousel'

export default function TodayDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    getTodayData().then(setData)
  }, [])

  if (!data) return null

  return (
    <div style={{ paddingBottom: 24 }}>
      <Header name={data.client.name} />
      <CoachBadge coach={data.client.coach} />
      <HabitRings rings={data.habitRings} />
      <TodayWorkoutCard workout={data.todayWorkout} />
      <LearnCarousel tips={data.learnTips} />
    </div>
  )
}
