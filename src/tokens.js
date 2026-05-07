import { useState, useEffect, useRef } from 'react'

export const CT_PALETTES = {
  cream: {
    bg: '#FAEEDA', bgSoft: '#F5E2C5', bgCard: '#FFF8EC',
    ink: '#2A1F12', inkSoft: '#6B5640', inkMuted: '#9C8870', line: '#E8D4B0',
  },
  sage: {
    bg: '#E8EFE5', bgSoft: '#D8E3D2', bgCard: '#F4F8F1',
    ink: '#1F2A1A', inkSoft: '#506049', inkMuted: '#8C9A85', line: '#C8D4C0',
  },
  rose: {
    bg: '#F8E5DC', bgSoft: '#F0D2C5', bgCard: '#FFF1EA',
    ink: '#2A1814', inkSoft: '#6B4A40', inkMuted: '#9C7A6E', line: '#E8C8B8',
  },
  midnight: {
    bg: '#1C1812', bgSoft: '#26211A', bgCard: '#2E2820',
    ink: '#FAEEDA', inkSoft: '#C8B89E', inkMuted: '#8C7E68', line: '#3D352A',
  },
}

export const CT_SEMANTIC = {
  win: '#22A06B', winSoft: '#C5E8D5',
  danger: '#E54B3C', dangerSoft: '#FBD3CD',
  dream: '#7C4DFF', dreamSoft: '#DCD0FF',
  amber: '#C9854A', amberSoft: '#F2D4B0',
}

export const CT_TYPE = {
  serif: '"Instrument Serif", "Times New Roman", Georgia, serif',
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, monospace',
}

export function peso(n, opts = {}) {
  const sign = n < 0 ? '-' : ''
  const v = Math.abs(Math.round(n))
  const s = v.toLocaleString('en-PH')
  return `${sign}₱${s}${opts.suffix || ''}`
}

export function useCountTo(target, duration = 600) {
  const [v, setV] = useState(target)
  const fromRef = useRef(target)
  const startRef = useRef(performance.now())
  useEffect(() => {
    fromRef.current = v
    startRef.current = performance.now()
    let raf
    const tick = () => {
      const t = Math.min(1, (performance.now() - startRef.current) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const cur = fromRef.current + (target - fromRef.current) * eased
      setV(cur)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])
  return v
}
