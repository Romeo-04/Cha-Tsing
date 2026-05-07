import { useState } from 'react'
import { CT_TYPE, CT_SEMANTIC, useCountTo } from '../tokens.js'
import CTHeader from '../components/ui/CTHeader.jsx'
import CTButton from '../components/ui/CTButton.jsx'
import FatSlider from '../components/ui/FatSlider.jsx'
import Chico from '../components/Chico.jsx'

const BASE_DREAMS = [
  { id: 'boracay',   emoji: '🏝',  label: 'Boracay trip',      target: 45000,
    img: 'linear-gradient(135deg, #7DD3FC 0%, #FED7AA 60%, #FECACA 100%)' },
  { id: 'iphone',    emoji: '📱',  label: 'New phone',          target: 65000,
    img: 'linear-gradient(135deg, #1F2937 0%, #4B5563 50%, #9CA3AF 100%)' },
  { id: 'condo',     emoji: '🏢',  label: 'Condo down payment', target: 350000,
    img: 'linear-gradient(160deg, #93C5FD 0%, #DBEAFE 40%, #F3F4F6 100%)' },
  { id: 'japan',     emoji: '⛩',  label: 'Japan trip',         target: 120000,
    img: 'linear-gradient(135deg, #FCA5A5 0%, #FECACA 50%, #FEF3C7 100%)' },
  { id: 'emergency', emoji: '🛟',  label: 'Emergency fund',     target: 180000,
    img: 'linear-gradient(135deg, #34D399 0%, #A7F3D0 50%, #FEF3C7 100%)' },
  { id: 'wedding',   emoji: '💍',  label: 'Wedding',            target: 400000,
    img: 'linear-gradient(135deg, #F9A8D4 0%, #FBCFE8 50%, #FEF3C7 100%)' },
]

const EMOJI_OPTIONS = ['🏝','📱','🏢','⛩','🛟','💍','🚗','💻','🎓','✈️','🏡','🎮','🐕','💪','🎵','🌍','👶','🏋️','🎨','⚽']

function AddDreamSheet({ palette: p, onSave, onCancel }) {
  const [emoji, setEmoji] = useState('✨')
  const [label, setLabel] = useState('')
  const [target, setTarget] = useState(50000)

  return (
    <>
      <div onClick={onCancel} style={{
        position: 'absolute', inset: 0, background: 'rgba(20,15,8,0.45)',
        zIndex: 200, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 201,
        background: p.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '12px 20px 24px',
        animation: 'sheet-up .28s cubic-bezier(.2,.8,.3,1)',
        maxHeight: '85%', overflow: 'auto',
        fontFamily: CT_TYPE.sans, color: p.ink,
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: p.line, margin: '0 auto 16px' }} />
        <div style={{ fontFamily: CT_TYPE.serif, fontSize: 22, marginBottom: 16 }}>Add your dream</div>

        {/* Emoji picker */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Icon
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {EMOJI_OPTIONS.map(e => (
              <button key={e} onClick={() => setEmoji(e)} style={{
                width: 38, height: 38, borderRadius: 10, fontSize: 20,
                border: `1.5px solid ${emoji === e ? p.ink : 'transparent'}`,
                background: emoji === e ? p.bgCard : 'transparent',
                cursor: 'pointer',
              }}>{e}</button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div style={{
          marginBottom: 14, padding: '12px 14px', borderRadius: 12,
          background: p.bgCard, border: `1px solid ${p.line}`,
        }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Dream name
          </div>
          <input
            type="text" value={label} onChange={e => setLabel(e.target.value)}
            placeholder="e.g. MacBook Pro"
            autoFocus
            style={{
              width: '100%', border: 'none', background: 'transparent',
              fontSize: 20, fontFamily: CT_TYPE.serif, color: p.ink, outline: 'none', padding: 0,
            }}
          />
        </div>

        {/* Target amount */}
        <div style={{
          marginBottom: 20, padding: '12px 14px', borderRadius: 12,
          background: p.bgCard, border: `1px solid ${p.line}`,
        }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Goal amount
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 22, color: p.inkSoft, fontFamily: CT_TYPE.serif }}>₱</span>
            <input
              type="number" value={target || ''} onChange={e => setTarget(Number(e.target.value) || 0)}
              placeholder="0"
              style={{
                flex: 1, border: 'none', background: 'transparent',
                fontSize: 28, fontFamily: CT_TYPE.serif, color: p.ink, outline: 'none', padding: 0,
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '13px', borderRadius: 12,
            background: 'transparent', border: `1px solid ${p.line}`,
            color: p.ink, fontSize: 14, cursor: 'pointer',
          }}>Cancel</button>
          <button
            disabled={!label.trim() || !target}
            onClick={() => label.trim() && target && onSave({ id: 'custom-' + Date.now(), emoji, label: label.trim(), target, img: 'linear-gradient(135deg, #DCD0FF 0%, #F9A8D4 100%)' })}
            style={{
              flex: 2, padding: '13px', borderRadius: 12,
              background: label.trim() && target ? p.ink : p.line,
              border: 'none', color: p.bg,
              fontSize: 14, fontWeight: 600, cursor: label.trim() && target ? 'pointer' : 'default',
            }}>
            Add dream →
          </button>
        </div>
      </div>
    </>
  )
}

export default function DreamsScreen({ palette: p, monthlySavings, savingsLog = [], onBack, onNext, className }) {
  const [dreams, setDreams] = useState(BASE_DREAMS)
  const [activeId, setActiveId] = useState('boracay')
  const [progress, setProgress] = useState({
    boracay: 0.65, iphone: 0.32, condo: 0.08, japan: 0.18, emergency: 0.42, wedding: 0.05,
  })
  const [showAdd, setShowAdd] = useState(false)

  const active = dreams.find(d => d.id === activeId) || dreams[0]
  const pct = progress[activeId] || 0

  // Compute actual saved from savingsLog for display
  const totalActuallySaved = savingsLog.reduce((s, e) => s + e.amount, 0)
  const savedTowardActive = Math.min(active.target, totalActuallySaved)
  const savedPct = active.target > 0 ? savedTowardActive / active.target : 0

  // Use slider pct for preview; default to actual progress or savedPct
  const displayPct = pct
  const saved = Math.round(active.target * displayPct)
  const monthsLeft = monthlySavings > 0 ? Math.ceil((active.target - saved) / monthlySavings) : 99

  const animSaved = useCountTo(saved, 500)
  const animPct = useCountTo(displayPct, 500)

  const blurPx = (1 - animPct) * 22
  const grayscale = (1 - animPct) * 80

  const addCustomDream = (dream) => {
    setDreams(prev => [...prev, dream])
    setProgress(prev => ({ ...prev, [dream.id]: savedPct }))
    setActiveId(dream.id)
    setShowAdd(false)
  }

  return (
    <div className={className} style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      position: 'relative',
    }}>
      <CTHeader palette={p} title="Your dreams" onBack={onBack} />

      {/* Hero card */}
      <div style={{ padding: '4px 20px 0' }}>
        <div style={{
          position: 'relative', height: 210, borderRadius: 18, overflow: 'hidden',
          border: `1px solid ${p.line}`,
        }}>
          <div style={{
            position: 'absolute', inset: -30,
            background: active.img,
            filter: `blur(${blurPx}px) grayscale(${grayscale}%)`,
            transition: 'filter .5s ease',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(45deg, transparent 0 12px, rgba(255,255,255,0.04) 12px 24px)',
            mixBlendMode: 'overlay',
          }} />
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: 100,
            background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.55))',
          }} />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 72, opacity: Math.max(0.2, 1 - animPct),
            transition: 'opacity .5s',
          }}>
            {active.emoji}
          </div>
          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 12, color: '#fff' }}>
            <div style={{ fontFamily: CT_TYPE.serif, fontSize: 24, lineHeight: 1.1 }}>{active.label}</div>
          </div>
          <div style={{
            position: 'absolute', top: 12, right: 12,
            padding: '5px 10px', borderRadius: 999,
            background: 'rgba(255,255,255,0.92)',
            fontSize: 13, fontWeight: 600, color: p.ink, fontVariantNumeric: 'tabular-nums',
          }}>
            {Math.round(animPct * 100)}%
          </div>
        </div>

        {/* Numbers row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Saved (simulated)</div>
            <div style={{ fontFamily: CT_TYPE.serif, fontSize: 22, color: p.ink, fontVariantNumeric: 'tabular-nums' }}>
              ₱{Math.round(animSaved).toLocaleString('en-PH')}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Goal</div>
            <div style={{ fontFamily: CT_TYPE.serif, fontSize: 22, color: p.inkSoft, fontVariantNumeric: 'tabular-nums' }}>
              ₱{active.target.toLocaleString('en-PH')}
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div style={{
          marginTop: 10, padding: '10px 12px', borderRadius: 12,
          background: p.bgCard, border: `1px solid ${p.line}`,
          display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: p.inkSoft,
        }}>
          <Chico state={pct >= 0.5 ? 'thriving' : 'okay'} size={32} animate={false} />
          <span>
            At <b style={{ color: p.ink }}>₱{monthlySavings.toLocaleString('en-PH')}/mo</b>, ~
            <b style={{ color: CT_SEMANTIC.dream }}> {monthsLeft} months</b> to go.
          </span>
        </div>
      </div>

      {/* Dream picker */}
      <div style={{ marginTop: 14, padding: '0 20px 4px', fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
        Switch dream
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '4px 20px 6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {dreams.map(d => {
          const isActive = d.id === activeId
          const dpct = progress[d.id] || 0
          return (
            <button key={d.id} onClick={() => setActiveId(d.id)} style={{
              flexShrink: 0, width: 100, padding: '10px 10px',
              borderRadius: 12, border: `1px solid ${isActive ? p.ink : p.line}`,
              background: isActive ? p.ink : p.bgCard,
              color: isActive ? p.bg : p.ink,
              cursor: 'pointer', textAlign: 'left', fontFamily: CT_TYPE.sans,
            }}>
              <div style={{ fontSize: 20 }}>{d.emoji}</div>
              <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600, lineHeight: 1.2 }}>{d.label}</div>
              <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: isActive ? 'rgba(255,255,255,0.2)' : p.line, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${dpct * 100}%`, background: CT_SEMANTIC.dream }} />
              </div>
            </button>
          )
        })}

        {/* Add custom dream */}
        <button onClick={() => setShowAdd(true)} style={{
          flexShrink: 0, width: 72, borderRadius: 12,
          border: `1.5px dashed ${p.inkMuted}`,
          background: 'transparent', color: p.inkSoft,
          cursor: 'pointer', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 4,
          fontFamily: CT_TYPE.sans,
        }}>
          <span style={{ fontSize: 22 }}>+</span>
          <span style={{ fontSize: 10, textAlign: 'center', lineHeight: 1.2 }}>Add dream</span>
        </button>
      </div>

      {/* Progress slider with clear hint */}
      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ fontSize: 12, color: p.inkSoft, marginBottom: 4 }}>
          How much have you already saved toward this dream?
          {' '}
          <span style={{ fontWeight: 600, color: p.ink, fontVariantNumeric: 'tabular-nums' }}>
            ₱{Math.round(active.target * pct).toLocaleString('en-PH')}
          </span>
        </div>
        <FatSlider
          value={pct} max={1}
          onChange={(v) => setProgress(prev => ({ ...prev, [activeId]: v }))}
          state={pct >= 0.5 ? 'thriving' : 'okay'} p={p} />
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 20px 16px' }}>
        <CTButton palette={p} label="See my insights →" onClick={onNext} />
      </div>

      {showAdd && (
        <AddDreamSheet palette={p} onSave={addCustomDream} onCancel={() => setShowAdd(false)} />
      )}
    </div>
  )
}
