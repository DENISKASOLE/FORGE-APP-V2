import { Outlet } from 'react-router-dom'
import { House, Barbell, ForkKnife, ChartLineUp, UserCircle } from '@phosphor-icons/react'
import BottomNavBar from '../components/BottomNavBar'

const items = [
  { to: '/today', label: 'Today', icon: House },
  { to: '/train', label: 'Train', icon: Barbell },
  { to: '/nutrition', label: 'Nutrition', icon: ForkKnife },
  { to: '/progress', label: 'Progress', icon: ChartLineUp },
  { to: '/me', label: 'Me', icon: UserCircle },
]

export default function ClientLayout() {
  return (
    <div data-app="client" className="app-shell">
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </div>
      <BottomNavBar items={items} />
    </div>
  )
}
