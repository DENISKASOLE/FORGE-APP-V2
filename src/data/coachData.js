// Data-access seam for the coach app — see src/data/clientData.js for the
// swap-to-Supabase note.
import { supabase } from '../lib/supabase'
import {
  coachProfile,
  coachClients,
  coachCheckins,
  coachAlerts,
  coachTools,
} from './sampleData'

export async function getCoachHomeData() {
  return { coachProfile, coachClients, coachAlerts }
}

export async function getCoachClients() {
  return coachClients
}

export async function getClientById(clientId) {
  return coachClients.find((c) => c.id === clientId) || null
}

export async function getCoachCheckins() {
  return coachCheckins
}

export async function getCoachAlerts() {
  return coachAlerts
}

export async function getCoachTools() {
  return coachTools
}

// Real client profiles belonging to this coach (profiles.coach_id = coachId),
// used by the program builder's client picker. Unlike getCoachClients()
// above (still sample-data, used by the Roster/Home screens), this is a
// genuine query -- there's no rich sample fallback because a program can
// only ever be attached to a real client profile id.
export async function getCoachClientProfiles(coachId) {
  if (!coachId) return []
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('coach_id', coachId)
    .eq('role', 'client')
    .order('full_name', { ascending: true })
  if (error) return []
  return data
}
