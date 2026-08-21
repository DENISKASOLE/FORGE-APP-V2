export default function WeightChart({ history }) {
  const w = 400
  const h = 140
  const pad = 12
  const min = Math.min(...history)
  const max = Math.max(...history)
  const range = max - min || 1

  const points = history.map((v, i) => {
    const x = pad + (i / (history.length - 1)) * (w - pad * 2)
    const y = pad + (1 - (v - min) / range) * (h - pad * 2)
    return [x, y]
  })

  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
  const last = points[points.length - 1]

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: h }}>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={0} x2={w} y1={h * f} y2={h * f} stroke="rgba(244,237,225,0.06)" strokeWidth={1} />
      ))}
      <path d={path} fill="none" stroke="var(--ember)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={4.5} fill="var(--ember)" />
    </svg>
  )
}
