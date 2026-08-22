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
