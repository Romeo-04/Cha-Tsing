import { useState } from 'react'
import { CT_SEMANTIC } from '../../tokens.js'

export default function FatSlider({ value, onChange, state, p, max = 1, onGaze }) {
  const [dragging, setDragging] = useState(false)

  const trackColor =
    state === 'rich'     ? CT_SEMANTIC.win :
    state === 'thriving' ? '#4ADE80' :
    state === 'okay'     ? CT_SEMANTIC.amber :
    /* stressed/shocked */  CT_SEMANTIC.danger

  const handleChange = (e) => {
    const v = Number(e.target.value)
    onChange(v)
    if (dragging && onGaze) {
      // map value to -1..1 gaze x; look slightly upward while dragging
      const gazeX = (v / max) * 2 - 1
      onGaze({ x: gazeX, y: -0.3 })
    }
  }

  const handlePointerDown = (e) => {
    setDragging(true)
    if (onGaze) {
      const gazeX = (value / max) * 2 - 1
      onGaze({ x: gazeX, y: -0.3 })
    }
  }

  const handlePointerUp = () => {
    setDragging(false)
    onGaze?.({ x: 0, y: 0 })
  }

  return (
    <div
      style={{ position: 'relative', height: 44, display: 'flex', alignItems: 'center' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Visual track */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 12, borderRadius: 6,
        background: p.line, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          height: '100%', width: `${(value / max) * 100}%`,
          background: trackColor, borderRadius: 6,
          transition: 'width .1s ease, background .3s',
        }} />
      </div>
      {/* Native range input — invisible, handles all interaction */}
      <input
        type="range" min={0} max={max} step={0.01} value={value}
        onChange={handleChange}
        style={{
          position: 'absolute', left: 0, right: 0, width: '100%',
          opacity: 0, height: 44, cursor: 'pointer', margin: 0,
          touchAction: 'none',
        }}
      />
    </div>
  )
}
