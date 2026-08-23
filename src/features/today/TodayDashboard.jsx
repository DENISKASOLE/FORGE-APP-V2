import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getTodayData } from '../../data/clientData'
import { getIntakeStatus } from '../../data/intake'
import Header from './Header'
import CoachBadge from './CoachBadge'
import IntakeBanner from './IntakeBanner'
import HabitRings from './HabitRings'
import TodayWorkoutCard from './TodayWorkoutCard'
import LearnCarousel from './LearnCarousel'

export default function TodayDashboard() {
  const { profile } = useAuth()
  const [data, setData] = useState(null)
  const [intakeStatus, setIntakeStatus] = useState(null)

  useEffect(() => {
    getTodayData(profile).then(setData)
  }, [profile])

  useEffect(() => {
    getIntakeStatus(profile?.id).then(setIntakeStatus)
  }, [profile?.id])

  if (!data) return null

  return (
    <div style={{ paddingBottom: 24 }}>
      <Header name={data.client.name} />
      <CoachBadge coach={data.client.coach} />
      {intakeStatus === 'pending' && <IntakeBanner />}
      <HabitRings rings={data.habitRings} />
      <TodayWorkoutCard workout={data.todayWorkout} />
      <LearnCarousel tips={data.learnTips} />
    </div>
  )
}
