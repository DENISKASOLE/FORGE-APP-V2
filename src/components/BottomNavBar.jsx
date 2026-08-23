import { NavLink } from 'react-router-dom'

export default function BottomNavBar({ items }) {
  return (
    <nav
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        background: 'var(--ink2)',
        borderTop: '1px solid var(--line)',
        padding: '10px 8px 28px',
        zIndex: 10,
      }}
    >
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: '4px 0',
          }}
        >
          {({ isActive }) => (
            <>
              <Icon
                size={22}
                weight={isActive ? 'fill' : 'regular'}
                color={isActive ? 'var(--ember)' : 'var(--muted)'}
              />
              <span
                style={{
                  font: `${isActive ? 600 : 500} 9px/1 'Inter'`,
                  color: isActive ? 'var(--ember)' : 'var(--muted)',
                  letterSpacing: '0.02em',
                }}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
