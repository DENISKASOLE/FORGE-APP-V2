// Data-access seam for the client app. Each function currently resolves
// sample data; once supabase/schema.sql is applied, swap the body for a
// real supabase.from(...) query — callers already await these as async.
import {
  client,
  habitRings,
  todayWorkout,
  learnTips,
  learnArticles,
  trainingProgram,
  nutritionTargets,
  meals,
  foodLibrary,
  savedMeals,
  weightHistory,
  personalRecords,
  measurements,
  payments,
  messages,
} from './sampleData'

export async function getTodayData() {
  return { client, habitRings, todayWorkout, learnTips }
}

export async function getLearnArticles() {
  return learnArticles
}

export async function getTrainingProgram() {
  return trainingProgram
}

export async function getNutritionDiary() {
  return { targets: nutritionTargets, meals, foodLibrary, savedMeals }
}

export async function getProgressData() {
  return { weightHistory, personalRecords, measurements }
}

export async function getMeHubData() {
  return { client, payments, messages }
}
