import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getMeHubData } from '../../data/clientData'
import BackHeader from '../../components/BackHeader'
import Card from '../../components/Card'
import Pill from '../../components/Pill'

const statusTone = { paid: 'sage', overdue: 'red', pending: 'muted' }

export default function PaymentsView() {
  const { profile } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    getMeHubData(profile).then(setData)
  }, [profile])

  if (!data) return null

  return (
    <div style={{ paddingBottom: 24 }}>
      <BackHeader title="Payments" />
      <div style={{ padding: '0 24px 20px' }}>
        {data.payments.next ? (
          <Card>
            <div className="label" style={{ marginBottom: 8 }}>Next payment</div>
            <div style={{ font: "800 22px/1 'Inter'", color: 'var(--amber)', marginBottom: 6 }}>{data.payments.next.amount}</div>
            <div style={{ font: "500 12px/1 'Inter'", color: 'var(--boneDim)' }}>Due {data.payments.next.date}</div>
          </Card>
        ) : (
          <Card>
            <div style={{ font: "500 12px/1.5 'Inter'", color: 'var(--muted)' }}>
              No upcoming payment on file — check with your coach.
            </div>
          </Card>
        )}
      </div>
      <div style={{ padding: '0 24px' }}>
        <div className="label" style={{ marginBottom: 10 }}>History</div>
        {data.payments.history.length === 0 && (
          <div style={{ font: "500 12px/1.5 'Inter'", color: 'var(--muted)', padding: '10px 0' }}>No payments yet.</div>
        )}
        {data.payments.history.map((p) => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <div>
              <div style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)' }}>{p.amount}</div>
              <div style={{ font: "400 11px/1 'Inter'", color: 'var(--muted)', marginTop: 4 }}>{p.date}</div>
            </div>
            <Pill tone={statusTone[p.status]}>{p.status}</Pill>
          </div>
        ))}
      </div>
    </div>
  )
}
