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

export async function updateProfile(userId, fields) {
  const { data, error } = await supabase.from('profiles').update(fields).eq('id', userId).select().single()
  if (error) throw error
  return data
}

const AVATAR_BUCKET = 'avatars'

// Always the same path per user (no extension) so re-uploading replaces
// the old photo in place instead of accumulating orphaned files under a
// changing filename.
export async function uploadAvatar(userId, file) {
  const path = `${userId}/avatar`
  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path)
  // Cache-bust: the path never changes, so without this a browser that
  // already cached the old photo would keep showing it after a re-upload.
  const avatarUrl = `${data.publicUrl}?t=${Date.now()}`
  return updateProfile(userId, { avatar_url: avatarUrl })
}
