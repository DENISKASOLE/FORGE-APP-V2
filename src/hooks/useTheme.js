import { useEffect, useState } from 'react'

const KEY = 'forge.theme'

function resolveTheme(pref) {
  if (pref === 'system') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  return pref
}

// Sets data-theme on <html>, which the [data-theme='light'] [data-app=...]
// blocks in tokens.css key off of. A personal, per-device preference for
// both the client and coach apps -- unlike accent color, nobody else's
// theme choice should override this.
export function applyTheme(pref) {
  document.documentElement.setAttribute('data-theme', resolveTheme(pref))
}

export function useTheme() {
  const [pref, setPref] = useState(() => localStorage.getItem(KEY) || 'system')

  useEffect(() => {
    applyTheme(pref)
    localStorage.setItem(KEY, pref)

    if (pref !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => applyTheme('system')
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [pref])

  return [pref, setPref]
}
