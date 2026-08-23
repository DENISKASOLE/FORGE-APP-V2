import { useState } from 'react'
import { Trash, X } from '@phosphor-icons/react'
import Button from '../../components/Button'
import ExercisePickerSheet from '../exercises/ExercisePickerSheet'
import NewExerciseDetailsForm from './NewExerciseDetailsForm'

export default function ProgramDayEditor({
  program,
  activeDayId,
  onSelectDay,
  onAddDay,
  onAddExercise,
  onDeleteExercise,
  onAddSwaps,
  onDeleteSwap,
}) {
  const [addingDay, setAddingDay] = useState(false)
  const [newDayLabel, setNewDayLabel] = useState('')
  const [exercisePicker, setExercisePicker] = useState(null)
  const [pendingExercise, setPendingExercise] = useState(null)

  const day = program.program_days.find((d) => d.id === activeDayId) || program.program_days[0]

  function submitNewDay() {
    if (!newDayLabel.trim()) return
    onAddDay(newDayLabel.trim())
    setNewDayLabel('')
    setAddingDay(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, padding: '0 24px 16px', overflowX: 'auto' }}>
        {program.program_days.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelectDay(d.id)}
            style={{
              flexShrink: 0,
              background: d.id === day?.id ? 'var(--ember)' : 'var(--surface)',
              color: d.id === day?.id ? '#fff' : 'var(--boneDim)',
              border: '1px solid ' + (d.id === day?.id ? 'var(--ember)' : 'var(--line)'),
              borderRadius: 100,
              padding: '9px 16px',
              font: "600 12px/1 'Inter'",
              cursor: 'pointer',
            }}
          >
            {d.day_label}
          </button>
        ))}
        <button
          onClick={() => setAddingDay(true)}
          style={{
            flexShrink: 0,
            background: 'transparent',
            color: 'var(--boneDim)',
            border: '1px dashed var(--lineS)',
            borderRadius: 100,
            padding: '9px 16px',
            font: "600 12px/1 'Inter'",
            cursor: 'pointer',
          }}
        >
          + Add Day
        </button>
      </div>

      {addingDay && (
        <div style={{ display: 'flex', gap: 8, padding: '0 24px 16px' }}>
          <input
            autoFocus
            value={newDayLabel}
            onChange={(e) => setNewDayLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitNewDay()}
            placeholder="e.g. Day D — Arms"
            style={{
              flex: 1,
              background: 'var(--surface2)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              padding: '12px 14px',
              color: 'var(--bone)',
              font: "600 13px/1 'Inter'",
              outline: 'none',
            }}
          />
          <Button style={{ padding: '0 18px' }} onClick={submitNewDay}>
            Add
          </Button>
        </div>
      )}

      {!day && (
        <div style={{ padding: '0 24px', font: "500 12px/1.5 'Inter'", color: 'var(--muted)' }}>
          Add a day to start building this program.
        </div>
      )}

      {day && (
        <div style={{ padding: '0 24px' }}>
          {day.program_exercises.map((pe) => (
            <div
              key={pe.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 16,
                padding: 14,
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="label" style={{ marginBottom: 6 }}>{pe.block_label || 'Block'}</div>
                  <div style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)' }}>{pe.exercises.name}</div>
                </div>
                <button
                  onClick={() => onDeleteExercise(day.id, pe.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                >
                  <Trash size={14} color="var(--red)" />
                </button>
              </div>

              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <div style={{ background: 'var(--surface2)', borderRadius: 9, padding: '6px 10px', textAlign: 'center' }}>
                  <div style={{ font: "700 12px/1 'Inter'", color: 'var(--bone)' }}>{pe.sets}</div>
                  <div style={{ font: "500 8px/1 'Inter'", color: 'var(--muted)', marginTop: 2 }}>SETS</div>
                </div>
                <div style={{ background: 'var(--surface2)', borderRadius: 9, padding: '6px 10px', textAlign: 'center' }}>
                  <div style={{ font: "700 12px/1 'Inter'", color: 'var(--bone)' }}>{pe.reps}</div>
                  <div style={{ font: "500 8px/1 'Inter'", color: 'var(--muted)', marginTop: 2 }}>REPS</div>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <div className="label" style={{ marginBottom: 8 }}>
                  Swap alternates{pe.exercise_swaps.length > 0 ? ` (${pe.exercise_swaps.length})` : ''}
                </div>
                {pe.exercise_swaps.map((sw) => (
                  <div
                    key={sw.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 0',
                      borderTop: '1px solid var(--line)',
                    }}
                  >
                    <span style={{ font: "500 12px/1 'Inter'", color: 'var(--boneDim)' }}>{sw.exercises.name}</span>
                    <button
                      onClick={() => onDeleteSwap(day.id, pe.id, sw.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                    >
                      <X size={12} color="var(--muted)" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setExercisePicker({ type: 'add-swaps', programExercise: pe })}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: 'var(--ember)',
                    padding: '8px 0 0',
                    font: "700 11px/1 'Inter'",
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  + Add Swap Alternate
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => setExercisePicker({ type: 'add-exercise' })}
            style={{
              width: '100%',
              border: '1px dashed var(--lineS)',
              borderRadius: 14,
              background: 'transparent',
              color: 'var(--boneDim)',
              padding: '14px',
              font: "600 12px/1 'Inter'",
              cursor: 'pointer',
              marginBottom: 12,
            }}
          >
            + Add Exercise
          </button>
        </div>
      )}

      {exercisePicker?.type === 'add-exercise' && (
        <ExercisePickerSheet
          title="Add Exercise"
          mode="single"
          onSelect={(exercise) => {
            setExercisePicker(null)
            setPendingExercise({ exercise })
          }}
          onClose={() => setExercisePicker(null)}
        />
      )}

      {exercisePicker?.type === 'add-swaps' && (
        <ExercisePickerSheet
          title="Add Swap Alternates"
          mode="multi"
          excludeIds={[
            exercisePicker.programExercise.exercises.id,
            ...exercisePicker.programExercise.exercise_swaps.map((s) => s.exercises.id),
          ]}
          onConfirm={(chosen) => {
            onAddSwaps(day.id, exercisePicker.programExercise.id, chosen)
            setExercisePicker(null)
          }}
          onClose={() => setExercisePicker(null)}
        />
      )}

      {pendingExercise && day && (
        <NewExerciseDetailsForm
          exerciseName={pendingExercise.exercise.name}
          existingBlockLabels={[...new Set(day.program_exercises.map((pe) => pe.block_label).filter(Boolean))]}
          onCancel={() => setPendingExercise(null)}
          onConfirm={({ blockLabel, sets, reps }) => {
            onAddExercise(day.id, { exerciseId: pendingExercise.exercise.id, blockLabel, sets, reps })
            setPendingExercise(null)
          }}
        />
      )}
    </div>
  )
}
