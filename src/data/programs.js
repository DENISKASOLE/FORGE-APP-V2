import { supabase } from '../lib/supabase'
import { trainingProgram as sampleProgram } from './sampleData'

const PROGRAM_TREE = `
  *,
  program_days (
    *,
    program_exercises (
      *,
      exercises (*),
      exercise_swaps ( *, exercises (*) )
    )
  )
`

const DAY_TREE = `
  *,
  program_exercises (
    *,
    exercises (*),
    exercise_swaps ( *, exercises (*) )
  )
`

// Groups a day's already-sorted program_exercises into blocks by consecutive
// same block_label runs (e.g. two exercises labelled "Block 2 — Superset" in
// a row render as one grouped block). Exercises with no label each get their
// own block.
export function groupProgramExercisesByBlock(programExercises) {
  const blocks = []
  for (const pe of programExercises) {
    const label = pe.block_label || 'Block'
    const last = blocks[blocks.length - 1]
    if (last && last.label === label) {
      last.programExercises.push(pe)
    } else {
      blocks.push({ label, programExercises: [pe] })
    }
  }
  return blocks
}

function sortProgram(program) {
  const days = [...(program.program_days || [])].sort((a, b) => a.sort_order - b.sort_order)
  days.forEach((day) => {
    day.program_exercises = [...(day.program_exercises || [])].sort((a, b) => a.sort_order - b.sort_order)
  })
  return { ...program, program_days: days }
}

// Used by the client Train tab. Falls back to the sample program only when
// there's no real client (DEV_BYPASS) or the tables aren't migrated yet --
// a real, successful query that finds zero rows returns null so the UI can
// show its own "no program assigned yet" empty state instead of a demo.
export async function getClientActiveProgram(clientId) {
  if (!clientId) return sampleProgram
  const { data, error } = await supabase
    .from('programs')
    .select(PROGRAM_TREE)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) return sampleProgram
  return data ? sortProgram(data) : null
}

// Used by the coach's per-client Program tab. Returns null (not the sample
// fallback) on error too -- the coach view should surface "create a program"
// rather than a fake demo program that can't actually be edited/saved.
export async function getCoachProgramForClient(coachId, clientId) {
  if (!coachId || !clientId) return null
  const { data, error } = await supabase
    .from('programs')
    .select(PROGRAM_TREE)
    .eq('coach_id', coachId)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error || !data) return null
  return sortProgram(data)
}

export async function getProgramDetail(programId) {
  const { data, error } = await supabase.from('programs').select(PROGRAM_TREE).eq('id', programId).maybeSingle()
  if (error || !data) return null
  return sortProgram(data)
}

// Used when starting/logging a session. Falls back to the matching sample
// day so DEV_BYPASS and pre-migration dev still work end to end.
export async function getProgramDayForSession(programDayId) {
  const { data, error } = await supabase.from('program_days').select(DAY_TREE).eq('id', programDayId).maybeSingle()
  if (error || !data) {
    return sampleProgram.program_days.find((d) => d.id === programDayId) || null
  }
  return {
    ...data,
    program_exercises: [...(data.program_exercises || [])].sort((a, b) => a.sort_order - b.sort_order),
  }
}

export async function createProgram({ coachId, clientId, name, notes }) {
  const { data, error } = await supabase
    .from('programs')
    .insert({ coach_id: coachId, client_id: clientId, name, notes: notes || null })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function createProgramDay({ programId, dayLabel, sortOrder }) {
  const { data, error } = await supabase
    .from('program_days')
    .insert({ program_id: programId, day_label: dayLabel, sort_order: sortOrder })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function createProgramExercise({ programDayId, exerciseId, blockLabel, sets, reps, sortOrder }) {
  const { data, error } = await supabase
    .from('program_exercises')
    .insert({
      program_day_id: programDayId,
      exercise_id: exerciseId,
      block_label: blockLabel || null,
      sets,
      reps,
      sort_order: sortOrder,
    })
    .select('*, exercises(*), exercise_swaps(*, exercises(*))')
    .single()
  if (error) throw error
  return data
}

export async function deleteProgramExercise(id) {
  const { error } = await supabase.from('program_exercises').delete().eq('id', id)
  if (error) throw error
}

export async function addExerciseSwap({ programExerciseId, alternateExerciseId }) {
  const { data, error } = await supabase
    .from('exercise_swaps')
    .insert({ program_exercise_id: programExerciseId, alternate_exercise_id: alternateExerciseId })
    .select('*, exercises(*)')
    .single()
  if (error) throw error
  return data
}

export async function deleteExerciseSwap(id) {
  const { error } = await supabase.from('exercise_swaps').delete().eq('id', id)
  if (error) throw error
}
