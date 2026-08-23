import Card from '../../components/Card'
import Button from '../../components/Button'
import Pill from '../../components/Pill'

// Slots are already in block order (see buildSlots in WorkoutSession), so
// consecutive slots sharing a groupIndices array belong to one block --
// walk once and jump past each group's siblings to reconstruct the blocks.
function buildDisplayBlocks(slots) {
  const blocks = []
  let i = 0
  while (i < slots.length) {
    const slot = slots[i]
    const group = slot.groupIndices || [i]
    blocks.push({ label: slot.blockLabel || 'Block', indices: group })
    i = group[group.length - 1] + 1
  }
  return blocks
}

export default function WorkoutOverview({ slots, onSelectExercise, onStart }) {
  const blocks = buildDisplayBlocks(slots)
  const totalSets = slots.reduce((n, s) => n + s.sets.length, 0)
  const doneSets = slots.reduce((n, s) => n + s.sets.filter((set) => set.done).length, 0)

  return (
    <div style={{ padding: '10px 24px 24px' }}>
      {blocks.map((block, bi) => (
        <Card key={bi} style={{ marginBottom: 12 }}>
          <div className="label" style={{ marginBottom: 10 }}>
            {block.label}
            {block.indices.length > 1 && <span style={{ color: 'var(--ember)' }}> · Superset</span>}
          </div>
          {block.indices.map((slotIndex, i) => {
            const slot = slots[slotIndex]
            const done = slot.sets.filter((s) => s.done).length
            const total = slot.sets.length
            return (
              <button
                key={slot.programExerciseId}
                onClick={() => onSelectExercise(slotIndex)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  background: 'none',
                  border: 'none',
                  borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ font: "600 13px/1 'Inter'", color: 'var(--bone)' }}>{slot.selected.name}</div>
                  <div style={{ font: "500 10px/1 'Inter'", color: 'var(--muted)', marginTop: 4 }}>
                    {slot.plannedSets} × {slot.plannedReps}
                  </div>
                </div>
                <Pill tone={done === total ? 'sage' : done > 0 ? 'ember' : 'muted'}>
                  {done}/{total}
                </Pill>
              </button>
            )
          })}
        </Card>
      ))}
      <Button full onClick={onStart}>
        {doneSets === 0 ? 'Start Logging' : doneSets === totalSets ? 'Review Sets' : 'Continue Logging'}
      </Button>
    </div>
  )
}
