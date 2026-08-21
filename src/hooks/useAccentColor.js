import { useEffect, useState } from 'react'

const KEY = 'forge.accentColor'

export const accentSwatches = {
  ember: '#F2853D',
  sage: '#66C79B',
  violet: '#B79CE8',
  court: '#7FA6D9',
}

export function useAccentColor() {
  const [accent, setAccent] = useState(() => localStorage.getItem(KEY) || 'ember')

  useEffect(() => {
    document.documentElement.style.setProperty('--ember', accentSwatches[accent])
    localStorage.setItem(KEY, accent)
  }, [accent])

  return [accent, setAccent]
}
