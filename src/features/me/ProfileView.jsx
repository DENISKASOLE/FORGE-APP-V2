import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getMeHubData } from '../../data/clientData'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'

export default function ProfileView() {
  const { user, profile } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    getMeHubData(profile).then(setData)
  }, [profile])

  if (!data) return null

  const rows = [
    { label: 'Full name', value: data.client.fullName },
    { label: 'Email', value: user?.email },
    { label: 'Coach', value: data.client.coach.name },
    { label: 'Current package', value: data.client.coach.packageLabel || 'Not set yet' },
  ]

  return (
    <div style={{ paddingBottom: 24 }}>
      <BackHeader title="Profile" />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 24px' }}>
        <Avatar name={data.client.fullName} size={72} />
      </div>
      <div style={{ padding: '0 24px' }}>
        {rows.map((row) => (
          <div key={row.label} style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
            <div className="label" style={{ marginBottom: 6 }}>{row.label}</div>
            <div style={{ font: "600 14px/1 'Inter'", color: 'var(--bone)' }}>{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
