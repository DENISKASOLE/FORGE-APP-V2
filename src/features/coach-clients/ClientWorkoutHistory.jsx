import { useEffect, useState } from 'react'
import { Trash, PencilSimple, Check, X } from '@phosphor-icons/react'
import {
  getClientWorkoutLogs,
  updateSetLog,
  deleteSetLog,
  deleteWorkoutLog,
  computeRecentActivity,
} from '../../data/workoutLogs'
import ActivityBars from '../coach-home/ActivityBars'

const editInputStyle = {
  width: 50,
  background: 'var(--surface2)',
  border: '1px solid var(--line)',
  borderRadius: 8,
  padding: '4px 6px',
  color: 'var(--bone)',
  font: "600 11px/1 'Inter'",
}

function groupByExercise(setLogs) {
  const map = new Map()
  setLogs.forEach((s) => {
    const name = s.exercises?.name || 'Exercise'
    if (!map.has(name)) map.set(name, [])
    map.get(name).push(s)
  })
  return [...map.entries()]
}

export default function ClientWorkoutHistory({ clientId }) {
  const [logs, setLogs] = useState(null)
  const [editingSetId, setEditingSetId] = useState(null)
  const [editValues, setEditValues] = useState({ weight: '', reps: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    getClientWorkoutLogs(clientId).then(setLogs)
  }, [clientId])

  if (logs === null) return null

  const { labels, states } = computeRecentActivity(logs, 7)

  function startEdit(set) {
    setEditingSetId(set.id)
    setEditValues({ weight: set.weight ?? '', reps: set.reps ?? '' })
  }

  async function saveEdit(setId) {
    setError('')
    try {
      const updated = await updateSetLog(setId, {
        weight: Number(editValues.weight) || 0,
        reps: Number(editValues.reps) || 0,
      })
      setLogs((prev) =>
        prev.map((log) => ({
          ...log,
          set_logs: log.set_logs.map((s) => (s.id === setId ? updated : s)),
        })),
      )
      setEditingSetId(null)
    } catch (err) {
      setError(err.message || 'Could not save that set.')
    }
  }

  async function removeSet(logId, setId) {
    setError('')
    try {
      await deleteSetLog(setId)
      setLogs((prev) =>
        prev.map((log) => (log.id === logId ? { ...log, set_logs: log.set_logs.filter((s) => s.id !== setId) } : log)),
      )
    } catch (err) {
      setError(err.message || 'Could not remove that set.')
    }
  }

  async function removeSession(logId) {
    setError('')
    try {
      await deleteWorkoutLog(logId)
      setLogs((prev) => prev.filter((log) => log.id !== logId))
    } catch (err) {
      setError(err.message || 'Could not remove that session.')
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div className="label" style={{ marginBottom: 10 }}>Last 7 Days</div>
      <ActivityBars activity={states} labels={labels} />

      {error && (
        <div style={{ color: 'var(--red)', font: "600 12px/1.4 'Inter'", marginTop: 12 }}>{error}</div>
      )}

      <div className="label" style={{ margin: '20px 0 10px' }}>Logged Sessions</div>
      {logs.length === 0 && (
        <div style={{ font: "500 12px/1.5 'Inter'", color: 'var(--muted)' }}>No sessions logged yet.</div>
      )}
      {logs.map((log) => (
        <div
          key={log.id}
          style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, padding: 14, marginBottom: 10 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ font: "600 12px/1 'Inter'", color: 'var(--bone)' }}>
                {log.program_days?.day_label || 'Workout'}
              </div>
              <div style={{ font: "400 10px/1 'Inter'", color: 'var(--muted)', marginTop: 4 }}>
                {new Date(log.performed_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
            <button onClick={() => removeSession(log.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Trash size={14} color="var(--red)" />
            </button>
          </div>

          {groupByExercise(log.set_logs).map(([name, sets]) => (
            <div key={name} style={{ marginBottom: 8 }}>
              <div style={{ font: "500 11px/1 'Inter'", color: 'var(--boneDim)', marginBottom: 4 }}>{name}</div>
              {sets.map((s) =>
                editingSetId === s.id ? (
                  <div key={s.id} style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '4px 0' }}>
                    <input
                      type="number"
                      value={editValues.reps}
                      onChange={(e) => setEditValues((v) => ({ ...v, reps: e.target.value }))}
                      style={editInputStyle}
                    />
                    <span style={{ color: 'var(--muted)', fontSize: 10 }}>reps</span>
                    <input
                      type="number"
                      value={editValues.weight}
                      onChange={(e) => setEditValues((v) => ({ ...v, weight: e.target.value }))}
                      style={editInputStyle}
                    />
                    <span style={{ color: 'var(--muted)', fontSize: 10 }}>kg</span>
                    <button onClick={() => saveEdit(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Check size={13} color="var(--sage)" />
                    </button>
                    <button onClick={() => setEditingSetId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <X size={13} color="var(--muted)" />
                    </button>
                  </div>
                ) : (
                  <div
                    key={s.id}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}
                  >
                    <span style={{ font: "600 11px/1 'Inter'", color: 'var(--bone)' }}>
                      Set {s.set_number}: {s.reps} × {s.weight}kg
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => startEdit(s)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <PencilSimple size={13} color="var(--muted)" />
                      </button>
                      <button onClick={() => removeSet(log.id, s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={13} color="var(--red)" />
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
