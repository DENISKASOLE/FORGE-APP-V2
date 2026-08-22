import { useState } from 'react'
import { CaretDown, CaretUp } from '@phosphor-icons/react'
import Pill from '../../components/Pill'

export default function ExerciseCard({ exercise }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 12,
          flexShrink: 0,
          background: exercise.media_url
            ? `center / cover no-repeat url(${exercise.media_url})`
            : 'linear-gradient(135deg, var(--surface2), var(--ink2))',
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ font: "600 13px/1.3 'Inter'", color: 'var(--bone)' }}>{exercise.name}</div>
          {exercise.is_custom && <Pill tone="violet">Custom</Pill>}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
          <Pill tone="sage">{exercise.muscle_group}</Pill>
          {exercise.equipment && <Pill tone="muted">{exercise.equipment}</Pill>}
        </div>
        {exercise.instructions && (
          <>
            <button
              onClick={() => setExpanded((e) => !e)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'none',
                border: 'none',
                color: 'var(--ember)',
                font: "600 10px/1 'Inter'",
                padding: '10px 0 0',
                cursor: 'pointer',
              }}
            >
              {expanded ? 'Hide instructions' : 'Show instructions'}
              {expanded ? <CaretUp size={12} /> : <CaretDown size={12} />}
            </button>
            {expanded && (
              <div style={{ font: "400 11px/1.5 'Inter'", color: 'var(--boneDim)', marginTop: 8 }}>
                {exercise.instructions}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
