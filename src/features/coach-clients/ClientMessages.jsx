import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getClientById } from '../../data/coachData'
import { getMessages, sendMessage } from '../../data/messages'
import MessageThreadView from '../messages/MessageThreadView'

export default function ClientMessages() {
  const { clientId } = useParams()
  const { user } = useAuth()
  const [clientName, setClientName] = useState('Client')
  const [thread, setThread] = useState(null)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getClientById(clientId).then((c) => c?.name && setClientName(c.name))
  }, [clientId])

  useEffect(() => {
    getMessages(clientId).then(setThread)
  }, [clientId])

  async function handleSend() {
    if (!text.trim() || sending) return
    setError('')
    setSending(true)
    const body = text.trim()
    setText('')
    try {
      const saved = await sendMessage(clientId, user.id, body)
      setThread((prev) => [...prev, saved])
    } catch (err) {
      setError(err.message || 'Could not send that message.')
    } finally {
      setSending(false)
    }
  }

  if (thread === null) return null

  return (
    <MessageThreadView
      title={clientName}
      thread={thread}
      viewerSide="coach"
      otherName={clientName}
      text={text}
      setText={setText}
      onSend={handleSend}
      sending={sending}
      error={error}
      emptyText={`No messages yet with ${clientName}.`}
    />
  )
}
