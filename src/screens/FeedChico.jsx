import { useState } from 'react'
import { CT_TYPE, CT_SEMANTIC, useCountTo } from '../tokens.js'
import Chico, { chicoStateFromSavings, chicoLine } from '../components/Chico.jsx'

const DREAM_TARGETS = [
  { id: 'boracay',   emoji: '🏝',  label: 'Boracay trip',      target: 45000 },
  { id: 'iphone',    emoji: '📱',  label: 'New phone',          target: 65000 },
  { id: 'emergency', emoji: '🛟',  label: 'Emergency fund',     target: 180000 },
  { id: 'japan',     emoji: '⛩',  label: 'Japan trip',         target: 120000 },
]

function greeting(name) {
  const h = new Date().getHours()
  const part = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'
  return `Good ${part}, ${name}!`
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

function AddSavingsSheet({ palette: p, onSave, onCancel }) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const valid = Number(amount) > 0

  return (
    <>
      <div onClick={onCancel} style={{
        position: 'absolute', inset: 0, background: 'rgba(20,15,8,0.45)',
        zIndex: 200, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 201,
        background: p.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '12px 20px 28px',
        animation: 'sheet-up .28s cubic-bezier(.2,.8,.3,1)',
        fontFamily: CT_TYPE.sans, color: p.ink,
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: p.line, margin: '0 auto 16px' }} />
        <div style={{ fontFamily: CT_TYPE.serif, fontSize: 24, marginBottom: 16 }}>Log a saving</div>

        {/* Amount */}
        <div style={{
          marginBottom: 12, padding: '14px 16px', borderRadius: 14,
          background: p.bgCard, border: `1px solid ${p.line}`,
        }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Amount saved
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 26, color: p.inkSoft, fontFamily: CT_TYPE.serif }}>₱</span>
            <input
              type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0" autoFocus
              style={{
                flex: 1, border: 'none', background: 'transparent',
                fontSize: 36, fontFamily: CT_TYPE.serif, color: p.ink,
                outline: 'none', padding: 0, minWidth: 0,
              }}
            />
          </div>
        </div>

        {/* Note */}
        <div style={{
          marginBottom: 12, padding: '12px 16px', borderRadius: 14,
          background: p.bgCard, border: `1px solid ${p.line}`,
        }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Note (optional)
          </div>
          <input
            type="text" value={note} onChange={e => setNote(e.target.value)}
            placeholder="e.g. Salary, Bonus, Freelance"
            style={{
              width: '100%', border: 'none', background: 'transparent',
              fontSize: 16, fontFamily: CT_TYPE.sans, color: p.ink, outline: 'none', padding: 0,
            }}
          />
        </div>

        {/* Date */}
        <div style={{
          marginBottom: 20, padding: '12px 16px', borderRadius: 14,
          background: p.bgCard, border: `1px solid ${p.line}`,
        }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Date
          </div>
          <input
            type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{
              width: '100%', border: 'none', background: 'transparent',
              fontSize: 16, fontFamily: CT_TYPE.sans, color: p.ink, outline: 'none', padding: 0,
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: 'transparent', border: `1px solid ${p.line}`,
            color: p.ink, fontSize: 14, cursor: 'pointer',
          }}>Cancel</button>
          <button
            disabled={!valid}
            onClick={() => valid && onSave({
              id: Date.now().toString(),
              amount: Number(amount),
              note: note.trim(),
              date,
            })}
            style={{
              flex: 2, padding: '14px', borderRadius: 12,
              background: valid ? CT_SEMANTIC.win : p.line,
              border: 'none', color: '#fff',
              fontSize: 14, fontWeight: 600, cursor: valid ? 'pointer' : 'default',
            }}>
            Save ₱{Number(amount) > 0 ? Number(amount).toLocaleString('en-PH') : '—'}
          </button>
        </div>
      </div>
    </>
  )
}

export default function FeedChicoScreen({
  palette: p, name, income, savingsPct, monthly,
  savingsLog = [],
  onAddEntry, onRemoveEntry,
  onGoSlider, onGoDreams, onGoCoach,
  className,
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [activeDreamId, setActiveDreamId] = useState(DREAM_TARGETS[0].id)

  const totalSaved = savingsLog.reduce((s, e) => s + e.amount, 0)
  const animTotal = useCountTo(totalSaved, 600)

  // Chico state: how close is total saved to 6 months of monthly plan
  const chicoTarget = monthly * 6
  const chicoPct = chicoTarget > 0 ? Math.min(totalSaved / chicoTarget, 1) * 0.6 : 0
  const chicoState = chicoStateFromSavings(chicoPct)
  const line = chicoLine(chicoState, 0)

  const activeDream = DREAM_TARGETS.find(d => d.id === activeDreamId) || DREAM_TARGETS[0]
  const dreamProgress = activeDream.target > 0 ? Math.min(1, totalSaved / activeDream.target) : 0
  const monthsLeft = monthly > 0 && totalSaved < activeDream.target
    ? Math.ceil((activeDream.target - totalSaved) / monthly)
    : 0

  const handleAdd = (entry) => {
    onAddEntry(entry)
    setShowAdd(false)
  }

  const today = new Date().toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div className={className} style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Header */}
      <div style={{
        padding: '16px 20px 8px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ fontFamily: CT_TYPE.serif, fontSize: 26, lineHeight: 1.1, color: p.ink }}>
            {greeting(name)} 🐒
          </div>
          <div style={{ fontSize: 12, color: p.inkMuted, marginTop: 3 }}>{today}</div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 12, background: CT_SEMANTIC.amber,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: CT_TYPE.serif, fontSize: 20, fontWeight: 600, flexShrink: 0,
        }}>C</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px' }}>

        {/* Chico + speech */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <Chico state={chicoState} size={110} />
          <div style={{
            flex: 1, padding: '12px 14px', borderRadius: 14,
            background: p.bgCard, border: `1px solid ${p.line}`,
            fontSize: 14, color: p.ink, fontStyle: 'italic', lineHeight: 1.4,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', left: -7, top: '50%', transform: 'translateY(-50%) rotate(45deg)',
              width: 12, height: 12, background: p.bgCard,
              borderLeft: `1px solid ${p.line}`, borderBottom: `1px solid ${p.line}`,
            }} />
            "{line}"
          </div>
        </div>

        {/* Total saved card */}
        <div style={{
          padding: '16px', borderRadius: 14, background: p.bgCard,
          border: `1px solid ${p.line}`, marginBottom: 12,
        }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
            Total saved
          </div>
          <div style={{
            fontFamily: CT_TYPE.serif, fontSize: 42, color: p.ink, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5, marginTop: 4,
          }}>
            ₱{Math.round(animTotal).toLocaleString('en-PH')}
          </div>

          {/* Dream progress */}
          <div style={{ marginTop: 14, borderTop: `1px dashed ${p.line}`, paddingTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
                {DREAM_TARGETS.map(d => (
                  <button key={d.id} onClick={() => setActiveDreamId(d.id)} style={{
                    flexShrink: 0, fontSize: 18, width: 32, height: 32, borderRadius: 8,
                    border: `1px solid ${activeDreamId === d.id ? p.ink : p.line}`,
                    background: activeDreamId === d.id ? p.ink : 'transparent',
                    cursor: 'pointer',
                  }}>{d.emoji}</button>
                ))}
              </div>
              <span style={{ fontSize: 12, color: p.inkSoft, whiteSpace: 'nowrap' }}>
                {activeDream.label}
              </span>
            </div>
            {/* Progress bar */}
            <div style={{ height: 8, borderRadius: 4, background: p.line, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, dreamProgress * 100)}%`,
                background: CT_SEMANTIC.dream,
                borderRadius: 4,
                transition: 'width .6s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: CT_SEMANTIC.dream, fontWeight: 600 }}>
                {Math.round(dreamProgress * 100)}% of ₱{activeDream.target.toLocaleString('en-PH')}
              </span>
              <span style={{ fontSize: 11, color: p.inkMuted }}>
                {monthsLeft > 0 ? `~${monthsLeft} months left` : totalSaved >= activeDream.target ? '🎉 Reached!' : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Savings log */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Savings log
          </div>

          {savingsLog.length === 0 ? (
            <div style={{
              padding: '24px 16px', borderRadius: 14,
              border: `1.5px dashed ${p.line}`, background: 'transparent',
              textAlign: 'center', color: p.inkMuted, fontSize: 13, lineHeight: 1.5,
            }}>
              No savings logged yet.<br />Tap "+ Log savings" below to start!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {savingsLog.map(entry => (
                <div key={entry.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px', borderRadius: 12,
                  background: p.bgCard, border: `1px solid ${p.line}`,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: CT_SEMANTIC.winSoft,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, flexShrink: 0,
                  }}>💰</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: p.ink, fontVariantNumeric: 'tabular-nums' }}>
                      +₱{entry.amount.toLocaleString('en-PH')}
                    </div>
                    <div style={{ fontSize: 11, color: p.inkMuted, marginTop: 1 }}>
                      {formatDate(entry.date)}{entry.note ? ` · ${entry.note}` : ''}
                    </div>
                  </div>
                  <button onClick={() => onRemoveEntry(entry.id)} style={{
                    border: 'none', background: 'transparent', color: p.inkMuted,
                    fontSize: 20, cursor: 'pointer', padding: '4px 6px', lineHeight: 1,
                    borderRadius: 6,
                  }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ height: 8 }} />
      </div>

      {/* Bottom actions */}
      <div style={{ padding: '10px 20px 16px', borderTop: `1px solid ${p.line}` }}>
        {/* Log savings CTA */}
        <button onClick={() => setShowAdd(true)} style={{
          width: '100%', padding: '15px', borderRadius: 12,
          background: CT_SEMANTIC.win, border: 'none', color: '#fff',
          fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 10,
          fontFamily: CT_TYPE.sans,
        }}>
          + Log savings
        </button>

        {/* Nav row */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onGoSlider} style={{
            flex: 1, padding: '11px 6px', borderRadius: 10,
            background: 'transparent', border: `1px solid ${p.line}`,
            color: p.inkSoft, fontSize: 12, cursor: 'pointer', fontFamily: CT_TYPE.sans,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <span style={{ fontSize: 16 }}>💰</span>
            <span>Savings</span>
          </button>
          <button onClick={onGoDreams} style={{
            flex: 1, padding: '11px 6px', borderRadius: 10,
            background: 'transparent', border: `1px solid ${p.line}`,
            color: p.inkSoft, fontSize: 12, cursor: 'pointer', fontFamily: CT_TYPE.sans,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <span style={{ fontSize: 16 }}>🌟</span>
            <span>Dreams</span>
          </button>
          <button onClick={onGoCoach} style={{
            flex: 1, padding: '11px 6px', borderRadius: 10,
            background: 'transparent', border: `1px solid ${p.line}`,
            color: p.inkSoft, fontSize: 12, cursor: 'pointer', fontFamily: CT_TYPE.sans,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <span style={{ fontSize: 16 }}>🐒</span>
            <span>Talk to Chico</span>
          </button>
        </div>
      </div>

      {showAdd && (
        <AddSavingsSheet palette={p} onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      )}
    </div>
  )
}
