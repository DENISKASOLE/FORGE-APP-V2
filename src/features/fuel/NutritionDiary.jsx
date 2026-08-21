import { useEffect, useState } from 'react'
import { Books } from '@phosphor-icons/react'
import { getNutritionDiary } from '../../data/clientData'
import MacroSummaryCard from './MacroSummaryCard'
import MealSection from './MealSection'
import AddFoodSheet from './AddFoodSheet'
import MealsLibrarySheet from './MealsLibrarySheet'

export default function NutritionDiary() {
  const [data, setData] = useState(null)
  const [meals, setMeals] = useState([])
  const [savedMeals, setSavedMeals] = useState([])
  const [activeMealId, setActiveMealId] = useState(null)
  const [showLibrary, setShowLibrary] = useState(false)

  useEffect(() => {
    getNutritionDiary().then((d) => {
      setData(d)
      setMeals(d.meals)
      setSavedMeals(d.savedMeals)
    })
  }, [])

  if (!data) return null

  const activeMeal = meals.find((m) => m.id === activeMealId)

  function addFoodToMeal(food) {
    setMeals((prev) =>
      prev.map((m) => (m.id === activeMealId ? { ...m, items: [...m.items, { ...food, id: `${food.id}-${Date.now()}` }] } : m)),
    )
    setActiveMealId(null)
  }

  function addSavedMealToMeal(savedMeal) {
    addFoodToMeal({ ...savedMeal, emoji: '🍽️' })
  }

  function quickAddSavedMeal(savedMeal) {
    const target = meals.find((m) => m.id === 'snacks') || meals[0]
    setMeals((prev) =>
      prev.map((m) =>
        m.id === target.id
          ? { ...m, items: [...m.items, { ...savedMeal, emoji: '🍽️', id: `${savedMeal.id}-${Date.now()}` }] }
          : m,
      ),
    )
    setShowLibrary(false)
  }

  function saveMeal(meal) {
    setSavedMeals((prev) => [meal, ...prev])
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

      <MacroSummaryCard targets={data.targets} coachName="Coach Denis" />

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
          onAddFood={addFoodToMeal}
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
