import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getClientById } from '../../data/coachData'
import { getNutritionDiary, getProgressData } from '../../data/clientData'
import { payments as paymentsSample } from '../../data/sampleData'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'
import Pill from '../../components/Pill'
import Button from '../../components/Button'
import ProgramTab from './ProgramTab'
import WeightChart from '../progress/WeightChart'

const tabs = ['Profile', 'Program', 'Nutrition', 'Progress', 'Payments', 'Notes']

export default function ClientDetail() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [tab, setTab] = useState('Program')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    getClientById(clientId).then(setClient)
  }, [clientId])

  if (!client) return null

  return (
    <div style={{ paddingBottom: 24 }}>
      <BackHeader
        title="Clients"
        action={
          <Button style={{ padding: '8px 14px' }} onClick={() => navigate('/me/messages')}>
            Message
          </Button>
        }
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px 18px' }}>
        <Avatar name={client.name} size={52} />
        <div>
          <div style={{ font: "700 18px/1 'Inter'", color: 'var(--bone)', marginBottom: 6 }}>{client.name}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ font: "500 11px/1 'Inter'", color: 'var(--muted)' }}>{client.week}</span>
            <Pill tone="sage">{client.compliance}%</Pill>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 18, padding: '0 24px 20px', overflowX: 'auto', borderBottom: '1px solid var(--line)' }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flexShrink: 0,
              background: 'none',
              border: 'none',
              padding: '0 0 12px',
              cursor: 'pointer',
              color: tab === t ? 'var(--ember)' : 'var(--muted)',
              borderBottom: tab === t ? '2px solid var(--ember)' : '2px solid transparent',
              font: "600 12px/1 'Inter'",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 24px' }}>
        {tab === 'Profile' && <ProfileTab client={client} />}
        {tab === 'Program' && <ProgramTab clientId={clientId} clientName={client.name} />}
        {tab === 'Nutrition' && <NutritionTab />}
        {tab === 'Progress' && <ProgressTab />}
        {tab === 'Payments' && <PaymentsTab />}
        {tab === 'Notes' && <NotesTab notes={notes} setNotes={setNotes} />}
      </div>
    </div>
  )
}

function ProfileTab({ client }) {
  const rows = [
    { label: 'Status', value: client.status },
    { label: 'Program week', value: client.week },
    { label: 'Compliance', value: `${client.compliance}%` },
    { label: 'Next payment', value: client.nextPayment },
  ]
  return (
    <div>
      {rows.map((r) => (
        <div key={r.label} style={{ padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
          <div className="label" style={{ marginBottom: 6 }}>{r.label}</div>
          <div style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)' }}>{r.value}</div>
        </div>
      ))}
    </div>
  )
}

function NutritionTab() {
  const [data, setData] = useState(null)
  useEffect(() => {
    getNutritionDiary().then(setData)
  }, [])
  if (!data) return null
  const { targets } = data
  return (
    <div>
      <div className="label" style={{ marginBottom: 10 }}>Daily targets</div>
      {[
        { label: 'Calories', value: `${targets.kcalTarget} kcal` },
        { label: 'Protein', value: `${targets.protein.target}g` },
        { label: 'Carbs', value: `${targets.carbs.target}g` },
        { label: 'Fat', value: `${targets.fat.target}g` },
      ].map((row) => (
        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
          <span style={{ font: "500 12px/1 'Inter'", color: 'var(--boneDim)' }}>{row.label}</span>
          <span style={{ font: "700 12px/1 'Inter'", color: 'var(--bone)' }}>{row.value}</span>
        </div>
      ))}
    </div>
  )
}

function ProgressTab() {
  const [data, setData] = useState(null)
  useEffect(() => {
    getProgressData().then(setData)
  }, [])
  if (!data) return null
  return (
    <div>
      <WeightChart history={data.weightHistory} />
      <div className="label" style={{ margin: '18px 0 10px' }}>Personal records</div>
      {data.personalRecords.map((pr) => (
        <div key={pr.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
          <span style={{ font: "600 12px/1 'Inter'", color: 'var(--bone)' }}>{pr.lift}</span>
          <span style={{ font: "500 11px/1 'Inter'", color: 'var(--muted)' }}>{pr.best}</span>
        </div>
      ))}
    </div>
  )
}

function PaymentsTab() {
  return (
    <div>
      {paymentsSample.history.map((p) => (
        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
          <span style={{ font: "600 12px/1 'Inter'", color: 'var(--bone)' }}>{p.amount}</span>
          <Pill tone={p.status === 'paid' ? 'sage' : 'red'}>{p.status}</Pill>
        </div>
      ))}
    </div>
  )
}

function NotesTab({ notes, setNotes }) {
  return (
    <textarea
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      placeholder="Private notes about this client…"
      rows={8}
      style={{
        width: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        padding: 14,
        color: 'var(--bone)',
        font: "500 13px/1.5 'Inter'",
        resize: 'none',
      }}
    />
  )
}
