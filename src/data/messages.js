import { supabase } from '../lib/supabase'
import { messages as sampleMessages } from './sampleData'

// A thread is always keyed by the client's id -- clientId is the client
// on both sides of the conversation, senderId is whoever is sending (the
// client themselves, or their coach). `from` is thread-relative ('client'
// or 'coach'), not viewer-relative, so the same row renders correctly for
// both the client's and the coach's UI.
function mapMessage(row, clientId) {
  return {
    id: row.id,
    from: row.sender_id === clientId ? 'client' : 'coach',
    text: row.body,
    time: new Date(row.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  }
}

export async function getMessages(clientId) {
  if (!clientId) return sampleMessages
  const { data, error } = await supabase
    .from('messages')
    .select('id, sender_id, body, created_at')
    .eq('client_id', clientId)
    .order('created_at', { ascending: true })
  if (error) return []
  return data.map((row) => mapMessage(row, clientId))
}

export async function sendMessage(clientId, senderId, body) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ client_id: clientId, sender_id: senderId, body })
    .select()
    .single()
  if (error) throw error
  return mapMessage(data, clientId)
}
