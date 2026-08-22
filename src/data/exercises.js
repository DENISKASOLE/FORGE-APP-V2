import { supabase } from '../lib/supabase'
import { exerciseLibrarySample } from './sampleData'

export async function getExercises() {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('muscle_group', { ascending: true })
    .order('name', { ascending: true })
  if (error) return exerciseLibrarySample
  return data
}

export async function createExercise({ name, muscleGroup, equipment, instructions, mediaUrl, createdBy }) {
  const { data, error } = await supabase
    .from('exercises')
    .insert({
      name,
      muscle_group: muscleGroup,
      equipment: equipment || null,
      instructions: instructions || null,
      media_url: mediaUrl || null,
      is_custom: true,
      created_by: createdBy || null,
    })
    .select()
    .single()
  if (error) throw error
  return data
}
