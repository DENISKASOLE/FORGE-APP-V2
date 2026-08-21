import Avatar from '../../components/Avatar'
import Pill from '../../components/Pill'

export default function CoachBadge({ coach }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 24px' }}>
      <Avatar name={coach.name} size={28} online={coach.online} />
      <Pill tone="sage">{coach.name}</Pill>
    </div>
  )
}
