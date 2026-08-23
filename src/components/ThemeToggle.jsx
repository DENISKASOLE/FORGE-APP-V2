import { useTheme } from '../hooks/useTheme'

const options = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

export default function ThemeToggle() {
  const [theme, setTheme] = useTheme()
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => setTheme(o.value)}
          style={{
            flex: 1,
            background: theme === o.value ? 'var(--ember)' : 'var(--surface2)',
            color: theme === o.value ? '#fff' : 'var(--boneDim)',
            border: '1px solid ' + (theme === o.value ? 'var(--ember)' : 'var(--line)'),
            borderRadius: 100,
            padding: '8px 0',
            font: "600 11px/1 'Inter'",
            cursor: 'pointer',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
