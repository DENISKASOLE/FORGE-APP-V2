import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthProvider from './features/auth/AuthProvider'
import { useAuth } from './hooks/useAuth'
import { useAccentColor, applyAccent } from './hooks/useAccentColor'
import { useTheme } from './hooks/useTheme'
import { getProfile } from './data/profiles'
import AuthPage from './pages/auth/AuthPage'
import ClientLayout from './layouts/ClientLayout'
import CoachLayout from './layouts/CoachLayout'

import TodayPage from './pages/client/TodayPage'
import TrainPage from './pages/client/TrainPage'
import ActiveSessionPage from './pages/client/ActiveSessionPage'
import SessionSummaryPage from './pages/client/SessionSummaryPage'
import NutritionPage from './pages/client/NutritionPage'
import LearnPage from './pages/client/LearnPage'
import MePage from './pages/client/MePage'
import ProfilePage from './pages/client/ProfilePage'
import PaymentsPage from './pages/client/PaymentsPage'
import MessageCoachPage from './pages/client/MessageCoachPage'
import ProgressPage from './pages/client/ProgressPage'
import IntakePage from './pages/client/IntakePage'

import CoachHomePage from './pages/coach/CoachHomePage'
import ClientsPage from './pages/coach/ClientsPage'
import ClientDetailPage from './pages/coach/ClientDetailPage'
import ClientMessagesPage from './pages/coach/ClientMessagesPage'
import LogSessionForClientPage from './pages/coach/LogSessionForClientPage'
import ToolsPage from './pages/coach/ToolsPage'
import ExerciseLibraryPage from './pages/coach/ExerciseLibraryPage'
import WorkoutBuilderPage from './pages/coach/WorkoutBuilderPage'
import CheckinsFeedPage from './pages/coach/CheckinsFeedPage'
import IntakeListPage from './pages/coach/IntakeListPage'
import IntakeResponsePage from './pages/coach/IntakeResponsePage'
import AlertsPage from './pages/coach/AlertsPage'
import CoachSettingsPage from './pages/coach/CoachSettingsPage'

function LoadingScreen() {
  return (
    <div
      data-app="client"
      className="app-shell"
      style={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <div style={{ font: "700 12px/1 'Inter'", color: 'var(--muted)', letterSpacing: '0.1em' }}>
        LOADING
      </div>
    </div>
  )
}

function Gate() {
  const { user, loading, profile, profileLoading } = useAuth()

  // A client's app reflects their coach's chosen brand accent, not the
  // client's own device-local preference -- coaches set this in Settings.
  // Runs before the early returns below so hook order stays stable.
  useEffect(() => {
    if (profile?.role !== 'client' || !profile?.coach_id) return
    getProfile(profile.coach_id).then((coach) => {
      if (coach?.accent_color) applyAccent(coach.accent_color)
    })
  }, [profile?.role, profile?.coach_id])

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <AuthPage />
  }

  // Wait for the profile so we don't flash the wrong app before we know
  // the user's role.
  if (profileLoading) {
    return <LoadingScreen />
  }

  // Defaults to client if the profile row is somehow missing.
  const role = profile?.role === 'coach' ? 'coach' : 'client'

  return (
    <Routes>
      <Route path="/" element={<Navigate to={role === 'coach' ? '/coach' : '/today'} replace />} />

      {role === 'client' && (
        <Route element={<ClientLayout />}>
          <Route path="/today" element={<TodayPage />} />
          <Route path="/train" element={<TrainPage />} />
          <Route path="/train/session/:dayId" element={<ActiveSessionPage />} />
          <Route path="/train/summary" element={<SessionSummaryPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/me" element={<MePage />} />
          <Route path="/me/profile" element={<ProfilePage />} />
          <Route path="/me/payments" element={<PaymentsPage />} />
          <Route path="/me/messages" element={<MessageCoachPage />} />
          <Route path="/me/learn" element={<LearnPage />} />
          <Route path="/intake" element={<IntakePage />} />
        </Route>
      )}

      {role === 'coach' && (
        <Route element={<CoachLayout />}>
          <Route path="/coach" element={<CoachHomePage />} />
          <Route path="/coach/clients" element={<ClientsPage />} />
          <Route path="/coach/clients/:clientId" element={<ClientDetailPage />} />
          <Route path="/coach/clients/:clientId/messages" element={<ClientMessagesPage />} />
          <Route path="/coach/clients/:clientId/log/:dayId" element={<LogSessionForClientPage />} />
          <Route path="/coach/tools" element={<ToolsPage />} />
          <Route path="/coach/tools/library" element={<ExerciseLibraryPage />} />
          <Route path="/coach/tools/builder" element={<WorkoutBuilderPage />} />
          <Route path="/coach/tools/checkins" element={<CheckinsFeedPage />} />
          <Route path="/coach/tools/intake" element={<IntakeListPage />} />
          <Route path="/coach/tools/intake/:clientId" element={<IntakeResponsePage />} />
          <Route path="/coach/alerts" element={<AlertsPage />} />
          <Route path="/coach/settings" element={<CoachSettingsPage />} />
        </Route>
      )}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  useAccentColor()
  useTheme()
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
