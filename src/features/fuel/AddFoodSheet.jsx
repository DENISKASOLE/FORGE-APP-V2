import { useState } from 'react'
import { MagnifyingGlass, Plus } from '@phosphor-icons/react'

export default function AddFoodSheet({ mealName, recents, savedMeals, onAddFood, onAddSavedMeal, onClose }) {
  const [tab, setTab] = useState('recent')
  const [query, setQuery] = useState('')

  const filtered = recents.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,12,9,0.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 40,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          maxHeight: '80vh',
          background: 'var(--ink2)',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          borderTop: '1px solid var(--lineS)',
          padding: '12px 24px 28px',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 100, background: 'rgba(244,237,225,0.15)', margin: '0 auto 18px' }} />
        <div style={{ font: "700 17px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.3px', marginBottom: 4 }}>
          Add to {mealName}
        </div>
        <div style={{ font: "500 11px/1 'Inter'", color: 'var(--muted)', marginBottom: 16 }}>
          Search or pick from recents
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            padding: '10px 14px',
            marginBottom: 14,
          }}
        >
          <MagnifyingGlass size={16} color="var(--muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search foods…"
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--bone)', font: "500 13px/1 'Inter'", flex: 1 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 18, marginBottom: 14, borderBottom: '1px solid var(--line)' }}>
          {['recent', 'meals'].map((t) => (
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
              {t === 'recent' ? 'Recent' : 'My Meals'}
            </button>
          ))}
        </div>

        {tab === 'recent'
          ? filtered.map((food) => (
              <FoodRow key={food.id} food={food} onAdd={() => onAddFood(food)} />
            ))
          : savedMeals.map((meal) => (
              <div
                key={meal.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ font: "600 12px/1 'Inter'", color: 'var(--bone)' }}>{meal.name}</div>
                  <div style={{ font: "400 10px/1 'Inter'", color: 'var(--muted)', marginTop: 2 }}>
                    {meal.kcal} kcal · P{meal.protein} C{meal.carbs} F{meal.fat}
                  </div>
                </div>
                <AddButton onClick={() => onAddSavedMeal(meal)} />
              </div>
            ))}
      </div>
    </div>
  )
}

function FoodRow({ food, onAdd }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'var(--surface2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
        }}
      >
        {food.emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ font: "600 12px/1 'Inter'", color: 'var(--bone)' }}>{food.name}</div>
        <div style={{ font: "400 10px/1 'Inter'", color: 'var(--muted)', marginTop: 2 }}>
          {food.serving} · {food.kcal} kcal
        </div>
      </div>
      <AddButton onClick={onAdd} />
    </div>
  )
}

function AddButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        background: 'var(--emberDim)',
        border: 'none',
        color: 'var(--ember)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <Plus size={14} weight="bold" />
    </button>
  )
}
