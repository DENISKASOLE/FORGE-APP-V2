// Data-access seam for the coach app.
import { supabase } from '../lib/supabase'
import { coachProfile, coachTools } from './sampleData'
import { getCoachCheckins } from './progress'
import { getCoachIntakeList } from './intake'

async function getRawCoachClientProfiles(coachId) {
  if (!coachId) return []
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url')
    .eq('coach_id', coachId)
    .eq('role', 'client')
    .order('full_name', { ascending: true })
  if (error) return []
  return data
}

// Card shape used by the Roster/Home client lists. Real linked clients
// don't have compliance/activity/payment data wired up yet, so those
// render as honest placeholders (see RosterCard/ClientListCard) instead
// of fabricated numbers. name/avatarUrl are the client's own -- editable
// from their Me tab and picked up here on next fetch, no separate sync.
function mapClientCard(profile) {
  return {
    id: profile.id,
    name: profile.full_name || profile.email || 'Unnamed client',
    avatarUrl: profile.avatar_url || null,
    status: 'New client',
    tone: 'muted',
    compliance: null,
    week: '',
    nextPayment: '',
    activity: Array(7).fill('pending'),
  }
}

export async function getCoachHomeData(coachId) {
  const [profileResult, rawClients] = await Promise.all([
    coachId ? supabase.from('profiles').select('full_name, email').eq('id', coachId).maybeSingle() : Promise.resolve({ data: null }),
    getRawCoachClientProfiles(coachId),
  ])
  const clients = rawClients.map(mapClientCard)
  const realName = profileResult.data?.full_name || profileResult.data?.email
  return {
    coachProfile: {
      name: realName || coachProfile.name,
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
    .select('id, full_name, email, avatar_url')
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

// Real pending-count badges for the tools that have one (checkins,
// intake forms) instead of the old hardcoded "3 new".
export async function getCoachTools(coachId) {
  if (!coachId) return coachTools

  const [checkins, intakeList] = await Promise.all([getCoachCheckins(coachId), getCoachIntakeList(coachId)])
  const pendingCheckins = checkins.filter((c) => c.status === 'pending').length
  const pendingIntake = intakeList.filter((c) => !c.submitted).length

  return coachTools.map((tool) => {
    const base = { id: tool.id, label: tool.label, tone: tool.tone }
    if (tool.id === 'checkins' && pendingCheckins > 0) return { ...base, badge: pendingCheckins }
    if (tool.id === 'intake' && pendingIntake > 0) return { ...base, badge: pendingIntake }
    return base
  })
}

// Raw profiles (id/full_name/email, no card mapping) for the program
// builder's client picker.
export async function getCoachClientProfiles(coachId) {
  return getRawCoachClientProfiles(coachId)
}
