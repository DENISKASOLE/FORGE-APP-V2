// Data-access seam for the coach app.
import { supabase } from '../lib/supabase'
import { coachProfile, coachTools } from './sampleData'

async function getRawCoachClientProfiles(coachId) {
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

// Card shape used by the Roster/Home client lists. Real linked clients
// don't have compliance/activity/payment data wired up yet, so those
// render as honest placeholders (see RosterCard/ClientListCard) instead
// of fabricated numbers.
function mapClientCard(profile) {
  return {
    id: profile.id,
    name: profile.full_name || profile.email || 'Unnamed client',
    status: 'New client',
    tone: 'muted',
    compliance: null,
    week: '',
    nextPayment: '',
    activity: Array(7).fill('pending'),
  }
}

export async function getCoachHomeData(coachId) {
  const clients = (await getRawCoachClientProfiles(coachId)).map(mapClientCard)
  return {
    coachProfile: {
      ...coachProfile,
      activeClients: clients.length,
      monthRevenue: '0 AED',
      needsAttention: 0,
    },
    coachClients: clients,
    coachAlerts: [],
  }
}

export async function getCoachClients(coachId) {
  return (await getRawCoachClientProfiles(coachId)).map(mapClientCard)
}

export async function getClientById(clientId) {
  if (!clientId) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('id', clientId)
    .maybeSingle()
  if (error || !data) return null
  return mapClientCard(data)
}

// Alerts aren't wired to a real table yet (nothing writes to `alerts`),
// so this is honestly empty rather than showing fabricated people. Real
// check-ins live in src/data/progress.js's getCoachCheckins().
export async function getCoachAlerts() {
  return []
}

export async function getCoachTools() {
  return coachTools
}

// Raw profiles (id/full_name/email, no card mapping) for the program
// builder's client picker.
export async function getCoachClientProfiles(coachId) {
  return getRawCoachClientProfiles(coachId)
}
