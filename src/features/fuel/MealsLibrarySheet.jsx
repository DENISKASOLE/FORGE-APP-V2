import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import Button from '../../components/Button'

export default function MealsLibrarySheet({ savedMeals, foodLibrary, onQuickAdd, onSaveMeal, onClose }) {
  const [tab, setTab] = useState('saved')
  const [selected, setSelected] = useState([])
  const [mealName, setMealName] = useState('')

  function toggle(food) {
    setSelected((prev) =>
      prev.some((f) => f.id === food.id) ? prev.filter((f) => f.id !== food.id) : [...prev, food],
    )
  }

  const totals = selected.reduce(
    (t, f) => ({ kcal: t.kcal + f.kcal, protein: t.protein + f.protein, carbs: t.carbs + f.carbs, fat: t.fat + f.fat }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  )

  function save() {
    if (!mealName.trim() || selected.length === 0) return
    onSaveMeal({ id: `sm-${Date.now()}`, name: mealName.trim(), ...totals })
    setSelected([])
    setMealName('')
    setTab('saved')
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--ink)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px' }}>
        <div style={{ font: "700 18px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.3px' }}>
          {tab === 'saved' ? 'My Meals' : 'Create Meal'}
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={20} color="var(--bone)" />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 18, padding: '0 24px 14px', borderBottom: '1px solid var(--line)' }}>
        {['saved', 'create'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0 0 10px',
              cursor: 'pointer',
              color: tab === t ? 'var(--ember)' : 'var(--muted)',
              borderBottom: tab === t ? '2px solid var(--ember)' : '2px solid transparent',
              font: "600 11px/1 'Inter'",
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {t === 'saved' ? 'Saved Meals' : 'Create Meal'}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px' }}>
        {tab === 'saved' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {savedMeals.map((meal) => (
              <div
                key={meal.id}
                style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 14 }}
              >
                <div style={{ font: "600 13px/1.3 'Inter'", color: 'var(--bone)', marginBottom: 8 }}>{meal.name}</div>
                <div style={{ font: "800 15px/1 'Inter'", color: 'var(--ember)', marginBottom: 10 }}>{meal.kcal} kcal</div>
                <button
                  onClick={() => onQuickAdd(meal)}
                  style={{
                    width: '100%',
                    background: 'var(--emberDim)',
                    border: 'none',
                    color: 'var(--ember)',
                    borderRadius: 100,
                    padding: '8px 0',
                    font: "700 10px/1 'Inter'",
                    cursor: 'pointer',
                  }}
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: 14,
                marginBottom: 16,
                font: "600 11px/1 'Inter'",
                color: 'var(--boneDim)',
              }}
            >
              <span>{totals.kcal} kcal</span>
              <span>P{totals.protein}</span>
              <span>C{totals.carbs}</span>
              <span>F{totals.fat}</span>
            </div>

            {foodLibrary.map((food) => {
              const checked = selected.some((f) => f.id === food.id)
              return (
                <label
                  key={food.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--line)', cursor: 'pointer' }}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggle(food)} style={{ accentColor: 'var(--ember)', width: 16, height: 16 }} />
                  <span style={{ fontSize: 16 }}>{food.emoji}</span>
                  <span style={{ flex: 1, font: "500 12px/1 'Inter'", color: 'var(--bone)' }}>{food.name}</span>
                  <span style={{ font: "600 11px/1 'Inter'", color: 'var(--muted)' }}>{food.kcal} kcal</span>
                </label>
              )
            })}

            <div className="label" style={{ marginTop: 18, marginBottom: 8 }}>Meal name</div>
            <input
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="e.g. Post-Workout Shake"
              style={{
                width: '100%',
                background: 'var(--surface2)',
                border: '1px solid var(--line)',
                borderRadius: 12,
                padding: '12px 14px',
                color: 'var(--bone)',
                font: "600 13px/1 'Inter'",
                marginBottom: 18,
              }}
            />
            <Button full onClick={save}>Save Meal to Library</Button>
          </>
        )}
      </div>
    </div>
  )
}
