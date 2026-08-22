import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowsClockwise } from '@phosphor-icons/react'
import { useAuth } from '../../hooks/useAuth'
import { getProgramDayForSession } from '../../data/programs'
import { createWorkoutLog, createSetLogs } from '../../data/workoutLogs'
import Button from '../../components/Button'
import SetRow from './SetRow'
import SwapPicker from './SwapPicker'
import RestTimerOverlay from './RestTimerOverlay'

const REST_SECONDS = 90

function buildSlots(day) {
  return day.program_exercises.map((pe) => {
    const planned = pe.exercises
    const swapOptions = (pe.exercise_swaps || []).map((s) => s.exercises)
    return {
      programExerciseId: pe.id,
      blockLabel: pe.block_label,
      planned,
      swapOptions,
      selected: planned,
      swapOpen: false,
      sets: Array.from({ length: pe.sets }, () => ({ reps: pe.reps, weight: '', done: false })),
    }
  })
}

export default function ActiveSession() {
  const { dayId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [day, setDay] = useState(null)
  const [slots, setSlots] = useState([])
  const [elapsed, setElapsed] = useState(0)
  const [rest, setRest] = useState(null)
  const [saving, setSaving] = useState(false)
  const restInterval = useRef(null)

  useEffect(() => {
    getProgramDayForSession(dayId).then((found) => {
      if (!found) return
      setDay(found)
      setSlots(buildSlots(found))
    })
  }, [dayId])

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!rest) return
    // Keyed on startedAt (not `rest`) so the interval isn't torn down every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    restInterval.current = setInterval(() => {
      setRest((r) => {
        if (!r) return r
        if (r.remaining <= 1) {
          clearInterval(restInterval.current)
          return null
        }
        return { ...r, remaining: r.remaining - 1 }
      })
    }, 1000)
    return () => clearInterval(restInterval.current)
  }, [rest?.startedAt])

  const totalSets = useMemo(() => slots.reduce((n, s) => n + s.sets.length, 0), [slots])
  const doneSets = useMemo(
    () => slots.reduce((n, s) => n + s.sets.filter((set) => set.done).length, 0),
    [slots],
  )

  function updateSet(slotIndex, setIndex, next) {
    setSlots((prev) => {
      const copy = [...prev]
      const slot = { ...copy[slotIndex] }
      slot.sets = slot.sets.map((s, i) => (i === setIndex ? next : s))
      copy[slotIndex] = slot
      return copy
    })
  }

  function toggleSet(slotIndex, setIndex) {
    const slot = slots[slotIndex]
    const set = slot.sets[setIndex]
    const wasDone = set.done
    updateSet(slotIndex, setIndex, { ...set, done: !wasDone })

    if (!wasDone) {
      const nextName = findNextExercise(slots, slotIndex, setIndex)
      setRest({ remaining: REST_SECONDS, total: REST_SECONDS, startedAt: Date.now(), next: nextName })
    }
  }

  function findNextExercise(list, slotIndex, setIndex) {
    const slot = list[slotIndex]
    if (setIndex < slot.sets.length - 1) return slot.selected.name
    const nextSlot = list[slotIndex + 1]
    return nextSlot ? nextSlot.selected.name : null
  }

  function toggleSwapPanel(slotIndex) {
    setSlots((prev) => prev.map((s, i) => (i === slotIndex ? { ...s, swapOpen: !s.swapOpen } : s)))
  }

  function pickSwap(slotIndex, exercise) {
    setSlots((prev) => prev.map((s, i) => (i === slotIndex ? { ...s, selected: exercise, swapOpen: false } : s)))
  }

  async function finish() {
    const totalVolume = slots.reduce(
      (sum, s) => sum + s.sets.filter((set) => set.done).reduce((n, set) => n + (Number(set.reps) || 0) * (Number(set.weight) || 0), 0),
      0,
    )
    const prCount = slots.filter((s) =>
      s.sets.some((set) => set.done && Number(set.weight) >= (Number(s.sets[0]?.weight) || 0) && Number(set.weight) > 0),
    ).length

    let synced = false
    if (user?.id) {
      setSaving(true)
      try {
        const log = await createWorkoutLog({ clientId: user.id, programDayId: day.id })
        const setRows = []
        slots.forEach((slot) => {
          let setNumber = 0
          slot.sets.forEach((set) => {
            if (!set.done) return
            setNumber += 1
            setRows.push({
              exerciseId: slot.selected.id,
              setNumber,
              weight: Number(set.weight) || 0,
              reps: Number(set.reps) || 0,
            })
          })
        })
        await createSetLogs(log.id, setRows)
        synced = true
      } catch {
        synced = false
      } finally {
        setSaving(false)
      }
    }

    navigate('/train/summary', {
      state: {
        name: day?.day_label,
        duration: elapsed,
        totalVolume: Math.round(totalVolume),
        setsCompleted: doneSets,
        totalSets,
        prCount,
        synced,
      },
    })
  }

  if (!day) return null

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')
  const hh = String(Math.floor(elapsed / 3600)).padStart(2, '0')

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px 14px',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        >
          <ArrowLeft size={20} color="var(--bone)" />
        </button>
        <div style={{ font: "700 15px/1 'Inter'", color: 'var(--bone)' }}>{day.day_label}</div>
        <Button onClick={finish} disabled={saving} style={{ padding: '8px 14px', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving…' : 'Finish'}
        </Button>
      </div>

      <div style={{ padding: '0 24px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ font: "700 13px/1 'Inter'", color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>
          {hh}:{mm}:{ss}
        </div>
        <div style={{ flex: 1, height: 3, background: 'var(--surface2)', borderRadius: 2, overflow: 'hidden' }}>
          <div
            style={{
              width: `${totalSets ? (doneSets / totalSets) * 100 : 0}%`,
              height: '100%',
              background: 'var(--ember)',
              transition: 'width 0.3s',
            }}
          />
        </div>
        <div style={{ font: "600 11px/1 'Inter'", color: 'var(--muted)' }}>
          {doneSets}/{totalSets}
        </div>
      </div>

      <div style={{ padding: '10px 24px 24px' }}>
        {slots.map((slot, slotIndex) => {
          const swapped = slot.selected.id !== slot.planned.id
          return (
            <div
              key={slot.programExerciseId}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 18,
                padding: 16,
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ font: "700 18px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.3px' }}>
                    {slot.selected.name}
                    {swapped && <span style={{ color: 'var(--ember)', fontWeight: 600, fontSize: 11 }}> (swapped)</span>}
                  </div>
                  <div style={{ font: "500 11px/1 'Inter'", color: 'var(--muted)', marginTop: 4 }}>
                    {slot.selected.muscle_group}
                  </div>
                </div>
                {slot.swapOptions.length > 0 && (
                  <button
                    onClick={() => toggleSwapPanel(slotIndex)}
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
                <SwapPicker
                  planned={slot.planned}
                  options={slot.swapOptions}
                  selectedId={slot.selected.id}
                  onPick={(ex) => pickSwap(slotIndex, ex)}
                />
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '20px 1fr 1fr 32px',
                  gap: 10,
                  font: "600 9px/1 'Inter'",
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  margin: '12px 0 6px',
                }}
              >
                <span>#</span>
                <span>Reps</span>
                <span>Kg</span>
                <span></span>
              </div>
              {slot.sets.map((set, setIndex) => (
                <SetRow
                  key={setIndex}
                  index={setIndex}
                  set={set}
                  onChange={(next) => updateSet(slotIndex, setIndex, next)}
                  onToggle={() => toggleSet(slotIndex, setIndex)}
                />
              ))}
            </div>
          )
        })}
      </div>

      {rest && (
        <RestTimerOverlay
          seconds={rest.remaining}
          total={rest.total}
          nextExercise={rest.next}
          onSkip={() => setRest(null)}
          onAdd={() => setRest((r) => ({ ...r, remaining: r.remaining + 30, total: r.total + 30 }))}
        />
      )}
    </div>
  )
}
