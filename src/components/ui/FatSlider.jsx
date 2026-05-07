import { useRef, useState } from 'react'
import { CT_SEMANTIC } from '../../tokens.js'

export default function FatSlider({ value, onChange, state, p, max = 0.6 }) {
  const trackRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const valueAt = (clientX) => {
    if (!trackRef.current) return value
    const r = trackRef.current.getBoundingClientRect()
    const t = (clientX - r.left) / r.width
    return Math.max(0, Math.min(max, t * max))
  }

  const onPointerDown = (e) => {
    setDragging(true)
    onChange(valueAt(e.clientX))
    const move = (ev) => onChange(valueAt(ev.clientX))
    const up = () => {
      setDragging(false)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const pct = (value / max) * 100
  const fillColor =
    state === 'rich'     ? CT_SEMANTIC.win :
    state === 'thriving' ? CT_SEMANTIC.win :
    state === 'okay'     ? CT_SEMANTIC.amber :
    state === 'stressed' ? CT_SEMANTIC.danger :
    /* shocked */          CT_SEMANTIC.danger

  return (
    <div ref={trackRef} onPointerDown={onPointerDown}
      style={{
        position: 'relative', height: 44, cursor: dragging ? 'grabbing' : 'grab',
        touchAction: 'none', userSelect: 'none',
      }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)',
        height: 14, borderRadius: 999, background: p.line,
      }} />
      <div style={{
        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
        height: 14, width: `${pct}%`, borderRadius: 999, background: fillColor,
        transition: dragging ? 'none' : 'background .25s',
      }} />
      <div style={{
        position: 'absolute', left: `${pct}%`, top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 32, height: 32, borderRadius: '50%', background: '#fff',
        border: `3px solid ${fillColor}`,
        transition: dragging ? 'none' : 'border-color .25s',
      }} />
    </div>
  )
}
