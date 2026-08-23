import { supabase } from '../lib/supabase'
import { INTAKE_SECTIONS } from './intakeSchema'

const ALL_KEYS = INTAKE_SECTIONS.flatMap((s) => s.fields.map((f) => f.key))

// 'submitted' | 'pending' | null (null = no client signed in / table not
// migrated yet, so the Today-screen banner stays hidden rather than
// nagging someone we can't actually check).
export async function getIntakeStatus(clientId) {
  if (!clientId) return null
  const { data, error } = await supabase
    .from('intake_forms')
    .select('submitted_at')
    .eq('client_id', clientId)
    .maybeSingle()
  if (error) return null
  return data?.submitted_at ? 'submitted' : 'pending'
}

export async function getIntakeForm(clientId) {
  if (!clientId) return null
  const { data, error } = await supabase.from('intake_forms').select('*').eq('client_id', clientId).maybeSingle()
  if (error) return null
  return data
}

export async function submitIntakeForm(clientId, form) {
  const payload = { client_id: clientId, submitted_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  for (const key of ALL_KEYS) {
    const value = form[key]
    payload[key] = value === '' ? null : value
  }
  const { data, error } = await supabase.from('intake_forms').upsert(payload, { onConflict: 'client_id' }).select().single()
  if (error) throw error
  return data
}

// -- Coach-facing --

export async function getCoachIntakeList(coachId) {
  if (!coachId) return []
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, intake_forms(submitted_at)')
    .eq('coach_id', coachId)
    .eq('role', 'client')
    .order('full_name', { ascending: true })
  if (error) return []
  return data.map((row) => ({
    id: row.id,
    name: row.full_name || row.email || 'Unnamed client',
    submitted: Boolean(row.intake_forms?.submitted_at),
    submittedAt: row.intake_forms?.submitted_at || null,
  }))
}
