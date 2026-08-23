// Data-access seam for the client app. Each function currently resolves
// sample data; once supabase/schema.sql is applied, swap the body for a
// real supabase.from(...) query — callers already await these as async.
import { client, habitRings, todayWorkout, learnTips, learnArticles, payments, messages } from './sampleData'

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

export async function getMeHubData(profile) {
  return { client: withRealName(profile), payments, messages }
}
