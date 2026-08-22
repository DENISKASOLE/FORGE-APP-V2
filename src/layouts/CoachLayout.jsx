import { Outlet } from 'react-router-dom'
import { House, Users, SquaresFour, Bell, GearSix } from '@phosphor-icons/react'
import BottomNavBar from '../components/BottomNavBar'
import ViewToggle from '../components/ViewToggle'

const items = [
  { to: '/coach', label: 'Home', icon: House, end: true },
  { to: '/coach/clients', label: 'Clients', icon: Users },
  { to: '/coach/tools', label: 'Tools', icon: SquaresFour },
  { to: '/coach/alerts', label: 'Alerts', icon: Bell },
  { to: '/coach/settings', label: 'Settings', icon: GearSix },
]

export default function CoachLayout({ devMode = false }) {
  return (
    <div data-app="coach" className="app-shell">
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </div>
      <BottomNavBar items={items} />
      {devMode && <ViewToggle />}
    </div>
  )
}
