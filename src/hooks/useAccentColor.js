import { useEffect, useState } from 'react'

const KEY = 'forge.accentColor'

export const accentSwatches = {
  ember: { base: '#F2853D', deep: '#C85E22' },
  sage: { base: '#66C79B', deep: '#3C9873' },
  violet: { base: '#B79CE8', deep: '#8F6AD1' },
  court: { base: '#7FA6D9', deep: '#4C79B8' },
}

function hexToRgbTriplet(hex) {
  const n = parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

// Applies an accent swatch app-wide (buttons, avatars, glows -- every
// token derived from --ember) by writing the *Override custom properties
// that tokens.css falls back to. See the comment at the top of tokens.css
// for why these have to be separate override properties rather than
// setting --ember/--emberDeep/etc directly.
export function applyAccent(key) {
  const swatch = accentSwatches[key] || accentSwatches.ember
  const rgb = hexToRgbTriplet(swatch.base)
  const root = document.documentElement.style
  root.setProperty('--emberOverride', swatch.base)
  root.setProperty('--emberDeepOverride', swatch.deep)
  root.setProperty('--emberDimOverride', `rgba(${rgb}, 0.14)`)
  root.setProperty('--emberGlowOverride', `rgba(${rgb}, 0.45)`)
  root.setProperty('--emberGlowSoftOverride', `rgba(${rgb}, 0.16)`)
}

// Local-device accent preference (used before a coach's own choice is
// known, and as the coach's own fallback). A client's app instead follows
// their coach's saved accent_color -- see the sync effect in App.jsx.
export function useAccentColor() {
  const [accent, setAccent] = useState(() => localStorage.getItem(KEY) || 'ember')

  useEffect(() => {
    applyAccent(accent)
    localStorage.setItem(KEY, accent)
  }, [accent])

  return [accent, setAccent]
}
