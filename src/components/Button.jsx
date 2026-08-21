const variants = {
  primary: {
    background: 'linear-gradient(135deg,#C85E22,#F2853D)',
    color: '#fff',
    border: 'none',
  },
  ghost: {
    background: 'var(--emberDim)',
    color: 'var(--ember)',
    border: 'none',
  },
  outline: {
    background: 'transparent',
    color: 'var(--ember)',
    border: '1px solid var(--ember)',
  },
  surface: {
    background: 'var(--surface)',
    color: 'var(--bone)',
    border: '1px solid var(--line)',
  },
}

export default function Button({
  variant = 'primary',
  full = false,
  children,
  style,
  ...props
}) {
  const v = variants[variant] || variants.primary
  return (
    <button
      {...props}
      style={{
        ...v,
        width: full ? '100%' : undefined,
        borderRadius: 14,
        padding: '14px 20px',
        font: "700 13px/1 'Inter'",
        letterSpacing: '0.01em',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...style,
      }}
    >
      {children}
    </button>
  )
}
