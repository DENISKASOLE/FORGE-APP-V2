import { supabase } from '../lib/supabase'
import { weightHistory as sampleWeightHistory, personalRecords as samplePRs, measurements as sampleMeasurements } from './sampleData'

const PHOTO_BUCKET = 'progress-photos'
const SIGNED_URL_TTL = 3600

function trendFor(bestWeight, recentWeight) {
  if (bestWeight == null || recentWeight == null) return 'flat'
  if (bestWeight > recentWeight) return 'up'
  if (bestWeight < recentWeight) return 'down'
  return 'flat'
}

// Weight is logged as part of a check-in, so weight history is just every
// check-in's weight over time -- no separate weight-log table needed.
export async function getWeightHistory(clientId) {
  if (!clientId) return sampleWeightHistory
  const { data, error } = await supabase
    .from('checkins')
    .select('weight, submitted_at')
    .eq('client_id', clientId)
    .not('weight', 'is', null)
    .order('submitted_at', { ascending: true })
  if (error) return sampleWeightHistory
  return data.map((r) => r.weight)
}

// Personal records are computed live from real set_logs (see
// get_personal_records() in supabase/progress.sql) rather than stored --
// they're always accurate and never go stale.
export async function getPersonalRecords(clientId) {
  if (!clientId) return samplePRs
  const { data, error } = await supabase.rpc('get_personal_records', { p_client_id: clientId })
  if (error) return []
  return data.map((r) => ({
    id: r.exercise_id,
    lift: r.exercise_name,
    best: `${r.best_weight}kg × ${r.best_reps}`,
    recent: `${r.recent_weight}kg × ${r.recent_reps}`,
    trend: trendFor(r.best_weight, r.recent_weight),
  }))
}

export async function getMeasurements(clientId) {
  if (!clientId) return sampleMeasurements
  const { data, error } = await supabase
    .from('measurements')
    .select('id, label, value, recorded_at')
    .eq('client_id', clientId)
    .order('recorded_at', { ascending: false })
  if (error) return []

  const byLabel = new Map()
  for (const row of data) {
    if (!byLabel.has(row.label)) byLabel.set(row.label, [])
    byLabel.get(row.label).push(row)
  }
  return Array.from(byLabel.entries()).map(([label, rows]) => ({
    id: rows[0].id,
    label,
    current: rows[0].value,
    previous: rows[1] ? rows[1].value : null,
  }))
}

export async function addMeasurement(clientId, label, value) {
  const { data, error } = await supabase
    .from('measurements')
    .insert({ client_id: clientId, label, value })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getProgressPhotos(clientId) {
  if (!clientId) return []
  const { data, error } = await supabase
    .from('progress_photos')
    .select('id, storage_path, taken_at')
    .eq('client_id', clientId)
    .order('taken_at', { ascending: false })
  if (error || data.length === 0) return []

  const { data: signed, error: signError } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrls(data.map((p) => p.storage_path), SIGNED_URL_TTL)
  if (signError) return []

  return data.map((p, i) => ({ id: p.id, takenAt: p.taken_at, url: signed[i]?.signedUrl }))
}

export async function uploadProgressPhoto(clientId, file) {
  const path = `${clientId}/${Date.now()}-${file.name}`
  const { error: uploadError } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file)
  if (uploadError) throw uploadError

  const { data, error } = await supabase
    .from('progress_photos')
    .insert({ client_id: clientId, storage_path: path })
    .select()
    .single()
  if (error) throw error

  const { data: signed } = await supabase.storage.from(PHOTO_BUCKET).createSignedUrl(path, SIGNED_URL_TTL)
  return { id: data.id, takenAt: data.taken_at, url: signed?.signedUrl }
}

export async function submitCheckin(clientId, form) {
  const { data, error } = await supabase
    .from('checkins')
    .insert({
      client_id: clientId,
      weight: form.weight,
      energy: form.energy,
      sleep: form.sleep,
      stress: form.stress,
      nutrition_adherence: form.adherence,
      notes: form.notes,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// -- Coach-facing --

export async function getCoachCheckins(coachId) {
  if (!coachId) return []
  const { data, error } = await supabase
    .from('checkins')
    .select('id, weight, energy, nutrition_adherence, status, submitted_at, profiles!inner(full_name, coach_id)')
    .eq('profiles.coach_id', coachId)
    .order('submitted_at', { ascending: false })
  if (error) return []
  return data.map((c) => ({
    id: c.id,
    clientName: c.profiles.full_name || 'Unnamed client',
    date: new Date(c.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: c.weight,
    energy: c.energy,
    nutrition: c.nutrition_adherence,
    status: c.status,
  }))
}

export async function markCheckinReviewed(checkinId) {
  const { error } = await supabase.from('checkins').update({ status: 'reviewed' }).eq('id', checkinId)
  if (error) throw error
}
