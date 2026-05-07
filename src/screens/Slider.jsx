// Slider.jsx — THE HERO INTERACTION
// Drag the savings slider, watch Chico's face morph in real time.

import { useState, useEffect, useRef } from 'react'
import { CT_TYPE, CT_SEMANTIC, useCountTo, peso } from '../tokens.js'
import CTHeader from '../components/ui/CTHeader.jsx'
import CTButton from '../components/ui/CTButton.jsx'
import FatSlider from '../components/ui/FatSlider.jsx'
import SpeechBubble from '../components/ui/SpeechBubble.jsx'
import Chico, { chicoStateFromSavings, chicoLine, CHICO_LINES } from '../components/Chico.jsx'
import { BubbleStage, AllocationStack, DroppableChico } from '../components/Bubbles.jsx'

export default function SavingsSliderScreen({
  palette, income, savingsPct, onSavingsChange,
  forcedState = null, variant = 'classic', onNext, onBack,
  allocations = [], onAddAllocation, onRemoveAllocation,
  className,
}) {
  const p = palette
  const takeHome = Math.round(income * 0.84)

  const allocTotal = allocations.reduce((s, a) => s + a.amount, 0)
  const remaining = Math.max(0, takeHome - allocTotal)
  const savingsAmount = Math.round(remaining * savingsPct)
  const spendingAmount = remaining - savingsAmount

  const truePct = takeHome > 0 ? savingsAmount / takeHome : 0
  const state = forcedState || chicoStateFromSavings(truePct)

  const animSavings = useCountTo(savingsAmount, 350)
  const animSpending = useCountTo(spendingAmount, 350)

  const [seed, setSeed] = useState(0)
  const lastStateRef = useRef(state)
  useEffect(() => {
    if (lastStateRef.current !== state) {
      setSeed(s => s + 1)
      lastStateRef.current = state
    }
  }, [state])

  const line = chicoLine(state, seed)

  return (
    <div className={className} style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <CTHeader palette={p} title="How much will you save?" onBack={onBack} />

      <BubbleStage palette={p} allocations={allocations}
        onAdd={onAddAllocation} onRemove={onRemoveAllocation}
        onEditAllocation={onAddAllocation}>
        {variant === 'classic' && (
          <ClassicLayout p={p} state={state} line={line}
            animSavings={animSavings} animSpending={animSpending}
            savingsPct={savingsPct} onSavingsChange={onSavingsChange}
            takeHome={takeHome} onNext={onNext}
            allocations={allocations} onRemoveAllocation={onRemoveAllocation} />
        )}
        {variant === 'split' && (
          <SplitLayout p={p} state={state} line={line}
            animSavings={animSavings} animSpending={animSpending}
            savingsPct={savingsPct} onSavingsChange={onSavingsChange}
            takeHome={takeHome} onNext={onNext}
            allocations={allocations} onRemoveAllocation={onRemoveAllocation} />
        )}
        {variant === 'dial' && (
          <DialLayout p={p} state={state} line={line}
            animSavings={animSavings} animSpending={animSpending}
            savingsPct={savingsPct} onSavingsChange={onSavingsChange}
            takeHome={takeHome} onNext={onNext}
            allocations={allocations} onRemoveAllocation={onRemoveAllocation} />
        )}
      </BubbleStage>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Variant A: Classic — Chico hero, big slider
// ─────────────────────────────────────────────────────────────
function ClassicLayout({ p, state, line, animSavings, animSpending, savingsPct, onSavingsChange, takeHome, onNext, allocations, onRemoveAllocation }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 80px 0 24px' }}>
      {/* Chico stage — droppable target for bubbles */}
      <div style={{
        position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        height: 200, marginTop: 4,
      }}>
        <DroppableChico state={state} size={180} palette={p} />
      </div>

      {/* Speech bubble */}
      <SpeechBubble p={p} text={line} state={state} />

      {/* Big number */}
      <div style={{ textAlign: 'center', marginTop: 14 }}>
        <div style={{
          fontFamily: CT_TYPE.serif, fontSize: 56, lineHeight: 1, color: p.ink,
          fontVariantNumeric: 'tabular-nums', letterSpacing: -1,
        }}>
          {peso(animSavings)}
        </div>
        <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 6, letterSpacing: 0.4 }}>
          to save · <span style={{ color: CT_SEMANTIC.win, fontWeight: 600 }}>{Math.round(savingsPct * 100)}%</span> of take-home
        </div>
      </div>

      {/* Slider */}
      <div style={{ marginTop: 20, padding: '0 4px' }}>
        <FatSlider value={savingsPct} onChange={onSavingsChange} state={state} p={p} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: p.inkMuted, letterSpacing: 0.5 }}>
          <span>0%</span>
          <span>20%</span>
          <span>40%</span>
          <span>60%+</span>
        </div>
      </div>

      {/* allocations stack — populated by drag-to-Chico */}
      <div style={{ marginTop: 14 }}>
        <AllocationStack palette={p} allocations={allocations} onRemove={onRemoveAllocation} />
      </div>

      <div style={{ flex: 1 }} />
      <CTButton palette={p} label="Lock it in →" onClick={onNext} />
      <div style={{ height: 16 }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Variant B: Split — money split visualization, sliding partition
// ─────────────────────────────────────────────────────────────
function SplitLayout({ p, state, line, animSavings, animSpending, savingsPct, onSavingsChange, takeHome, onNext, allocations, onRemoveAllocation }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 80px 0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6 }}>
        <DroppableChico state={state} size={120} palette={p} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
            Take-home
          </div>
          <div style={{ fontFamily: CT_TYPE.serif, fontSize: 32, lineHeight: 1, color: p.ink }}>
            {peso(takeHome)}
          </div>
          <div style={{
            marginTop: 8, fontSize: 13, color: p.inkSoft, lineHeight: 1.4,
            fontStyle: 'italic',
          }}>
            "{line}"
          </div>
        </div>
      </div>

      {/* Split bar */}
      <div style={{ marginTop: 22 }}>
        <div style={{
          display: 'flex', height: 72, borderRadius: 16, overflow: 'hidden',
          border: `1px solid ${p.line}`, position: 'relative',
        }}>
          <div style={{
            width: `${savingsPct * 100}%`, background: CT_SEMANTIC.win,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '0 14px', transition: 'width .25s ease', minWidth: 0,
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.85)', textTransform: 'uppercase', letterSpacing: 1 }}>
              Save
            </div>
            <div style={{ fontFamily: CT_TYPE.serif, fontSize: 18, color: '#fff', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
              {peso(animSavings)}
            </div>
          </div>
          <div style={{
            flex: 1, background: CT_SEMANTIC.amberSoft,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '0 14px', alignItems: 'flex-end', minWidth: 0,
          }}>
            <div style={{ fontSize: 10, color: p.inkSoft, textTransform: 'uppercase', letterSpacing: 1 }}>
              Spend
            </div>
            <div style={{ fontFamily: CT_TYPE.serif, fontSize: 18, color: p.ink, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
              {peso(animSpending)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: p.inkSoft }}>Drag to adjust</span>
            <span style={{ fontFamily: CT_TYPE.serif, fontSize: 28, color: p.ink, fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(savingsPct * 100)}%
            </span>
          </div>
          <FatSlider value={savingsPct} onChange={onSavingsChange} state={state} p={p} />
        </div>
      </div>

      {/* annual ticker */}
      <div style={{
        marginTop: 18, padding: 18, borderRadius: 18,
        background: state === 'rich' ? CT_SEMANTIC.winSoft :
                    state === 'shocked' ? CT_SEMANTIC.dangerSoft : p.bgCard,
        border: `1px solid ${p.line}`, transition: 'background .25s',
      }}>
        <div style={{ fontSize: 12, color: p.inkSoft, textTransform: 'uppercase', letterSpacing: 1 }}>
          In 12 months you'll have
        </div>
        <div style={{
          fontFamily: CT_TYPE.serif, fontSize: 42, color: p.ink, marginTop: 4,
          fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5,
        }}>
          {peso(animSavings * 12)}
        </div>
        <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 4 }}>
          That's {Math.round((animSavings * 12) / 5000)} round-trip flights to Cebu, give or take.
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <AllocationStack palette={p} allocations={allocations} onRemove={onRemoveAllocation} />
      </div>

      <div style={{ flex: 1 }} />
      <CTButton palette={p} label="Lock it in →" onClick={onNext} />
      <div style={{ height: 16 }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Variant C: Dial — radial gauge wraps Chico
// ─────────────────────────────────────────────────────────────
function DialLayout({ p, state, line, animSavings, animSpending, savingsPct, onSavingsChange, takeHome, onNext, allocations, onRemoveAllocation }) {
  const dialRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const angleAt = (clientX, clientY) => {
    if (!dialRef.current) return savingsPct
    const r = dialRef.current.getBoundingClientRect()
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2
    const dx = clientX - cx, dy = clientY - cy
    let a = Math.atan2(dx, -dy) * 180 / Math.PI
    a = Math.max(-135, Math.min(135, a))
    return (a + 135) / 270
  }

  const onPointerDown = (e) => {
    setDragging(true)
    onSavingsChange(angleAt(e.clientX, e.clientY))
    const move = (ev) => onSavingsChange(angleAt(ev.clientX, ev.clientY))
    const up = () => {
      setDragging(false)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const R = 110, CX = 130, CY = 130
  const angleDeg = -135 + savingsPct * 270
  const angleRad = (angleDeg - 90) * Math.PI / 180
  const handleX = CX + R * Math.cos(angleRad)
  const handleY = CY + R * Math.sin(angleRad)

  const arcPath = (start, end) => {
    const sR = (start - 90) * Math.PI / 180
    const eR = (end - 90) * Math.PI / 180
    const x1 = CX + R * Math.cos(sR), y1 = CY + R * Math.sin(sR)
    const x2 = CX + R * Math.cos(eR), y2 = CY + R * Math.sin(eR)
    const large = end - start > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 80px 0 24px', alignItems: 'center' }}>
      <div ref={dialRef} onPointerDown={onPointerDown}
        style={{
          position: 'relative', width: 260, height: 260, marginTop: 6,
          touchAction: 'none', cursor: dragging ? 'grabbing' : 'grab',
        }}>
        <svg width="260" height="260" viewBox="0 0 260 260" style={{ position: 'absolute', inset: 0 }}>
          {/* track */}
          <path d={arcPath(-135, 135)} fill="none" stroke={p.line} strokeWidth="14" strokeLinecap="round" />
          {/* fill */}
          <path d={arcPath(-135, angleDeg)} fill="none"
                stroke={state === 'shocked' || state === 'stressed' ? CT_SEMANTIC.danger : CT_SEMANTIC.win}
                strokeWidth="14" strokeLinecap="round" style={{ transition: 'stroke .25s' }} />
          {/* tick marks at 25/50/75 */}
          {[0.25, 0.5, 0.75].map((t, i) => {
            const a = (-135 + t * 270 - 90) * Math.PI / 180
            const x1 = CX + (R - 12) * Math.cos(a), y1 = CY + (R - 12) * Math.sin(a)
            const x2 = CX + (R + 12) * Math.cos(a), y2 = CY + (R + 12) * Math.sin(a)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={p.inkMuted} strokeWidth="1" />
          })}
          {/* handle */}
          <circle cx={handleX} cy={handleY} r="14" fill="#fff"
                  stroke={state === 'shocked' || state === 'stressed' ? CT_SEMANTIC.danger : CT_SEMANTIC.win}
                  strokeWidth="3" />
        </svg>

        {/* Chico in center — droppable */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <DroppableChico state={state} size={150} palette={p} />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 4 }}>
        <div style={{ fontFamily: CT_TYPE.serif, fontSize: 44, color: p.ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5 }}>
          {Math.round(savingsPct * 100)}%
        </div>
        <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 4 }}>
          {peso(animSavings)} · per month
        </div>
      </div>

      {/* speech */}
      <div style={{
        marginTop: 14, padding: '12px 18px', borderRadius: 999,
        background: p.bgCard, border: `1px solid ${p.line}`,
        fontSize: 13, color: p.ink, fontStyle: 'italic', maxWidth: 320, textAlign: 'center',
      }}>
        "{line}"
      </div>

      <div style={{ width: '100%', marginTop: 14 }}>
        <AllocationStack palette={p} allocations={allocations} onRemove={onRemoveAllocation} />
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ width: '100%' }}>
        <CTButton palette={p} label="Lock it in →" onClick={onNext} />
      </div>
      <div style={{ height: 16 }} />
    </div>
  )
}
