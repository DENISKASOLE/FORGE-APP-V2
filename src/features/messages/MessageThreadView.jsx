import { useEffect, useRef } from 'react'
import { PaperPlaneRight } from '@phosphor-icons/react'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'

// Presentational shell shared by the client's "Message Coach" screen and
// the coach's per-client message screen. `thread` entries are always
// thread-relative ({from: 'client'|'coach'}); `viewerSide` says which
// side the current viewer is on, so their own messages align right.
export default function MessageThreadView({
  title,
  thread,
  viewerSide,
  otherName,
  text,
  setText,
  onSend,
  sending,
  error,
  emptyText,
}) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <BackHeader title={title} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {thread.length === 0 && (
          <div style={{ font: "500 12px/1.5 'Inter'", color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>
            {emptyText}
          </div>
        )}
        {thread.map((m) => {
          const mine = m.from === viewerSide
          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'flex-end',
                alignSelf: mine ? 'flex-end' : 'flex-start',
                flexDirection: mine ? 'row-reverse' : 'row',
                maxWidth: '80%',
              }}
            >
              {!mine && <Avatar name={otherName} size={26} />}
              <div
                style={{
                  background: mine ? 'var(--emberDim)' : 'var(--surface)',
                  color: mine ? 'var(--bone)' : 'var(--boneDim)',
                  border: '1px solid var(--line)',
                  borderRadius: 14,
                  padding: '10px 14px',
                  font: "500 13px/1.4 'Inter'",
                }}
              >
                {m.text}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {error && <div style={{ color: 'var(--red)', font: "600 12px/1.4 'Inter'", padding: '0 24px 8px' }}>{error}</div>}

      <div style={{ display: 'flex', gap: 10, padding: '14px 24px 24px', background: 'var(--ink2)' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder={`Message ${otherName}…`}
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
          onClick={onSend}
          disabled={sending}
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
            opacity: sending ? 0.7 : 1,
          }}
        >
          <PaperPlaneRight size={18} color="#fff" weight="fill" />
        </button>
      </div>
    </div>
  )
}
