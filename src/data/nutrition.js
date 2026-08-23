import { supabase } from '../lib/supabase'
import {
  nutritionTargets as sampleTargets,
  meals as sampleMeals,
  foodLibrary,
  savedMeals as sampleSavedMeals,
} from './sampleData'

const MEAL_SLOTS = [
  { name: 'Breakfast', emoji: '🍳', time: '7:30 AM' },
  { name: 'Lunch', emoji: '🥗', time: '12:45 PM' },
  { name: 'Dinner', emoji: '🍽️', time: '7:00 PM' },
  { name: 'Snacks', emoji: '🍎', time: 'All day' },
]

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

function mapFoodItem(row) {
  return {
    id: row.id,
    emoji: row.emoji,
    name: row.name,
    serving: row.serving,
    kcal: row.kcal,
    protein: row.protein_g,
    carbs: row.carbs_g,
    fat: row.fat_g,
  }
}

function mapSavedMeal(row) {
  return { id: row.id, name: row.name, kcal: row.kcal, protein: row.protein_g, carbs: row.carbs_g, fat: row.fat_g }
}

// Real targets (set by the coach) + today's real logged food, bundled
// into the exact shape the UI already expects (target+consumed+color per
// macro). Falls back to the sample bundle when there's no signed-in
// client or the tables aren't migrated yet. targets resolves to null (not
// the sample) when the tables ARE migrated but the coach hasn't set
// anything yet, so the UI can show its own "no targets yet" empty state.
export async function getNutritionDiary(clientId) {
  if (!clientId) {
    return { targets: sampleTargets, meals: sampleMeals, foodLibrary, savedMeals: sampleSavedMeals }
  }

  const date = todayDate()
  const [targetsResult, mealsResult, savedResult] = await Promise.all([
    supabase.from('nutrition_targets').select('*').eq('client_id', clientId).maybeSingle(),
    supabase.from('meals').select('*, food_items(*)').eq('client_id', clientId).eq('logged_date', date),
    supabase.from('saved_meals').select('*').eq('client_id', clientId).order('name'),
  ])

  if (targetsResult.error || mealsResult.error || savedResult.error) {
    return { targets: sampleTargets, meals: sampleMeals, foodLibrary, savedMeals: sampleSavedMeals }
  }

  const meals = MEAL_SLOTS.map((slot) => {
    const row = mealsResult.data.find((m) => m.name === slot.name)
    return {
      id: slot.name.toLowerCase(),
      name: slot.name,
      emoji: slot.emoji,
      time: slot.time,
      items: row ? row.food_items.map(mapFoodItem) : [],
    }
  })

  const consumed = meals
    .flatMap((m) => m.items)
    .reduce(
      (t, i) => ({ kcal: t.kcal + i.kcal, protein: t.protein + i.protein, carbs: t.carbs + i.carbs, fat: t.fat + i.fat }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0 },
    )

  const targetRow = targetsResult.data
  const targets = targetRow
    ? {
        kcalTarget: targetRow.kcal,
        kcalConsumed: consumed.kcal,
        protein: { target: targetRow.protein_g, consumed: consumed.protein, color: 'var(--court)' },
        carbs: { target: targetRow.carbs_g, consumed: consumed.carbs, color: 'var(--amber)' },
        fat: { target: targetRow.fat_g, consumed: consumed.fat, color: 'var(--violet)' },
        adherence: targetRow.kcal > 0 ? Math.min(Math.round((consumed.kcal / targetRow.kcal) * 100), 100) : 0,
        streak: null, // not tracked yet -- shown as "--" rather than a fake number
      }
    : null

  return { targets, meals, foodLibrary, savedMeals: savedResult.data.map(mapSavedMeal) }
}

async function getOrCreateMeal(clientId, mealName, date) {
  const { data: existing, error } = await supabase
    .from('meals')
    .select('id')
    .eq('client_id', clientId)
    .eq('name', mealName)
    .eq('logged_date', date)
    .maybeSingle()
  if (error) throw error
  if (existing) return existing.id

  const { data, error: insertError } = await supabase
    .from('meals')
    .insert({ client_id: clientId, name: mealName, logged_date: date })
    .select('id')
    .single()
  if (insertError) throw insertError
  return data.id
}

export async function addFoodToMeal(clientId, mealName, food) {
  const mealId = await getOrCreateMeal(clientId, mealName, todayDate())
  const { data, error } = await supabase
    .from('food_items')
    .insert({
      meal_id: mealId,
      name: food.name,
      emoji: food.emoji,
      serving: food.serving,
      kcal: food.kcal,
      protein_g: food.protein,
      carbs_g: food.carbs,
      fat_g: food.fat,
    })
    .select()
    .single()
  if (error) throw error
  return mapFoodItem(data)
}

export async function createSavedMeal(clientId, meal) {
  const { data, error } = await supabase
    .from('saved_meals')
    .insert({
      client_id: clientId,
      name: meal.name,
      kcal: meal.kcal,
      protein_g: meal.protein,
      carbs_g: meal.carbs,
      fat_g: meal.fat,
    })
    .select()
    .single()
  if (error) throw error
  return mapSavedMeal(data)
}

// -- Coach-facing --

export async function getNutritionTargetsForClient(clientId) {
  if (!clientId) return null
  const { data, error } = await supabase.from('nutrition_targets').select('*').eq('client_id', clientId).maybeSingle()
  if (error || !data) return null
  return { kcal: data.kcal, protein: data.protein_g, carbs: data.carbs_g, fat: data.fat_g }
}

export async function setNutritionTargets(clientId, { kcal, protein, carbs, fat }) {
  const { data, error } = await supabase
    .from('nutrition_targets')
    .upsert({ client_id: clientId, kcal, protein_g: protein, carbs_g: carbs, fat_g: fat }, { onConflict: 'client_id' })
    .select()
    .single()
  if (error) throw error
  return { kcal: data.kcal, protein: data.protein_g, carbs: data.carbs_g, fat: data.fat_g }
}

// -- FatSecret food database (via the supabase/functions/fatsecret proxy) --
//
// The proxy holds the FatSecret credentials server-side. If it hasn't been
// deployed yet (or the call fails for any reason), search falls back to
// filtering the small built-in reference list so the UI keeps working.

export async function searchFatSecretFoods(query) {
  const trimmed = (query || '').trim()
  if (trimmed.length < 2) return []
  try {
    const { data, error } = await supabase.functions.invoke('fatsecret', {
      body: { action: 'search', query: trimmed },
    })
    if (error) throw error
    return data
  } catch {
    return foodLibrary.filter((f) => f.name.toLowerCase().includes(trimmed.toLowerCase()))
  }
}

// Fetches a food's servings and returns the default (or first) serving's
// macros, ready to hand straight to addFoodToMeal.
export async function getFatSecretFoodPick(food) {
  const { data, error } = await supabase.functions.invoke('fatsecret', {
    body: { action: 'details', foodId: food.id },
  })
  if (error) throw error
  const serving = data.servings.find((s) => s.isDefault) || data.servings[0]
  if (!serving) throw new Error('No serving data available for this food.')
  return {
    name: food.brand ? `${food.name} (${food.brand})` : food.name,
    emoji: '🍽️',
    serving: serving.description,
    kcal: serving.kcal,
    protein: serving.protein,
    carbs: serving.carbs,
    fat: serving.fat,
  }
}

// The client's own previously-logged foods, most recent first, deduped by
// name -- real "recents" instead of a generic static list.
export async function getRecentFoods(clientId, limit = 15) {
  if (!clientId) return foodLibrary
  const { data, error } = await supabase
    .from('food_items')
    .select('id, name, emoji, serving, kcal, protein_g, carbs_g, fat_g, meals!inner(client_id)')
    .eq('meals.client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) return []

  const seen = new Set()
  const out = []
  for (const row of data) {
    if (seen.has(row.name)) continue
    seen.add(row.name)
    out.push(mapFoodItem(row))
    if (out.length >= limit) break
  }
  return out
}

// Today's logged totals for a client, for the coach to review -- read only.
export async function getTodaysNutritionTotals(clientId) {
  if (!clientId) return null
  const { data, error } = await supabase
    .from('meals')
    .select('food_items(kcal, protein_g, carbs_g, fat_g)')
    .eq('client_id', clientId)
    .eq('logged_date', todayDate())
  if (error) return null
  const items = data.flatMap((m) => m.food_items)
  return items.reduce(
    (t, i) => ({
      kcal: t.kcal + i.kcal,
      protein: t.protein + i.protein_g,
      carbs: t.carbs + i.carbs_g,
      fat: t.fat + i.fat_g,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  )
}
