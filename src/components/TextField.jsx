export default function TextField({ label, style, inputStyle, ...props }) {
  return (
    <label style={{ display: 'block', ...style }}>
      {label && <div className="label" style={{ marginBottom: 8 }}>{label}</div>}
      <input
        {...props}
        style={{
          width: '100%',
          background: 'var(--surface2)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          padding: '14px 16px',
          color: 'var(--bone)',
          font: "600 15px/1 'Inter'",
          outline: 'none',
          ...inputStyle,
        }}
      />
    </label>
  )
}
