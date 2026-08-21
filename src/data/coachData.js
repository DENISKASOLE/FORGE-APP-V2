// Data-access seam for the coach app — see src/data/clientData.js for the
// swap-to-Supabase note.
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
