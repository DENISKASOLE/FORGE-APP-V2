import { Navigate, Route, Routes } from 'react-router-dom'
import AuthProvider from './features/auth/AuthProvider'
import { useAuth } from './hooks/useAuth'
import { useViewMode } from './hooks/useViewMode'
import { useAccentColor } from './hooks/useAccentColor'
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

import CoachHomePage from './pages/coach/CoachHomePage'
import ClientsPage from './pages/coach/ClientsPage'
import ClientDetailPage from './pages/coach/ClientDetailPage'
import ToolsPage from './pages/coach/ToolsPage'
import WorkoutBuilderPage from './pages/coach/WorkoutBuilderPage'
import CheckinsFeedPage from './pages/coach/CheckinsFeedPage'
import AlertsPage from './pages/coach/AlertsPage'
import CoachSettingsPage from './pages/coach/CoachSettingsPage'

// DEV-ONLY: skips the login/signup gate and drops straight into the app so
// the client and coach experiences can be previewed without a Supabase
// session. The "View as Coach" / "View as Client" button (bottom-right)
// still switches between the two. SET THIS TO false BEFORE LAUNCH.
const DEV_BYPASS = true

function Gate() {
  const { user, loading } = useAuth()
  const [mode] = useViewMode()

  if (loading) {
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

  if (!user && !DEV_BYPASS) {
    return <AuthPage />
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={mode === 'coach' ? '/coach' : '/today'} replace />} />

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
      </Route>

      <Route element={<CoachLayout />}>
        <Route path="/coach" element={<CoachHomePage />} />
        <Route path="/coach/clients" element={<ClientsPage />} />
        <Route path="/coach/clients/:clientId" element={<ClientDetailPage />} />
        <Route path="/coach/tools" element={<ToolsPage />} />
        <Route path="/coach/tools/builder" element={<WorkoutBuilderPage />} />
        <Route path="/coach/tools/checkins" element={<CheckinsFeedPage />} />
        <Route path="/coach/alerts" element={<AlertsPage />} />
        <Route path="/coach/settings" element={<CoachSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  useAccentColor()
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
