import { useEffect, useState } from 'react'
import { Books } from '@phosphor-icons/react'
import { useAuth } from '../../hooks/useAuth'
import { getProfile } from '../../data/profiles'
import { getNutritionDiary, addFoodToMeal, createSavedMeal } from '../../data/nutrition'
import MacroSummaryCard from './MacroSummaryCard'
import MealSection from './MealSection'
import AddFoodSheet from './AddFoodSheet'
import MealsLibrarySheet from './MealsLibrarySheet'

export default function NutritionDiary() {
  const { user, profile } = useAuth()
  const [data, setData] = useState(undefined)
  const [meals, setMeals] = useState([])
  const [savedMeals, setSavedMeals] = useState([])
  const [activeMealId, setActiveMealId] = useState(null)
  const [showLibrary, setShowLibrary] = useState(false)
  const [error, setError] = useState('')
  const [coachName, setCoachName] = useState('Coach')

  useEffect(() => {
    getNutritionDiary(user?.id).then((d) => {
      setData(d)
      setMeals(d.meals)
      setSavedMeals(d.savedMeals)
    })
  }, [user?.id])

  useEffect(() => {
    if (!profile?.coach_id) return
    getProfile(profile.coach_id).then((c) => c?.full_name && setCoachName(c.full_name))
  }, [profile?.coach_id])

  if (data === undefined) return null

  const activeMeal = meals.find((m) => m.id === activeMealId)

  async function addFoodToMealHandler(food) {
    setError('')
    try {
      const saved = await addFoodToMeal(user.id, activeMeal.name, food)
      setMeals((prev) => prev.map((m) => (m.id === activeMealId ? { ...m, items: [...m.items, saved] } : m)))
      setActiveMealId(null)
    } catch (err) {
      setError(err.message || 'Could not add that food.')
    }
  }

  async function addSavedMealToMeal(savedMeal) {
    await addFoodToMealHandler({ ...savedMeal, emoji: '🍽️', serving: '' })
  }

  async function quickAddSavedMeal(savedMeal) {
    setError('')
    try {
      const target = meals.find((m) => m.id === 'snacks') || meals[0]
      const saved = await addFoodToMeal(user.id, target.name, { ...savedMeal, emoji: '🍽️', serving: '' })
      setMeals((prev) => prev.map((m) => (m.id === target.id ? { ...m, items: [...m.items, saved] } : m)))
      setShowLibrary(false)
    } catch (err) {
      setError(err.message || 'Could not add that meal.')
    }
  }

  async function saveMeal(meal) {
    setError('')
    try {
      const saved = await createSavedMeal(user.id, meal)
      setSavedMeals((prev) => [saved, ...prev])
    } catch (err) {
      setError(err.message || 'Could not save that meal.')
    }
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px' }}>
        <div>
          <div style={{ font: "800 22px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.4px' }}>Nutrition</div>
          <div style={{ font: "400 11px/1 'Inter'", color: 'var(--muted)', marginTop: 4 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>
        <button
          onClick={() => setShowLibrary(true)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Books size={16} color="var(--bone)" />
        </button>
      </div>

      {data.targets ? (
        <MacroSummaryCard targets={data.targets} coachName={coachName} />
      ) : (
        <div
          style={{
            margin: '0 24px 20px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 18,
            padding: 18,
            font: "500 12px/1.5 'Inter'",
            color: 'var(--muted)',
          }}
        >
          Your coach hasn't set your nutrition targets yet.
        </div>
      )}

      {error && (
        <div style={{ margin: '0 24px 16px', color: 'var(--red)', font: "600 12px/1.4 'Inter'" }}>{error}</div>
      )}

      <div style={{ padding: '0 24px' }}>
        {meals.map((meal) => (
          <MealSection key={meal.id} meal={meal} onAdd={() => setActiveMealId(meal.id)} />
        ))}
      </div>

      {activeMeal && (
        <AddFoodSheet
          mealName={activeMeal.name}
          recents={data.foodLibrary}
          savedMeals={savedMeals}
          onAddFood={addFoodToMealHandler}
          onAddSavedMeal={addSavedMealToMeal}
          onClose={() => setActiveMealId(null)}
        />
      )}

      {showLibrary && (
        <MealsLibrarySheet
          savedMeals={savedMeals}
          foodLibrary={data.foodLibrary}
          onQuickAdd={quickAddSavedMeal}
          onSaveMeal={saveMeal}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  )
}
