import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import { getTrainingProgram } from '../../data/clientData'
import Button from '../../components/Button'
import Pill from '../../components/Pill'
import SetRow from './SetRow'
import RestTimerOverlay from './RestTimerOverlay'

const REST_SECONDS = 90

function flatten(day) {
  const list = []
  day.blocks.forEach((block) => {
    block.exercises.forEach((ex) => {
      list.push({ ...ex, blockLabel: block.label, sets: ex.sets.map((s) => ({ ...s })) })
    })
  })
  return list
}

export default function ActiveSession() {
  const { dayId } = useParams()
  const navigate = useNavigate()
  const [day, setDay] = useState(null)
  const [exercises, setExercises] = useState([])
  const [elapsed, setElapsed] = useState(0)
  const [rest, setRest] = useState(null)
  const restInterval = useRef(null)

  useEffect(() => {
    getTrainingProgram().then((program) => {
      const found = program.days.find((d) => d.id === dayId) || program.days[0]
      setDay(found)
      setExercises(flatten(found))
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

  const totalSets = useMemo(() => exercises.reduce((n, ex) => n + ex.sets.length, 0), [exercises])
  const doneSets = useMemo(
    () => exercises.reduce((n, ex) => n + ex.sets.filter((s) => s.done).length, 0),
    [exercises],
  )

  function updateSet(exIndex, setIndex, next) {
    setExercises((prev) => {
      const copy = [...prev]
      const ex = { ...copy[exIndex] }
      ex.sets = ex.sets.map((s, i) => (i === setIndex ? next : s))
      copy[exIndex] = ex
      return copy
    })
  }

  function toggleSet(exIndex, setIndex) {
    const ex = exercises[exIndex]
    const set = ex.sets[setIndex]
    const wasDone = set.done
    updateSet(exIndex, setIndex, { ...set, done: !wasDone })

    if (!wasDone) {
      const nextName = findNextExercise(exercises, exIndex, setIndex)
      setRest({ remaining: REST_SECONDS, total: REST_SECONDS, startedAt: Date.now(), next: nextName })
    }
  }

  function findNextExercise(list, exIndex, setIndex) {
    const ex = list[exIndex]
    if (setIndex < ex.sets.length - 1) return ex.name
    const nextEx = list[exIndex + 1]
    return nextEx ? nextEx.name : null
  }

  function finish() {
    const totalVolume = exercises.reduce(
      (sum, ex) => sum + ex.sets.filter((s) => s.done).reduce((n, s) => n + s.reps * s.weight, 0),
      0,
    )
    const prCount = exercises.filter((ex) => ex.sets.some((s) => s.done && s.weight >= (ex.sets[0]?.weight || 0))).length
    navigate('/train/summary', {
      state: {
        name: day?.name,
        duration: elapsed,
        totalVolume: Math.round(totalVolume),
        setsCompleted: doneSets,
        totalSets,
        prCount,
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
        <div style={{ font: "700 15px/1 'Inter'", color: 'var(--bone)' }}>{day.name}</div>
        <Button onClick={finish} style={{ padding: '8px 14px' }}>
          Finish
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
        {exercises.map((ex, exIndex) => (
          <div
            key={ex.id}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 18,
              padding: 16,
              marginBottom: 14,
            }}
          >
            <div style={{ font: "700 18px/1 'Inter'", color: 'var(--bone)', letterSpacing: '-0.3px' }}>
              {ex.name}
            </div>
            <div style={{ font: "500 11px/1 'Inter'", color: 'var(--muted)', marginTop: 4, marginBottom: 12 }}>
              {ex.group}
            </div>
            {ex.tip && (
              <Pill tone="amber" style={{ marginBottom: 12 }}>
                {ex.tip}
              </Pill>
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '20px 1fr 1fr 32px',
                gap: 10,
                font: "600 9px/1 'Inter'",
                color: 'var(--muted)',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              <span>#</span>
              <span>Reps</span>
              <span>Kg</span>
              <span></span>
            </div>
            {ex.sets.map((set, setIndex) => (
              <SetRow
                key={setIndex}
                index={setIndex}
                set={set}
                onChange={(next) => updateSet(exIndex, setIndex, next)}
                onToggle={() => toggleSet(exIndex, setIndex)}
              />
            ))}
          </div>
        ))}
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
