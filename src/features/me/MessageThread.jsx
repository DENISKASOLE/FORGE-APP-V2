import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getProfile } from '../../data/profiles'
import { getMessages, sendMessage } from '../../data/messages'
import MessageThreadView from '../messages/MessageThreadView'

export default function MessageThread() {
  const { user, profile } = useAuth()
  const [coachName, setCoachName] = useState('Coach')
  const [coachAvatarUrl, setCoachAvatarUrl] = useState(null)
  const [thread, setThread] = useState(null)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getMessages(user?.id).then(setThread)
  }, [user?.id])

  useEffect(() => {
    if (!profile?.coach_id) return
    getProfile(profile.coach_id).then((c) => {
      if (c?.full_name) setCoachName(c.full_name)
      setCoachAvatarUrl(c?.avatar_url || null)
    })
  }, [profile?.coach_id])

  async function handleSend() {
    if (!text.trim() || sending) return
    setError('')
    setSending(true)
    const body = text.trim()
    setText('')
    try {
      const saved = await sendMessage(user.id, user.id, body)
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
      title={coachName}
      thread={thread}
      viewerSide="client"
      otherName={coachName}
      otherAvatarUrl={coachAvatarUrl}
      text={text}
      setText={setText}
      onSend={handleSend}
      sending={sending}
      error={error}
      emptyText={`No messages yet — say hi to ${coachName}.`}
    />
  )
}
