import { useState } from 'react'
import { CT_TYPE, CT_SEMANTIC } from '../tokens.js'
import CTHeader from '../components/ui/CTHeader.jsx'
import CTButton from '../components/ui/CTButton.jsx'
import Chico, { chicoStateFromSavings } from '../components/Chico.jsx'
import { BubbleEditSheet } from '../components/Bubbles.jsx'

export default function CoachScreen({
  palette, income, savingsPct, onSavingsChange,
  allocations, onAddAllocation, onRemoveAllocation,
  onBack, className,
}) {
  const p = palette
  const takeHome = Math.round(income * 0.84)
  const allocTotal = allocations.reduce((s, a) => s + a.amount, 0)
  const remaining = Math.max(0, takeHome - allocTotal)
  const savingsAmt = Math.round(remaining * savingsPct)
  const truePct = takeHome > 0 ? savingsAmt / takeHome : 0
  const state = chicoStateFromSavings(truePct)

  const [messages, setMessages] = useState([
    { from: 'chico', text: "Hey, real talk. Want to plan how we hit your goal?" },
  ])
  const [showAdjuster, setShowAdjuster] = useState(false)
  const [adjusting, setAdjusting] = useState(null)
  const [creating, setCreating] = useState(false)

  const log = (msg) => setMessages(m => [...m, msg])
  const ask = (q) => {
    log({ from: 'me', text: q.label })
    setTimeout(() => log({ from: 'chico', text: q.reply }), 350)
  }

  const QUICK = [
    { label: "Can I hit ₱100k this year?",
      reply: takeHome * 12 * 0.18 >= 100000
        ? `At your pace, ₱${(savingsAmt * 12).toLocaleString()}/yr. You're on track. 🍌`
        : `Right now: ₱${(savingsAmt * 12).toLocaleString()}/yr. Need to bump savings ~5% or trim a bubble.` },
    { label: "What should I cut first?",
      reply: allocations.length === 0
        ? "Nothing to cut yet — add some expenses first."
        : `Honestly? '${[...allocations].sort((a, b) => b.amount - a.amount)[0].label}' is your biggest one. Worth a look.` },
    { label: "I got a raise!",
      reply: "Niiice. Tap 'Adjust budget' → bump up your savings rate." },
    { label: "Surprise expense came up",
      reply: "Happens. Tap 'Adjust budget' to add or edit an expense." },
  ]

  return (
    <div className={className} style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0,
      position: 'relative',
    }}>
      <CTHeader palette={p} title="Talk to Chico" onBack={onBack} />

      {/* Chico header card */}
      <div style={{
        margin: '4px 20px 0', padding: '12px 14px', borderRadius: 14,
        background: p.bgCard, border: `1px solid ${p.line}`,
        display: 'flex', gap: 12, alignItems: 'center',
      }}>
        <Chico state={state} size={64} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
            Saving rate
          </div>
          <div style={{ fontFamily: CT_TYPE.serif, fontSize: 26, color: p.ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(truePct * 100)}%
          </div>
          <div style={{ fontSize: 12, color: p.inkSoft, marginTop: 3 }}>
            ₱{savingsAmt.toLocaleString()}/mo · ₱{(savingsAmt * 12).toLocaleString()}/yr
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div style={{
        flex: 1, overflow: 'auto', padding: '12px 20px',
        display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0,
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start',
            maxWidth: '82%', padding: '9px 13px', borderRadius: 16,
            background: m.from === 'me' ? p.ink : p.bgCard,
            color: m.from === 'me' ? p.bg : p.ink,
            border: m.from === 'me' ? 'none' : `1px solid ${p.line}`,
            fontSize: 13, lineHeight: 1.45,
            borderBottomRightRadius: m.from === 'me' ? 4 : 16,
            borderBottomLeftRadius: m.from === 'me' ? 16 : 4,
          }}>{m.text}</div>
        ))}
      </div>

      {/* Quick replies */}
      <div style={{ padding: '0 20px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {QUICK.map((q, i) => (
          <button key={i} onClick={() => ask(q)} style={{
            padding: '7px 12px', borderRadius: 999,
            background: 'transparent', border: `1px solid ${p.line}`,
            color: p.ink, fontSize: 11, cursor: 'pointer', fontFamily: CT_TYPE.sans,
          }}>{q.label}</button>
        ))}
      </div>

      {/* Adjust + back */}
      <div style={{ padding: '0 20px 8px', display: 'flex', gap: 8 }}>
        <button onClick={() => setShowAdjuster(true)} style={{
          flex: 1, padding: '12px', borderRadius: 12,
          background: 'transparent', border: `1px solid ${p.line}`,
          color: p.ink, fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>⚡ Adjust budget</button>
        <CTButton palette={p} label="Done →" onClick={onBack} />
      </div>
      <div style={{ height: 4 }} />

      {/* Budget adjuster sheet */}
      {showAdjuster && (
        <BudgetAdjusterSheet
          palette={p}
          allocations={allocations}
          savingsPct={savingsPct}
          onSavingsChange={onSavingsChange}
          onEditAlloc={(a) => setAdjusting(a)}
          onAddNew={() => setCreating(true)}
          onRemove={onRemoveAllocation}
          onClose={() => setShowAdjuster(false)} />
      )}
      {adjusting && (
        <BubbleEditSheet palette={p} bubble={{ ...adjusting, mode: 'edit' }}
          onSave={(u) => { onAddAllocation(u); setAdjusting(null) }}
          onCancel={() => setAdjusting(null)} />
      )}
      {creating && (
        <BubbleEditSheet palette={p} bubble={{ id: 'custom-' + Date.now(), emoji: '✨', label: 'New expense', amount: 2000, color: '#7C4DFF', mode: 'create' }}
          onSave={(u) => { onAddAllocation(u); setCreating(false) }}
          onCancel={() => setCreating(false)} />
      )}
    </div>
  )
}

function BudgetAdjusterSheet({ palette: p, allocations, savingsPct, onSavingsChange, onEditAlloc, onAddNew, onRemove, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(20,15,8,0.45)',
        zIndex: 200, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 201,
        background: p.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '12px 20px 24px',
        animation: 'sheet-up .28s cubic-bezier(.2,.8,.3,1)',
        maxHeight: '85%', overflow: 'auto',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: p.line, margin: '0 auto 14px' }} />
        <div style={{ fontFamily: CT_TYPE.serif, fontSize: 22, color: p.ink, marginBottom: 4 }}>
          Adjust on the fly
        </div>
        <div style={{ fontSize: 12, color: p.inkSoft, marginBottom: 14, lineHeight: 1.4 }}>
          Got a bonus or a surprise bill? Tweak expenses or shift your savings rate.
        </div>

        {/* Savings slider */}
        <div style={{ padding: '12px 14px', borderRadius: 12, background: p.bgCard, border: `1px solid ${p.line}`, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Savings rate</span>
            <span style={{ fontFamily: CT_TYPE.serif, fontSize: 20, color: CT_SEMANTIC.win, fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(savingsPct * 100)}%
            </span>
          </div>
          <input type="range" min={0} max={0.6} step={0.01} value={savingsPct}
            onChange={(e) => onSavingsChange(Number(e.target.value))}
            style={{ width: '100%', marginTop: 8, accentColor: CT_SEMANTIC.win }} />
        </div>

        {/* Expense list */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
            Your expenses
          </div>
          <button onClick={onAddNew} style={{
            padding: '5px 12px', borderRadius: 999,
            border: `1px solid ${p.ink}`, background: 'transparent',
            color: p.ink, fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}>+ Add expense</button>
        </div>

        {allocations.length === 0 ? (
          <div style={{ fontSize: 12, color: p.inkMuted, padding: '14px', textAlign: 'center', border: `1.5px dashed ${p.line}`, borderRadius: 12 }}>
            No expenses yet — tap "+ Add expense" to start.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {allocations.map(a => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 12,
                background: p.bgCard, border: `1px solid ${p.line}`,
              }}>
                <span style={{ fontSize: 20 }}>{a.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: p.ink }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: a.color, fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
                    ₱{a.amount.toLocaleString()}/mo
                  </div>
                </div>
                <button onClick={() => onEditAlloc(a)} style={{
                  padding: '5px 10px', borderRadius: 999, border: `1px solid ${p.line}`,
                  background: 'transparent', color: p.ink, fontSize: 11, cursor: 'pointer',
                }}>Edit</button>
                <button onClick={() => onRemove(a.id)} style={{
                  border: 'none', background: 'transparent', color: p.inkMuted,
                  fontSize: 18, cursor: 'pointer', padding: 4,
                }}>×</button>
              </div>
            ))}
          </div>
        )}

        <button onClick={onClose} style={{
          width: '100%', marginTop: 16, padding: '13px', borderRadius: 12,
          background: p.ink, border: 'none', color: p.bg,
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>Done</button>
      </div>
    </>
  )
}
