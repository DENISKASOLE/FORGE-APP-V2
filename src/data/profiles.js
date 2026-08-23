import { supabase } from '../lib/supabase'

export async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) return null
  return data
}

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I/L ambiguity

export function generateInviteCode(length = 6) {
  let code = ''
  for (let i = 0; i < length; i += 1) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  }
  return code
}

export async function setInviteCode(userId, code) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ invite_code: code })
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}
