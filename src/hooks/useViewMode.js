import { useEffect, useState } from 'react'

const KEY = 'forge.viewMode'

export function useViewMode() {
  const [mode, setMode] = useState(() => localStorage.getItem(KEY) || 'client')

  useEffect(() => {
    localStorage.setItem(KEY, mode)
  }, [mode])

  return [mode, setMode]
}
