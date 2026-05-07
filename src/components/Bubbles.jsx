// Bubbles.jsx — draggable idea bubbles → drop on Chico → he eats them
// + long-press / tap "+" to open a hovering Edit Sheet (name, amount, recs)

import { useState, useEffect, useRef, useContext, createContext, useMemo } from 'react'
import { CT_SEMANTIC, CT_TYPE, CT_PALETTES } from '../tokens.js'
import Chico from './Chico.jsx'

export const BUBBLE_LIBRARY = [
  { id: 'rent',       emoji: '🏠', label: 'Rent',         amount: 12000, color: '#7C4DFF', tip: "Most Pinoys spend 25-35% on housing. You?" },
  { id: 'groceries',  emoji: '🥬', label: 'Groceries',    amount: 6000,  color: '#22A06B', tip: "Palengke beats SM. Trust." },
  { id: 'transport',  emoji: '🛺', label: 'Transport',    amount: 3000,  color: '#C9854A', tip: "Grab + jeep + gas. All in here." },
  { id: 'fun',        emoji: '🎉', label: 'Fun money',    amount: 4000,  color: '#E54B3C', tip: "I won't tell anyone. Promise." },
  { id: 'gym',        emoji: '🏋', label: 'Gym',          amount: 1500,  color: '#22A06B', tip: "Banana strength training." },
  { id: 'streaming',  emoji: '📺', label: 'Streaming',    amount: 800,   color: '#7C4DFF', tip: "Netflix + Spotify + iWantTFC?" },
  { id: 'coffee',     emoji: '☕', label: 'Coffee',       amount: 2400,  color: '#C9854A', tip: "150/day = 4,500/mo. Just sayin'." },
  { id: 'family',     emoji: '👨‍👩‍👧', label: 'Family help', amount: 5000, color: '#E54B3C', tip: "Good kid energy." },
]

const RECOMMENDED_TEMPLATES = [
  { emoji: '🍱', label: 'Lunch out',     amount: 3000, color: '#C9854A' },
  { emoji: '💊', label: 'Meds & health', amount: 1200, color: '#22A06B' },
  { emoji: '🐕', label: 'Pet',           amount: 1500, color: '#C9854A' },
  { emoji: '📚', label: 'Books / Learn', amount: 1000, color: '#7C4DFF' },
  { emoji: '💇', label: 'Self-care',     amount: 1500, color: '#E54B3C' },
  { emoji: '🎁', label: 'Gifts',         amount: 1000, color: '#E54B3C' },
]

export const ChicoDropContext = createContext(null)

// ── BubbleStage ─────────────────────────────────────────────────────────
export function BubbleStage({ palette, children, allocations, onAdd, onRemove, onEditAllocation, chicoState, onChicoStateOverride }) {
  const p = palette
  const stageRef = useRef(null)
  const chicoRefHolder = useRef(null)
  const setChicoRef = (r) => { chicoRefHolder.current = r }

  const usedIds = new Set(allocations.map(a => a.id))
  const visibleBubbles = BUBBLE_LIBRARY.filter(b => !usedIds.has(b.id))

  const [drag, setDrag] = useState(null)
  const [chompPulse, setChompPulse] = useState(0)
  const [flash, setFlash] = useState(null)
  const [editing, setEditing] = useState(null)
  const [near, setNear] = useState(false)
  const [eating, setEating] = useState(false)

  const longPressTimer = useRef(null)

  const startDrag = (bubble, e) => {
    e.preventDefault()
    const stage = stageRef.current
    if (!stage) return
    const r = stage.getBoundingClientRect()

    let movedFar = false
    const startX = e.clientX, startY = e.clientY
    longPressTimer.current = setTimeout(() => {
      if (!movedFar) {
        setEditing({ ...bubble, mode: 'edit' })
        cleanup()
      }
    }, 360)

    setDrag({
      id: bubble.id, bubble,
      x: e.clientX - r.left, y: e.clientY - r.top,
    })

    const move = (ev) => {
      const dx = ev.clientX - startX, dy = ev.clientY - startY
      if (Math.hypot(dx, dy) > 8) {
        movedFar = true
        if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null }
      }
      const r2 = stage.getBoundingClientRect()
      setDrag(d => d ? { ...d, x: ev.clientX - r2.left, y: ev.clientY - r2.top } : null)

      const chicoEl = chicoRefHolder.current?.current
      if (chicoEl) {
        const cr = chicoEl.getBoundingClientRect()
        const ccx = cr.left + cr.width / 2
        const ccy = cr.top + cr.height / 2
        const dist = Math.hypot(ev.clientX - ccx, ev.clientY - ccy)
        setNear(dist < Math.max(cr.width, cr.height) * 0.6 + 30)
      }
    }
    const cleanup = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null }
      setDrag(null)
      setNear(false)
    }
    const up = (ev) => {
      const chicoEl = chicoRefHolder.current?.current
      if (chicoEl && movedFar) {
        const cr = chicoEl.getBoundingClientRect()
        const hit = ev.clientX >= cr.left && ev.clientX <= cr.right
                  && ev.clientY >= cr.top  && ev.clientY <= cr.bottom
        if (hit) {
          setChompPulse(p => p + 1)
          setEating(true)
          setTimeout(() => setEating(false), 900)
          setFlash(bubble)
          setTimeout(() => setFlash(null), 1400)
          onAdd(bubble)
        }
      }
      cleanup()
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const openCustom = () => {
    setEditing({
      id: 'custom-' + Date.now(),
      emoji: '✨', label: 'New expense', amount: 2000, color: '#7C4DFF',
      mode: 'create',
    })
  }

  const saveEdit = (updated) => {
    onAdd(updated)
    setEditing(null)
    setChompPulse(p => p + 1)
    setEating(true)
    setTimeout(() => setEating(false), 900)
    setFlash(updated)
    setTimeout(() => setFlash(null), 1400)
  }

  const stateOverride = eating ? 'eating' : (near && drag) ? 'hungry' : null
  useEffect(() => {
    if (onChicoStateOverride) onChicoStateOverride(stateOverride)
  }, [stateOverride, onChicoStateOverride])

  let tracer = null
  if (drag && chicoRefHolder.current?.current && stageRef.current) {
    const cr = chicoRefHolder.current.current.getBoundingClientRect()
    const sr = stageRef.current.getBoundingClientRect()
    tracer = {
      x1: drag.x, y1: drag.y,
      x2: cr.left + cr.width / 2 - sr.left,
      y2: cr.top + cr.height / 2 - sr.top,
    }
  }

  return (
    <ChicoDropContext.Provider value={{ setChicoRef, chompPulse, eating, near: near && !!drag, dragColor: drag?.bubble.color }}>
      <div ref={stageRef} style={{
        position: 'relative', flex: 1, display: 'flex', flexDirection: 'column',
        minHeight: 0, overflow: 'hidden',
      }}>
        {children}

        {/* Side rail */}
        <div style={{
          position: 'absolute', top: 60, right: 6, bottom: 80,
          display: 'flex', flexDirection: 'column', gap: 7, padding: '6px 4px',
          pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: 9, color: p.inkMuted, textAlign: 'center',
            textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.2,
          }}>
            Drag<br/>to feed<br/>Chico
          </div>
          {visibleBubbles.slice(0, 5).map((b, i) => (
            <BubbleChip key={b.id} bubble={b} index={i}
              onPointerDown={(e) => startDrag(b, e)}
              hidden={drag?.id === b.id} />
          ))}
          {/* + Custom */}
          <button onClick={openCustom} style={{
            pointerEvents: 'auto', cursor: 'pointer',
            width: 52, height: 52, borderRadius: '50%', alignSelf: 'center',
            background: 'transparent', border: `2px dashed ${p.inkMuted}`,
            color: p.inkSoft, fontSize: 22, padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} title="Create custom expense">+</button>
        </div>

        {/* Hint banner during drag */}
        {drag && !tracer?.atTarget && (
          <div style={{
            position: 'absolute', bottom: 90, left: '50%', transform: 'translateX(-50%)',
            padding: '6px 12px', borderRadius: 999, background: 'rgba(0,0,0,0.7)',
            color: '#fff', fontSize: 11, pointerEvents: 'none', zIndex: 90,
          }}>
            Drop on Chico, or hold to edit
          </div>
        )}

        {/* Tracer */}
        {tracer && (
          <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <line x1={tracer.x1} y1={tracer.y1} x2={tracer.x2} y2={tracer.y2}
              stroke={drag.bubble.color} strokeWidth="2.5" strokeDasharray="4 6"
              opacity="0.7" strokeLinecap="round" />
            <circle cx={tracer.x2} cy={tracer.y2} r="22"
              fill="none" stroke={drag.bubble.color} strokeWidth="2" opacity="0.5">
              <animate attributeName="r" values="18;30;18" dur="0.9s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.1;0.6" dur="0.9s" repeatCount="indefinite" />
            </circle>
          </svg>
        )}

        {drag && (
          <div style={{
            position: 'absolute', left: drag.x, top: drag.y,
            transform: 'translate(-50%, -50%) scale(1.15)',
            pointerEvents: 'none', zIndex: 100,
            filter: `drop-shadow(0 8px 16px ${drag.bubble.color}66)`,
          }}>
            <BubbleChipBody bubble={drag.bubble} active />
          </div>
        )}

        {flash && chicoRefHolder.current?.current && stageRef.current && (
          <FlashChip flash={flash}
            chicoRect={chicoRefHolder.current.current.getBoundingClientRect()}
            stageRect={stageRef.current.getBoundingClientRect()} />
        )}

        {editing && (
          <BubbleEditSheet
            palette={p} bubble={editing}
            onSave={saveEdit}
            onCancel={() => setEditing(null)} />
        )}
      </div>
    </ChicoDropContext.Provider>
  )
}

function BubbleChip({ bubble, index, onPointerDown, hidden }) {
  return (
    <div onPointerDown={onPointerDown}
      style={{
        pointerEvents: 'auto', cursor: 'grab', visibility: hidden ? 'hidden' : 'visible',
        animation: `bubble-bob ${2.4 + index * 0.2}s ease-in-out ${index * 0.15}s infinite`,
        alignSelf: 'center',
      }}>
      <BubbleChipBody bubble={bubble} />
    </div>
  )
}

function BubbleChipBody({ bubble, active = false }) {
  return (
    <div style={{
      width: 52, height: 52, borderRadius: '50%', background: '#fff',
      border: `2.5px solid ${bubble.color}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      boxShadow: 'none',
      userSelect: 'none', position: 'relative',
    }}>
      <div style={{ fontSize: 19, lineHeight: 1 }}>{bubble.emoji}</div>
      <div style={{
        fontSize: 8, color: bubble.color, fontWeight: 700, marginTop: 1,
        fontVariantNumeric: 'tabular-nums', letterSpacing: 0.2,
      }}>
        ₱{(bubble.amount / 1000).toFixed(bubble.amount >= 10000 ? 0 : 1)}k
      </div>
    </div>
  )
}

function FlashChip({ flash, chicoRect, stageRect }) {
  const cx = chicoRect.left + chicoRect.width / 2 - stageRect.left
  const cy = chicoRect.top - stageRect.top
  return (
    <div style={{
      position: 'absolute', left: cx, top: cy, pointerEvents: 'none', zIndex: 50,
      animation: 'flash-up 1.4s cubic-bezier(.2,.8,.3,1) forwards',
    }}>
      <div style={{
        padding: '6px 14px', borderRadius: 999,
        background: flash.color, color: '#fff', fontSize: 12, fontWeight: 700,
        whiteSpace: 'nowrap',
      }}>
        +{flash.emoji} {flash.label} · ₱{flash.amount.toLocaleString()}
      </div>
    </div>
  )
}

// ── Edit Sheet — overlays without replacing screen ──────────────────────
const EMOJI_PALETTE = ['🏠','🥬','🛺','🎉','🏋','📺','☕','👨‍👩‍👧','🍱','💊','🐕','📚','💇','🎁','✨','💸','🚗','🍻','🎮','🛒']
const COLOR_PALETTE = ['#7C4DFF','#22A06B','#C9854A','#E54B3C','#F2A28A','#7DD3FC']

export function BubbleEditSheet({ palette, bubble, onSave, onCancel }) {
  const p = palette
  const [draft, setDraft] = useState(bubble)

  const update = (k, v) => setDraft(prev => ({ ...prev, [k]: v }))

  const suggestion = useMemo(() => {
    if (draft.amount > 15000) return "Big-ticket. Make sure this is essential, friend."
    if (draft.amount < 500) return "Tiny. Are you sure that's enough?"
    if (draft.label.toLowerCase().includes('coffee') && draft.amount > 3000) return "That's a lot of coffee. Or one fancy machine."
    if (draft.label.toLowerCase().includes('rent') && draft.amount < 5000) return "Cheap rent! Bless."
    return "Looks reasonable. Banana approved."
  }, [draft.amount, draft.label])

  return (
    <>
      {/* scrim */}
      <div onClick={onCancel} style={{
        position: 'absolute', inset: 0, background: 'rgba(20,15,8,0.45)',
        zIndex: 200, animation: 'scrim-in .2s ease',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      }} />
      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 201,
        background: p.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '12px 20px 20px', borderTop: `1px solid ${p.line}`,
        animation: 'sheet-up .28s cubic-bezier(.2,.8,.3,1)',
        maxHeight: '90%', overflow: 'auto',
        fontFamily: CT_TYPE.sans, color: p.ink,
      }}>
        {/* grabber */}
        <div style={{
          width: 36, height: 4, borderRadius: 2, background: p.line,
          margin: '0 auto 12px',
        }} />

        {/* preview chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <BubbleChipBody bubble={draft} active />
          <div style={{ flex: 1, minWidth: 0 }}>
            <input
              type="text"
              value={draft.label}
              onChange={(e) => update('label', e.target.value)}
              style={{
                width: '100%', border: 'none', background: 'transparent',
                fontFamily: CT_TYPE.serif, fontSize: 24, color: p.ink, padding: 0,
                outline: 'none',
              }}
            />
            <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>
              {bubble.mode === 'create' ? 'Create expense' : 'Edit expense'}
            </div>
          </div>
        </div>

        {/* Amount — big tappable input + slider */}
        <div style={{
          padding: '12px 14px', borderRadius: 14,
          background: p.bgCard, border: `1px solid ${p.line}`,
        }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
            Amount per month
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
            <span style={{ fontSize: 24, color: p.inkSoft, fontFamily: CT_TYPE.serif }}>₱</span>
            <input
              type="number" min={0} max={100000} step={100}
              value={draft.amount}
              onChange={(e) => update('amount', Math.max(0, Math.min(100000, Number(e.target.value) || 0)))}
              style={{
                flex: 1, minWidth: 0, border: 'none', background: 'transparent',
                fontFamily: CT_TYPE.serif, fontSize: 32, color: draft.color, padding: 0,
                outline: 'none', fontVariantNumeric: 'tabular-nums', textAlign: 'right',
              }}
            />
          </div>

          {/* slider */}
          <input type="range" min={0} max={30000} step={100}
            value={Math.min(30000, draft.amount)}
            onChange={(e) => update('amount', Number(e.target.value))}
            style={{
              width: '100%', marginTop: 10, accentColor: draft.color,
              height: 6,
            }}
          />

          {/* preset chips */}
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {[1000, 2500, 5000, 10000, 15000].map(v => (
              <button key={v} onClick={() => update('amount', v)}
                style={{
                  padding: '4px 10px', borderRadius: 999,
                  border: `1px solid ${draft.amount === v ? draft.color : p.line}`,
                  background: draft.amount === v ? draft.color + '15' : 'transparent',
                  color: draft.amount === v ? draft.color : p.inkSoft,
                  fontSize: 11, cursor: 'pointer', fontWeight: 600,
                }}>
                ₱{(v/1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>

        {/* Emoji picker */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Icon
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {EMOJI_PALETTE.map(e => (
              <button key={e} onClick={() => update('emoji', e)}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  border: `1.5px solid ${draft.emoji === e ? draft.color : 'transparent'}`,
                  background: draft.emoji === e ? '#fff' : p.bgCard,
                  fontSize: 18, cursor: 'pointer', padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{e}</button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Color
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {COLOR_PALETTE.map(c => (
              <button key={c} onClick={() => update('color', c)}
                style={{
                  width: 32, height: 32, borderRadius: '50%', background: c,
                  border: `3px solid ${draft.color === c ? p.ink : 'transparent'}`,
                  cursor: 'pointer', padding: 0,
                }} />
            ))}
          </div>
        </div>

        {/* Chico's recommendation */}
        <div style={{
          marginTop: 14, padding: '10px 12px', borderRadius: 12,
          background: CT_SEMANTIC.amberSoft, border: `1px solid ${CT_SEMANTIC.amber}33`,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <div style={{ marginTop: -4, flexShrink: 0 }}>
            <Chico state="okay" size={44} animate={false} />
          </div>
          <div style={{ fontSize: 12, color: p.ink, lineHeight: 1.4 }}>
            <b>Chico says:</b> "{suggestion}"
            {bubble.tip && (
              <div style={{ marginTop: 4, color: p.inkSoft, fontStyle: 'italic' }}>
                Tip: {bubble.tip}
              </div>
            )}
          </div>
        </div>

        {/* Recommended templates */}
        {bubble.mode === 'create' && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              Or pick a template
            </div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {RECOMMENDED_TEMPLATES.map((t, i) => (
                <button key={i} onClick={() => setDraft(d => ({ ...d, ...t }))}
                  style={{
                    flexShrink: 0, padding: '8px 12px', borderRadius: 12,
                    border: `1px solid ${p.line}`, background: p.bgCard,
                    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  }}>
                  <span style={{ fontSize: 18 }}>{t.emoji}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: p.ink }}>{t.label}</div>
                    <div style={{ fontSize: 10, color: t.color, fontWeight: 700 }}>₱{t.amount.toLocaleString()}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '13px', borderRadius: 14,
            background: 'transparent', border: `1px solid ${p.line}`,
            color: p.ink, fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={() => onSave(draft)} style={{
            flex: 2, padding: '13px', borderRadius: 14,
            background: p.ink, border: 'none', color: p.bg,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            {bubble.mode === 'create' ? 'Feed Chico →' : 'Save & feed →'}
          </button>
        </div>
      </div>
    </>
  )
}

// ── Allocation stack ────────────────────────────────────────────────────
export function AllocationStack({ palette, allocations, onRemove, onEdit }) {
  const p = palette
  if (!allocations.length) {
    return (
      <div style={{
        padding: '12px 14px', borderRadius: 14,
        border: `1.5px dashed ${p.line}`, background: 'transparent',
        fontSize: 12, color: p.inkMuted, textAlign: 'center', lineHeight: 1.4,
      }}>
        Drag a bubble → Chico, or tap <b>+</b> for custom
      </div>
    )
  }
  const total = allocations.reduce((s, a) => s + a.amount, 0)
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 14,
      background: p.bgCard, border: `1px solid ${p.line}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
          Chico's allocations · tap to edit
        </span>
        <span style={{ fontSize: 12, color: p.ink, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
          ₱{total.toLocaleString()}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {allocations.map(a => (
          <span key={a.id} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 4px 4px 6px', borderRadius: 999,
            background: '#fff', border: `1px solid ${a.color}55`,
            fontSize: 11, color: p.ink, fontFamily: CT_TYPE.sans,
          }}>
            <button onClick={() => onEdit && onEdit(a)} style={{
              border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5, color: 'inherit', font: 'inherit',
            }}>
              <span style={{ fontSize: 13 }}>{a.emoji}</span>
              <span style={{ fontWeight: 500 }}>{a.label}</span>
              <span style={{ color: a.color, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                ₱{(a.amount/1000).toFixed(a.amount >= 10000 ? 0 : 1)}k
              </span>
            </button>
            <button onClick={() => onRemove(a.id)} style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              color: p.inkMuted, padding: '0 4px', fontSize: 14, lineHeight: 1,
            }}>×</button>
          </span>
        ))}
      </div>
    </div>
  )
}

export function DroppableChico({ state, size }) {
  const wrapRef = useRef(null)
  const ctx = useContext(ChicoDropContext)
  const [chomp, setChomp] = useState(0)
  const [crumbs, setCrumbs] = useState([])

  useEffect(() => { if (ctx?.setChicoRef) ctx.setChicoRef(wrapRef) }, [ctx])
  useEffect(() => {
    if (ctx?.chompPulse) {
      setChomp(c => c + 1)
      const id = Date.now()
      const newCrumbs = Array.from({ length: 6 }, (_, i) => ({
        id: id + i,
        cx: (Math.random() - 0.5) * 80,
        delay: i * 60,
        color: ctx.dragColor || '#C9854A',
      }))
      setCrumbs(c => [...c, ...newCrumbs])
      setTimeout(() => setCrumbs(c => c.filter(x => !newCrumbs.find(n => n.id === x.id))), 1200)
      const t = setTimeout(() => setChomp(c => c + 1), 320)
      return () => clearTimeout(t)
    }
  }, [ctx?.chompPulse])

  const effectiveState = ctx?.eating ? 'eating' : ctx?.near ? 'hungry' : state

  return (
    <div ref={wrapRef} style={{
      display: 'inline-block', position: 'relative',
      animation: chomp % 2 === 1 ? 'chico-chomp 0.32s cubic-bezier(.2,.8,.3,1)' : 'none',
      transformOrigin: 'center bottom',
    }}>
      <Chico state={effectiveState} size={size} />
      {crumbs.map(c => (
        <span key={c.id} style={{
          position: 'absolute', left: '50%', top: '60%',
          width: 6, height: 6, borderRadius: 2, background: c.color,
          '--cx': `${c.cx}px`,
          animation: `chico-crumb 0.9s ease-out ${c.delay}ms forwards`,
          pointerEvents: 'none',
        }} />
      ))}
    </div>
  )
}
