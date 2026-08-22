import { useEffect, useMemo, useState } from 'react'
import { MagnifyingGlass, X, Check } from '@phosphor-icons/react'
import { getExercises } from '../../data/exercises'
import Button from '../../components/Button'
import Pill from '../../components/Pill'

export default function ExercisePickerSheet({
  title = 'Choose Exercise',
  mode = 'single',
  excludeIds = [],
  onSelect,
  onConfirm,
  onClose,
}) {
  const [exercises, setExercises] = useState(null)
  const [query, setQuery] = useState('')
  const [muscleGroup, setMuscleGroup] = useState('all')
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    getExercises().then(setExercises)
  }, [])

  const muscleGroups = useMemo(
    () => [...new Set((exercises || []).map((e) => e.muscle_group).filter(Boolean))].sort(),
    [exercises],
  )

  const filtered = (exercises || [])
    .filter((e) => !excludeIds.includes(e.id))
    .filter((e) => muscleGroup === 'all' || e.muscle_group === muscleGroup)
    .filter((e) => !query || e.name.toLowerCase().includes(query.toLowerCase()))

  function toggle(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function handleRowTap(exercise) {
    if (mode === 'single') {
      onSelect(exercise)
    } else {
      toggle(exercise.id)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--ink)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px' }}>
        <div style={{ font: "700 17px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.3px' }}>{title}</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={20} color="var(--bone)" />
        </button>
      </div>

      <div style={{ padding: '0 24px 14px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            padding: '10px 14px',
          }}
        >
          <MagnifyingGlass size={16} color="var(--muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exercises…"
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--bone)', font: "500 13px/1 'Inter'", flex: 1 }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 24px 14px', overflowX: 'auto' }}>
        {[{ value: 'all', label: 'All Muscles' }, ...muscleGroups.map((m) => ({ value: m, label: m }))].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setMuscleGroup(opt.value)}
            style={{
              flexShrink: 0,
              background: muscleGroup === opt.value ? 'var(--ember)' : 'var(--surface)',
              color: muscleGroup === opt.value ? '#fff' : 'var(--boneDim)',
              border: '1px solid ' + (muscleGroup === opt.value ? 'var(--ember)' : 'var(--line)'),
              borderRadius: 100,
              padding: '8px 14px',
              font: "600 11px/1 'Inter'",
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
        {filtered.map((ex) => {
          const checked = selectedIds.includes(ex.id)
          return (
            <button
              key={ex.id}
              onClick={() => handleRowTap(ex)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: checked ? 'var(--emberDim)' : 'var(--surface)',
                border: '1px solid ' + (checked ? 'var(--ember)' : 'var(--line)'),
                borderRadius: 14,
                padding: '12px 14px',
                marginBottom: 10,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: ex.media_url
                    ? `center / cover no-repeat url(${ex.media_url})`
                    : 'linear-gradient(135deg, var(--surface2), var(--ink2))',
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "600 13px/1.3 'Inter'", color: 'var(--bone)' }}>{ex.name}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <Pill tone="sage">{ex.muscle_group}</Pill>
                  {ex.equipment && <Pill tone="muted">{ex.equipment}</Pill>}
                </div>
              </div>
              {mode === 'multi' && checked && (
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'var(--ember)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Check size={12} weight="bold" color="#fff" />
                </div>
              )}
            </button>
          )
        })}
        {exercises && filtered.length === 0 && (
          <div style={{ font: "500 12px/1.4 'Inter'", color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>
            No exercises match.
          </div>
        )}
      </div>

      {mode === 'multi' && (
        <div style={{ padding: '14px 24px 24px' }}>
          <Button
            full
            disabled={selectedIds.length === 0}
            style={{ opacity: selectedIds.length === 0 ? 0.5 : 1 }}
            onClick={() => onConfirm(exercises.filter((e) => selectedIds.includes(e.id)))}
          >
            Add {selectedIds.length || ''} Alternate{selectedIds.length === 1 ? '' : 's'}
          </Button>
        </div>
      )}
    </div>
  )
}
