const macroTotal = (items) =>
  items.reduce(
    (t, i) => ({ kcal: t.kcal + i.kcal, protein: t.protein + i.protein, carbs: t.carbs + i.carbs, fat: t.fat + i.fat }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  )

export default function MealSection({ meal, onAdd }) {
  const totals = macroTotal(meal.items)

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 16 }}>{meal.emoji}</span>
        <span style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)' }}>{meal.name}</span>
        <span style={{ font: "400 10px/1 'Inter'", color: 'var(--muted)' }}>{meal.time}</span>
        {meal.items.length > 0 && (
          <span style={{ marginLeft: 'auto', font: "700 12px/1 'Inter'", color: 'var(--ember)' }}>
            {totals.kcal} kcal
          </span>
        )}
      </div>

      {meal.items.length === 0 ? (
        <button
          onClick={onAdd}
          style={{
            width: '100%',
            border: '1px dashed var(--lineS)',
            borderRadius: 14,
            background: 'transparent',
            color: 'var(--ember)',
            padding: '16px',
            font: "700 12px/1 'Inter'",
            cursor: 'pointer',
          }}
        >
          + Add
        </button>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: '4px 14px' }}>
          {meal.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                borderBottom: '1px solid var(--line)',
              }}
            >
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
                {item.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: "600 12px/1 'Inter'", color: 'var(--bone)' }}>{item.name}</div>
                <div style={{ font: "400 10px/1 'Inter'", color: 'var(--muted)', marginTop: 2 }}>
                  {item.serving} · P{item.protein} C{item.carbs} F{item.fat}
                </div>
              </div>
              <div style={{ font: "700 12px/1 'Inter'", color: 'var(--boneDim)' }}>{item.kcal}</div>
            </div>
          ))}
          <button
            onClick={onAdd}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: 'var(--ember)',
              padding: '10px 0',
              font: "700 11px/1 'Inter'",
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            + Add to {meal.name}
          </button>
        </div>
      )}
    </div>
  )
}
