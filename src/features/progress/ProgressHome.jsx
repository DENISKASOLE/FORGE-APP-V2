import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import CheckinWizard from '../checkin/CheckinWizard'
import ProgressTabs from './ProgressTabs'

const sections = [
  { value: 'progress', label: 'Progress' },
  { value: 'checkin', label: 'Check-in' },
]

export default function ProgressHome() {
  const { user } = useAuth()
  const [section, setSection] = useState('progress')

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: '20px 24px 16px' }}>
        <div style={{ font: "800 22px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.4px' }}>Progress</div>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 24px 20px' }}>
        {sections.map((s) => (
          <button
            key={s.value}
            onClick={() => setSection(s.value)}
            style={{
              flex: 1,
              background: section === s.value ? 'var(--ember)' : 'var(--surface)',
              color: section === s.value ? '#fff' : 'var(--boneDim)',
              border: '1px solid ' + (section === s.value ? 'var(--ember)' : 'var(--line)'),
              borderRadius: 100,
              padding: '10px 0',
              font: "600 12px/1 'Inter'",
              cursor: 'pointer',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === 'progress' ? (
        <div style={{ padding: '0 24px' }}>
          <ProgressTabs clientId={user?.id} />
        </div>
      ) : (
        <CheckinWizard />
      )}
    </div>
  )
}
