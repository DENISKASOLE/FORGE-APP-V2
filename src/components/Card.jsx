export default function Card({ children, style, tint, ...props }) {
  return (
    <div
      {...props}
      style={{
        background: tint || 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 18,
        padding: 18,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
