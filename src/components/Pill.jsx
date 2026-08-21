const tones = {
  ember: { bg: 'var(--emberDim)', fg: 'var(--ember)' },
  sage: { bg: 'var(--sageDim)', fg: 'var(--sage)' },
  violet: { bg: 'rgba(183,156,232,0.14)', fg: 'var(--violet)' },
  court: { bg: 'rgba(127,166,217,0.14)', fg: 'var(--court)' },
  amber: { bg: 'rgba(240,190,60,0.14)', fg: 'var(--amber)' },
  red: { bg: 'rgba(220,80,70,0.12)', fg: 'var(--red)' },
  muted: { bg: 'var(--surface2)', fg: 'var(--muted)' },
}

export default function Pill({ tone = 'muted', children, style }) {
  const t = tones[tone] || tones.muted
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: t.bg,
        color: t.fg,
        borderRadius: 100,
        padding: '5px 11px',
        font: "600 10px/1 'Inter'",
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  )
}
