export default function StepStepper({ step, total = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '20px 0' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === step ? 22 : 7,
            height: 7,
            borderRadius: 4,
            background: i <= step ? 'var(--ember)' : 'var(--surface2)',
            transition: 'all 0.2s',
          }}
        />
      ))}
    </div>
  )
}
