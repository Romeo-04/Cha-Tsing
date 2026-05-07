import { useState } from 'react'
import { CT_TYPE, CT_SEMANTIC, useCountTo } from '../tokens.js'
import CTHeader from '../components/ui/CTHeader.jsx'
import CTButton from '../components/ui/CTButton.jsx'
import FatSlider from '../components/ui/FatSlider.jsx'
import Chico from '../components/Chico.jsx'

export const BASE_DREAMS = [
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
        boxShadow: '0 -8px 40px rgba(42,31,18,0.18)',
        animation: 'sheet-up .28s cubic-bezier(.2,.8,.3,1)',
        maxHeight: '85%', overflow: 'auto',
        fontFamily: CT_TYPE.sans, color: p.ink,
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: p.line, margin: '0 auto 16px' }} />
        <div style={{ fontFamily: CT_TYPE.serif, fontSize: 22, marginBottom: 16 }}>Add your dream</div>

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
                boxShadow: emoji === e ? '0 2px 6px rgba(42,31,18,0.12)' : 'none',
                cursor: 'pointer',
              }}>{e}</button>
            ))}
          </div>
        </div>

        <div style={{
          marginBottom: 14, padding: '12px 14px', borderRadius: 12,
          background: p.bgCard, border: `1px solid ${p.line}`,
          boxShadow: '0 2px 8px rgba(42,31,18,0.06)',
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

        <div style={{
          marginBottom: 20, padding: '12px 14px', borderRadius: 12,
          background: p.bgCard, border: `1px solid ${p.line}`,
          boxShadow: '0 2px 8px rgba(42,31,18,0.06)',
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
            onClick={() => label.trim() && target && onSave({
              id: 'custom-' + Date.now(), emoji, label: label.trim(), target,
              img: 'linear-gradient(135deg, #DCD0FF 0%, #F9A8D4 100%)',
            })}
            style={{
              flex: 2, padding: '13px', borderRadius: 12,
              background: label.trim() && target ? p.ink : p.line,
              boxShadow: label.trim() && target ? '0 4px 14px rgba(42,31,18,0.22)' : 'none',
              border: 'none', color: p.bg,
              fontSize: 14, fontWeight: 600, cursor: label.trim() && target ? 'pointer' : 'default',
            }}>
            Add dream
          </button>
        </div>
      </div>
    </>
  )
}

export default function DreamsScreen({
  palette: p, monthlySavings,
  activeDreamId, onActiveDreamChange,
  dreams, onDreamsChange,
  dreamProgress, onDreamProgressChange,
  onBack, onNext, className,
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [editingAmount, setEditingAmount] = useState(false)
  const [draftAmount, setDraftAmount] = useState('')

  const active = dreams.find(d => d.id === activeDreamId) || dreams[0]
  const pct = Math.min(1, dreamProgress[activeDreamId] || 0)
  const isGoalReached = pct >= 1

  const savedAmount = Math.round(active.target * pct)
  const monthsLeft = !isGoalReached && monthlySavings > 0
    ? Math.ceil((active.target - savedAmount) / monthlySavings)
    : 0

  const animSaved = useCountTo(savedAmount, 500)
  const animPct = useCountTo(pct, 500)

  const blurPx = (1 - Math.min(1, animPct)) * 22
  const grayscale = (1 - Math.min(1, animPct)) * 80

  const setActivePct = (v) => {
    const clamped = Math.min(1, Math.max(0, v))
    onDreamProgressChange({ ...dreamProgress, [activeDreamId]: clamped })
  }

  const commitDraftAmount = () => {
    const raw = Number(draftAmount.replace(/,/g, '').replace(/[^0-9.]/g, '')) || 0
    const clamped = Math.min(active.target, Math.max(0, raw))
    setActivePct(active.target > 0 ? clamped / active.target : 0)
    setEditingAmount(false)
  }

  const addCustomDream = (dream) => {
    onDreamsChange([...dreams, dream])
    onDreamProgressChange({ ...dreamProgress, [dream.id]: 0 })
    onActiveDreamChange(dream.id)
    setShowAdd(false)
  }

  return (
    <div className={className} style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      position: 'relative',
    }}>
      <CTHeader palette={p} title="Your dreams" onBack={onBack} />

      <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>

      {/* Hero card */}
      <div style={{ padding: '4px 20px 0' }}>
        <div style={{
          position: 'relative', height: 210, borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(42,31,18,0.18)',
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
            position: 'absolute', left: 0, right: 0, bottom: 0, height: 110,
            background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.65))',
          }} />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 72, opacity: Math.max(0.15, 1 - animPct),
            transition: 'opacity .5s',
          }}>
            {active.emoji}
          </div>
          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, color: '#fff' }}>
            <div style={{ fontFamily: CT_TYPE.serif, fontSize: 24, lineHeight: 1.1 }}>{active.label}</div>
            <div style={{ fontSize: 12, marginTop: 3, opacity: 0.8 }}>
              {isGoalReached
                ? '🎉 Goal reached!'
                : monthlySavings > 0 ? `~${monthsLeft} month${monthsLeft !== 1 ? 's' : ''} away at current pace` : 'Set your savings rate to see timeline'}
            </div>
          </div>
          <div style={{
            position: 'absolute', top: 12, right: 12,
            padding: '5px 10px', borderRadius: 999,
            background: isGoalReached ? CT_SEMANTIC.win : 'rgba(255,255,255,0.92)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            fontSize: 13, fontWeight: 700,
            color: isGoalReached ? '#fff' : p.ink,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {Math.round(animPct * 100)}%
          </div>
        </div>

        {/* Numbers row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Already saved</div>
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

        {/* Chico comment */}
        <div style={{
          marginTop: 10, padding: '10px 12px', borderRadius: 12,
          background: p.bgCard, border: `1px solid ${p.line}`,
          boxShadow: '0 2px 8px rgba(42,31,18,0.07)',
          display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: p.inkSoft,
        }}>
          <Chico state={pct >= 0.5 ? 'thriving' : 'okay'} size={32} animate={false} />
          <span>
            {isGoalReached
              ? <><b style={{ color: CT_SEMANTIC.win }}>Amazing!</b> You've hit this goal. Pick your next dream! 🎉</>
              : <>At <b style={{ color: p.ink }}>₱{monthlySavings.toLocaleString('en-PH')}/mo</b>, you need <b style={{ color: CT_SEMANTIC.dream }}>{monthsLeft} more month{monthsLeft !== 1 ? 's' : ''}</b>.</>
            }
          </span>
        </div>
      </div>

      {/* Dream picker */}
      <div style={{ marginTop: 14, padding: '0 20px 4px', fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
        Switch dream
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '4px 20px 6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {dreams.map(d => {
          const isActive = d.id === activeDreamId
          const dpct = Math.min(1, dreamProgress[d.id] || 0)
          return (
            <button key={d.id} onClick={() => onActiveDreamChange(d.id)} style={{
              flexShrink: 0, width: 100, padding: '10px 10px',
              borderRadius: 14, border: `1.5px solid ${isActive ? p.ink : p.line}`,
              background: isActive ? p.ink : p.bgCard,
              boxShadow: isActive ? '0 4px 16px rgba(42,31,18,0.2)' : '0 2px 8px rgba(42,31,18,0.06)',
              color: isActive ? p.bg : p.ink,
              cursor: 'pointer', textAlign: 'left', fontFamily: CT_TYPE.sans,
              transition: 'box-shadow .2s, background .2s',
            }}>
              <div style={{ fontSize: 20 }}>{d.emoji}</div>
              <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600, lineHeight: 1.2 }}>{d.label}</div>
              <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: isActive ? 'rgba(255,255,255,0.2)' : p.line, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${dpct * 100}%`, background: CT_SEMANTIC.dream }} />
              </div>
            </button>
          )
        })}

        <button onClick={() => setShowAdd(true)} style={{
          flexShrink: 0, width: 72, borderRadius: 14,
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

      {/* Progress slider + editable amount */}
      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ fontSize: 12, color: p.inkSoft, marginBottom: 6 }}>
          How much have you already saved toward this dream?
        </div>

        {/* Editable amount row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
          padding: '10px 14px', borderRadius: 12,
          background: p.bgCard, border: `1.5px solid ${isGoalReached ? CT_SEMANTIC.win : p.line}`,
          boxShadow: isGoalReached
            ? `0 0 0 3px ${CT_SEMANTIC.winSoft}, 0 2px 10px rgba(34,160,107,0.15)`
            : '0 2px 8px rgba(42,31,18,0.06)',
          transition: 'box-shadow .3s, border-color .3s',
        }}>
          <span style={{ fontFamily: CT_TYPE.serif, fontSize: 20, color: p.inkSoft }}>₱</span>
          {editingAmount ? (
            <input
              autoFocus
              type="number"
              value={draftAmount}
              onChange={e => setDraftAmount(e.target.value)}
              onBlur={commitDraftAmount}
              onKeyDown={e => { if (e.key === 'Enter') e.target.blur() }}
              min={0} max={active.target}
              style={{
                flex: 1, border: 'none', background: 'transparent', outline: 'none',
                fontSize: 24, fontFamily: CT_TYPE.serif, color: p.ink, padding: 0,
              }}
            />
          ) : (
            <div
              onClick={() => { setEditingAmount(true); setDraftAmount(String(savedAmount)) }}
              style={{
                flex: 1, fontSize: 24, fontFamily: CT_TYPE.serif, color: p.ink,
                fontVariantNumeric: 'tabular-nums', cursor: 'text',
              }}>
              {savedAmount.toLocaleString('en-PH')}
            </div>
          )}
          <span style={{ fontSize: 12, color: isGoalReached ? CT_SEMANTIC.win : p.inkMuted, fontWeight: 600 }}>
            {isGoalReached ? '🎉 Goal reached!' : `of ₱${active.target.toLocaleString('en-PH')}`}
          </span>
        </div>

        {isGoalReached ? (
          <div style={{
            padding: '12px 14px', borderRadius: 12, textAlign: 'center',
            background: CT_SEMANTIC.winSoft, border: `1px solid ${CT_SEMANTIC.win}`,
            fontSize: 13, color: CT_SEMANTIC.win, fontWeight: 600,
          }}>
            You've fully saved for this dream! 🎉 Pick another dream or set a new one.
          </div>
        ) : (
          <FatSlider
            value={pct} max={1}
            onChange={setActivePct}
            state={pct >= 0.5 ? 'thriving' : 'okay'} p={p} />
        )}
      </div>

      <div style={{ height: 16 }} />
      </div>{/* end scrollable */}

      <div style={{ padding: '10px 20px 16px', borderTop: `1px solid ${p.line}` }}>
        <CTButton palette={p} label="See my insights" onClick={onNext} />
      </div>

      {showAdd && (
        <AddDreamSheet palette={p} onSave={addCustomDream} onCancel={() => setShowAdd(false)} />
      )}
    </div>
  )
}
