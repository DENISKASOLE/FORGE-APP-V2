import { useEffect, useMemo, useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { getExercises, createExercise } from '../../data/exercises'
import { useAuth } from '../../hooks/useAuth'
import BackHeader from '../../components/BackHeader'
import FilterChips from '../../components/FilterChips'
import ExerciseCard from './ExerciseCard'
import AddExerciseSheet from './AddExerciseSheet'

export default function ExerciseLibrary() {
  const { user } = useAuth()
  const [exercises, setExercises] = useState(null)
  const [query, setQuery] = useState('')
  const [muscleGroup, setMuscleGroup] = useState('all')
  const [equipment, setEquipment] = useState('all')
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    getExercises().then(setExercises)
  }, [])

  const muscleGroups = useMemo(
    () => [...new Set((exercises || []).map((e) => e.muscle_group).filter(Boolean))].sort(),
    [exercises],
  )
  const equipmentOptions = useMemo(
    () => [...new Set((exercises || []).map((e) => e.equipment).filter(Boolean))].sort(),
    [exercises],
  )

  const filtered = (exercises || []).filter((e) => {
    if (muscleGroup !== 'all' && e.muscle_group !== muscleGroup) return false
    if (equipment !== 'all' && e.equipment !== equipment) return false
    if (query && !e.name.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  async function handleSave(form) {
    const created = await createExercise({
      name: form.name.trim(),
      muscleGroup: form.muscleGroup.trim(),
      equipment: form.equipment.trim(),
      instructions: form.instructions.trim(),
      mediaUrl: form.mediaUrl.trim(),
      createdBy: user?.id,
    })
    setExercises((prev) => [created, ...(prev || [])])
    setShowAdd(false)
  }

  if (!exercises) return null

  return (
    <div style={{ paddingBottom: 24 }}>
      <BackHeader
        title="Exercise Library"
        action={
          <button
            onClick={() => setShowAdd(true)}
            style={{
              background: 'var(--ember)',
              color: '#fff',
              border: 'none',
              borderRadius: 100,
              padding: '9px 16px',
              font: "700 11px/1 'Inter'",
              cursor: 'pointer',
            }}
          >
            + Add
          </button>
        }
      />

      <div style={{ padding: '0 24px 16px' }}>
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

      <FilterChips
        options={[{ value: 'all', label: 'All Muscles' }, ...muscleGroups.map((m) => ({ value: m, label: m }))]}
        active={muscleGroup}
        onSelect={setMuscleGroup}
      />
      <FilterChips
        options={[{ value: 'all', label: 'All Equipment' }, ...equipmentOptions.map((e) => ({ value: e, label: e }))]}
        active={equipment}
        onSelect={setEquipment}
      />

      <div style={{ padding: '4px 24px 0' }}>
        <div style={{ font: "500 11px/1 'Inter'", color: 'var(--muted)', marginBottom: 12 }}>
          {filtered.length} exercise{filtered.length === 1 ? '' : 's'}
        </div>
        {filtered.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>

      {showAdd && (
        <AddExerciseSheet
          muscleGroups={muscleGroups}
          equipmentOptions={equipmentOptions}
          onSave={handleSave}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
