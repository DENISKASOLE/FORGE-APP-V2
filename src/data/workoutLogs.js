import { supabase } from '../lib/supabase'

export async function createWorkoutLog({ clientId, programDayId }) {
  const { data, error } = await supabase
    .from('workout_logs')
    .insert({ client_id: clientId, program_day_id: programDayId })
    .select()
    .single()
  if (error) throw error
  return data
}

// sets: [{ exerciseId, setNumber, weight, reps }]
export async function createSetLogs(workoutLogId, sets) {
  if (!sets.length) return []
  const rows = sets.map((s) => ({
    workout_log_id: workoutLogId,
    exercise_id: s.exerciseId,
    set_number: s.setNumber,
    weight: s.weight,
    reps: s.reps,
  }))
  const { data, error } = await supabase.from('set_logs').insert(rows).select()
  if (error) throw error
  return data
}

// Coach-facing: every logged session for one client, most recent first,
// with each set's exercise name and which program day (if any) it was for.
export async function getClientWorkoutLogs(clientId) {
  if (!clientId) return []
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*, program_days ( day_label ), set_logs ( *, exercises (*) )')
    .eq('client_id', clientId)
    .order('performed_at', { ascending: false })
  if (error) return []
  return data.map((log) => ({
    ...log,
    set_logs: [...(log.set_logs || [])].sort((a, b) => a.set_number - b.set_number),
  }))
}

export async function updateSetLog(id, { weight, reps }) {
  const { data, error } = await supabase.from('set_logs').update({ weight, reps }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteSetLog(id) {
  const { error } = await supabase.from('set_logs').delete().eq('id', id)
  if (error) throw error
}

export async function deleteWorkoutLog(id) {
  const { error } = await supabase.from('workout_logs').delete().eq('id', id)
  if (error) throw error
}

// Which of the last `days` calendar days have at least one logged session,
// for the coach's missed-days strip. Real dates, not assumed to start Monday.
export function computeRecentActivity(workoutLogs, days = 7) {
  const today = new Date()
  const labels = []
  const states = []
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateKey = d.toISOString().slice(0, 10)
    const hasLog = workoutLogs.some((w) => (w.performed_at || '').slice(0, 10) === dateKey)
    labels.push(d.toLocaleDateString('en-US', { weekday: 'narrow' }))
    states.push(hasLog ? 'done' : 'miss')
  }
  return { labels, states }
}
