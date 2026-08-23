import { useState } from 'react'
import { ArrowsClockwise, Barbell, CaretDown, CaretUp, CaretLeft, CaretRight, Plus } from '@phosphor-icons/react'
import SetLogRow from './SetLogRow'
import SwapPicker from './SwapPicker'
import BottomTimerSection from './BottomTimerSection'

export default function ExerciseFocusView({
  slot,
  position,
  total,
  groupPosition,
  partnerNames,
  previousSets,
  rest,
  onChangeSet,
  onToggleSet,
  onAddSet,
  onToggleSwap,
  onPickSwap,
  onPrev,
  onNext,
  onRestAdd30,
  onRestSubtract30,
  onRestSkip,
  isLast,
}) {
  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const exercise = slot.selected
  const swapped = slot.selected.id !== slot.planned.id

  return (
    <div style={{ padding: '10px 24px 24px' }}>
      {groupPosition && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--emberDim)',
            color: 'var(--ember)',
            borderRadius: 100,
            padding: '5px 12px',
            font: "700 10px/1 'Inter'",
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          Superset · {groupPosition} · with {partnerNames}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
        <div>
          <div style={{ font: "800 20px/1.1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.3px' }}>
            {exercise.name}
            {swapped && <span style={{ color: 'var(--ember)', fontWeight: 600, fontSize: 11 }}> (swapped)</span>}
          </div>
          <div style={{ font: "500 11px/1 'Inter'", color: 'var(--muted)', marginTop: 6 }}>
            {exercise.muscle_group} · Exercise {position} of {total}
          </div>
        </div>
        {slot.swapOptions.length > 0 && (
          <button
            onClick={onToggleSwap}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'var(--emberDim)',
              border: 'none',
              borderRadius: 100,
              padding: '6px 12px',
              color: 'var(--ember)',
              font: "700 10px/1 'Inter'",
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ArrowsClockwise size={12} weight="bold" /> Swap
          </button>
        )}
      </div>

      {slot.swapOpen && (
        <SwapPicker planned={slot.planned} options={slot.swapOptions} selectedId={slot.selected.id} onPick={onPickSwap} />
      )}

      <div
        style={{
          width: '100%',
          height: 200,
          borderRadius: 18,
          margin: '14px 0',
          background: exercise.media_url
            ? `center / cover no-repeat url(${exercise.media_url})`
            : 'linear-gradient(135deg, var(--surface2), var(--ink2))',
          display: exercise.media_url ? 'block' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!exercise.media_url && <Barbell size={40} color="var(--muted)" />}
      </div>

      <div style={{ font: "500 11px/1.4 'Inter'", color: 'var(--muted)', marginBottom: 10 }}>
        Coach programmed: {slot.plannedSets} × {slot.plannedReps}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '18px 1fr 1fr 44px 32px',
          gap: 8,
          font: "600 9px/1 'Inter'",
          color: 'var(--muted)',
          textTransform: 'uppercase',
          margin: '6px 0',
        }}
      >
        <span>#</span>
        <span>Reps</span>
        <span>Kg</span>
        <span>RPE</span>
        <span></span>
      </div>
      {slot.sets.map((set, setIndex) => (
        <SetLogRow
          key={setIndex}
          index={setIndex}
          set={set}
          previous={previousSets?.[setIndex]}
          onChange={(next) => onChangeSet(setIndex, next)}
          onToggle={() => onToggleSet(setIndex)}
        />
      ))}

      <button
        onClick={onAddSet}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          color: 'var(--ember)',
          font: "600 12px/1 'Inter'",
          padding: '12px 0 20px',
          cursor: 'pointer',
        }}
      >
        <Plus size={14} weight="bold" /> Add Set
      </button>

      {exercise.instructions && (
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setInstructionsOpen((o) => !o)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              color: 'var(--ember)',
              font: "600 10px/1 'Inter'",
              padding: 0,
              cursor: 'pointer',
            }}
          >
            {instructionsOpen ? 'Hide instructions' : 'Show instructions'}
            {instructionsOpen ? <CaretUp size={12} /> : <CaretDown size={12} />}
          </button>
          {instructionsOpen && (
            <div style={{ font: "400 12px/1.5 'Inter'", color: 'var(--boneDim)', marginTop: 10 }}>
              {exercise.instructions}
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <BottomTimerSection rest={rest} onAdd30={onRestAdd30} onSubtract30={onRestSubtract30} onSkip={onRestSkip} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onPrev}
          disabled={position === 1}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: '14px 0',
            color: position === 1 ? 'var(--muted)' : 'var(--bone)',
            font: "700 12px/1 'Inter'",
            cursor: position === 1 ? 'default' : 'pointer',
            opacity: position === 1 ? 0.5 : 1,
          }}
        >
          <CaretLeft size={14} weight="bold" /> Previous
        </button>
        <button
          onClick={onNext}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: isLast ? 'var(--emberGradient)' : 'var(--surface)',
            border: isLast ? 'none' : '1px solid var(--line)',
            borderRadius: 14,
            padding: '14px 0',
            color: isLast ? '#fff' : 'var(--bone)',
            font: "700 12px/1 'Inter'",
            cursor: 'pointer',
          }}
        >
          {isLast ? 'Finish Workout' : 'Next Exercise'} {!isLast && <CaretRight size={14} weight="bold" />}
        </button>
      </div>
    </div>
  )
}
