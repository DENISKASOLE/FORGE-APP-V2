import { Outlet } from 'react-router-dom'
import { House, Barbell, ForkKnife, ClipboardText, BookOpen, UserCircle } from '@phosphor-icons/react'
import BottomNavBar from '../components/BottomNavBar'
import ViewToggle from '../components/ViewToggle'

const items = [
  { to: '/today', label: 'Today', icon: House },
  { to: '/train', label: 'Train', icon: Barbell },
  { to: '/fuel', label: 'Fuel', icon: ForkKnife },
  { to: '/checkin', label: 'Check-in', icon: ClipboardText },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/me', label: 'Me', icon: UserCircle },
]

export default function ClientLayout() {
  return (
    <div data-app="client" className="app-shell">
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </div>
      <BottomNavBar items={items} />
      <ViewToggle />
    </div>
  )
}
