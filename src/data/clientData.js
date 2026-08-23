// Data-access seam for the client app. Each function currently resolves
// sample data; once supabase/schema.sql is applied, swap the body for a
// real supabase.from(...) query — callers already await these as async.
import { supabase } from '../lib/supabase'
import { client, habitRings, todayWorkout, learnTips, learnArticles, payments as samplePayments } from './sampleData'

// profile: the real signed-in user's profiles row (from useAuth()). Its
// full_name overrides the sample client's name/fullName; until it's set,
// screens show an honest "waiting for name" placeholder instead of a
// fake person.
function withRealName(profile) {
  const fullName = profile?.full_name || ''
  return {
    ...client,
    name: fullName.split(' ')[0] || 'there',
    fullName: fullName || 'Waiting for your name…',
  }
}

export async function getTodayData(profile) {
  return { client: withRealName(profile), habitRings, todayWorkout, learnTips }
}

export async function getLearnArticles() {
  return learnArticles
}

async function getCoachInfo(coachId) {
  if (!coachId) return { name: 'your coach', packageLabel: null, avatarUrl: null }
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, package_name, package_price, avatar_url')
    .eq('id', coachId)
    .maybeSingle()
  if (error || !data) return { name: 'your coach', packageLabel: null, avatarUrl: null }
  const packageLabel = data.package_name && data.package_price ? `${data.package_name} · ${data.package_price}` : null
  return { name: data.full_name || 'your coach', packageLabel, avatarUrl: data.avatar_url || null }
}

// "Week N" is derived from how long the client's current program has been
// assigned -- programs don't store a week counter, so this is computed,
// never stored (same reasoning as personal records in src/data/progress.js).
async function getActiveProgramSummary(clientId) {
  const { data, error } = await supabase
    .from('programs')
    .select('name, created_at')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error || !data) return { program: null, week: null }
  const weeksElapsed = Math.floor((Date.now() - new Date(data.created_at).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
  return { program: data.name, week: `Week ${weeksElapsed}` }
}

// Distinct calendar days the client has ever logged a workout -- real
// activity, not a fabricated streak number.
async function getDaysActive(clientId) {
  const { data, error } = await supabase.from('workout_logs').select('performed_at').eq('client_id', clientId)
  if (error) return 0
  return new Set(data.map((r) => r.performed_at.slice(0, 10))).size
}

async function getPaymentsSummary(clientId) {
  const { data, error } = await supabase
    .from('payments')
    .select('id, amount, currency, status, due_date')
    .eq('client_id', clientId)
    .order('due_date', { ascending: false })
  if (error) return { next: null, history: [] }
  const upcoming = data.find((p) => p.status !== 'paid')
  return {
    next: upcoming ? { date: upcoming.due_date, amount: `${upcoming.amount} ${upcoming.currency}` } : null,
    history: data.map((p) => ({ id: p.id, date: p.due_date, amount: `${p.amount} ${p.currency}`, status: p.status })),
  }
}

export async function getMeHubData(profile) {
  if (!profile?.id) {
    return { client: withRealName(profile), payments: samplePayments }
  }

  const [coach, programSummary, daysActive, payments] = await Promise.all([
    getCoachInfo(profile.coach_id),
    getActiveProgramSummary(profile.id),
    getDaysActive(profile.id),
    getPaymentsSummary(profile.id),
  ])

  return {
    client: {
      ...withRealName(profile),
      coach,
      program: programSummary.program,
      week: programSummary.week,
      daysActive,
    },
    payments,
  }
}
