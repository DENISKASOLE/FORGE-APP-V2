import { useEffect, useRef, useState } from 'react'
import { PaperPlaneRight } from '@phosphor-icons/react'
import { getMeHubData } from '../../data/clientData'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'

export default function MessageThread() {
  const [data, setData] = useState(null)
  const [thread, setThread] = useState([])
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    getMeHubData().then((d) => {
      setData(d)
      setThread(d.messages)
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread])

  function send() {
    if (!text.trim()) return
    setThread((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, from: 'client', text: text.trim(), time: 'Now' },
    ])
    setText('')
  }

  if (!data) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <BackHeader title={data.client.coach.name} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {thread.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'flex-end',
              alignSelf: m.from === 'client' ? 'flex-end' : 'flex-start',
              flexDirection: m.from === 'client' ? 'row-reverse' : 'row',
              maxWidth: '80%',
            }}
          >
            {m.from === 'coach' && <Avatar name={data.client.coach.name} size={26} />}
            <div
              style={{
                background: m.from === 'client' ? 'var(--emberDim)' : 'var(--surface)',
                color: m.from === 'client' ? 'var(--bone)' : 'var(--boneDim)',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: '10px 14px',
                font: "500 13px/1.4 'Inter'",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '14px 24px 24px', background: 'var(--ink2)' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Message your coach…"
          style={{
            flex: 1,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 100,
            padding: '12px 18px',
            color: 'var(--bone)',
            font: "500 13px/1 'Inter'",
            outline: 'none',
          }}
        />
        <button
          onClick={send}
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: 'var(--ember)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <PaperPlaneRight size={18} color="#fff" weight="fill" />
        </button>
      </div>
    </div>
  )
}
