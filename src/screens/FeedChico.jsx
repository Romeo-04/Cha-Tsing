import { useState, useMemo } from 'react'
import { CT_TYPE, CT_SEMANTIC, CT_FONTS, CT_THEME_META, useCountTo } from '../tokens.js'
import Chico, { chicoStateFromSavings, chicoLine } from '../components/Chico.jsx'

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

function getThisMonth(entries) {
  const now = new Date()
  return entries.filter(e => {
    const d = new Date(e.date)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
}

const DEFAULT_CATEGORIES = [
  { id: 'food',      emoji: '🍜', label: 'Food' },
  { id: 'transport', emoji: '🚌', label: 'Transport' },
  { id: 'shopping',  emoji: '🛍', label: 'Shopping' },
  { id: 'bills',     emoji: '📋', label: 'Bills' },
  { id: 'fun',       emoji: '🎉', label: 'Fun' },
  { id: 'rent',      emoji: '🏠', label: 'Rent' },
  { id: 'other',     emoji: '💳', label: 'Other' },
]

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
        boxShadow: '0 -8px 40px rgba(42,31,18,0.2)',
        animation: 'sheet-up .28s cubic-bezier(.2,.8,.3,1)',
        fontFamily: CT_TYPE.sans, color: p.ink,
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: p.line, margin: '0 auto 16px' }} />
        <div style={{ fontFamily: CT_TYPE.serif, fontSize: 24, marginBottom: 16 }}>Log a saving</div>

        <div style={{ marginBottom: 12, padding: '14px 16px', borderRadius: 14, background: p.bgCard, border: `1px solid ${p.line}`, boxShadow: '0 2px 8px rgba(42,31,18,0.07)' }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Amount saved</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 26, color: p.inkSoft, fontFamily: CT_TYPE.serif }}>₱</span>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0" autoFocus
              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 36, fontFamily: CT_TYPE.serif, color: p.ink, outline: 'none', padding: 0, minWidth: 0 }} />
          </div>
        </div>

        <div style={{ marginBottom: 12, padding: '12px 16px', borderRadius: 14, background: p.bgCard, border: `1px solid ${p.line}`, boxShadow: '0 2px 8px rgba(42,31,18,0.07)' }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Note (optional)</div>
          <input type="text" value={note} onChange={e => setNote(e.target.value)}
            placeholder="e.g. Salary, Bonus, Freelance"
            style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 16, fontFamily: CT_TYPE.sans, color: p.ink, outline: 'none', padding: 0 }} />
        </div>

        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 14, background: p.bgCard, border: `1px solid ${p.line}`, boxShadow: '0 2px 8px rgba(42,31,18,0.07)' }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Date</div>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 16, fontFamily: CT_TYPE.sans, color: p.ink, outline: 'none', padding: 0 }} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '14px', borderRadius: 12, background: 'transparent', border: `1px solid ${p.line}`, color: p.ink, fontSize: 14, cursor: 'pointer' }}>
            Cancel
          </button>
          <button disabled={!valid}
            onClick={() => valid && onSave({ id: Date.now().toString(), amount: Number(amount), note: note.trim(), date })}
            style={{ flex: 2, padding: '14px', borderRadius: 12, background: valid ? CT_SEMANTIC.win : p.line, boxShadow: valid ? '0 4px 16px rgba(34,160,107,0.3)' : 'none', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: valid ? 'pointer' : 'default' }}>
            Save ₱{Number(amount) > 0 ? Number(amount).toLocaleString('en-PH') : '—'}
          </button>
        </div>
      </div>
    </>
  )
}

function AddSpendingSheet({ palette: p, allocations = [], onSave, onCancel }) {
  const cats = allocations.length > 0
    ? allocations.map(a => ({ id: a.id, emoji: a.emoji || '💳', label: a.label }))
    : DEFAULT_CATEGORIES
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(cats[0]?.id || 'other')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const valid = Number(amount) > 0
  const selectedCat = cats.find(c => c.id === category) || cats[0]

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
        boxShadow: '0 -8px 40px rgba(42,31,18,0.2)',
        animation: 'sheet-up .28s cubic-bezier(.2,.8,.3,1)',
        fontFamily: CT_TYPE.sans, color: p.ink,
        maxHeight: '85%', overflow: 'auto',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: p.line, margin: '0 auto 16px' }} />
        <div style={{ fontFamily: CT_TYPE.serif, fontSize: 24, marginBottom: 16 }}>Log spending</div>

        <div style={{ marginBottom: 12, padding: '14px 16px', borderRadius: 14, background: p.bgCard, border: `1px solid ${p.line}`, boxShadow: '0 2px 8px rgba(42,31,18,0.07)' }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Amount spent</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 26, color: p.inkSoft, fontFamily: CT_TYPE.serif }}>₱</span>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0" autoFocus
              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 36, fontFamily: CT_TYPE.serif, color: p.ink, outline: 'none', padding: 0, minWidth: 0 }} />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Category</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {cats.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)} style={{
                padding: '6px 12px', borderRadius: 20, cursor: 'pointer',
                border: `1.5px solid ${category === c.id ? p.ink : p.line}`,
                background: category === c.id ? p.ink : p.bgCard,
                color: category === c.id ? p.bg : p.ink,
                fontSize: 12, fontFamily: CT_TYPE.sans,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span>{c.emoji}</span><span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 12, padding: '12px 16px', borderRadius: 14, background: p.bgCard, border: `1px solid ${p.line}`, boxShadow: '0 2px 8px rgba(42,31,18,0.07)' }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Note (optional)</div>
          <input type="text" value={note} onChange={e => setNote(e.target.value)}
            placeholder="e.g. Jollibee, Grab, groceries"
            style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 16, fontFamily: CT_TYPE.sans, color: p.ink, outline: 'none', padding: 0 }} />
        </div>

        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 14, background: p.bgCard, border: `1px solid ${p.line}`, boxShadow: '0 2px 8px rgba(42,31,18,0.07)' }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Date</div>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 16, fontFamily: CT_TYPE.sans, color: p.ink, outline: 'none', padding: 0 }} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '14px', borderRadius: 12, background: 'transparent', border: `1px solid ${p.line}`, color: p.ink, fontSize: 14, cursor: 'pointer' }}>
            Cancel
          </button>
          <button disabled={!valid}
            onClick={() => valid && onSave({
              id: Date.now().toString(),
              amount: Number(amount),
              category: selectedCat.id,
              categoryLabel: selectedCat.label,
              categoryEmoji: selectedCat.emoji,
              note: note.trim(),
              date,
            })}
            style={{ flex: 2, padding: '14px', borderRadius: 12, background: valid ? CT_SEMANTIC.danger : p.line, boxShadow: valid ? '0 4px 16px rgba(229,75,60,0.3)' : 'none', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: valid ? 'pointer' : 'default' }}>
            Log -₱{Number(amount) > 0 ? Number(amount).toLocaleString('en-PH') : '—'}
          </button>
        </div>
      </div>
    </>
  )
}

function SettingsSheet({ palette: p, themeKey, onThemeChange, fontChoice, onFontChange, onGoIncomeSetup, onClose }) {
  const isDark = themeKey === 'midnight'

  const toggleDark = () => {
    onThemeChange(isDark ? 'cream' : 'midnight')
  }

  const lightThemes = Object.entries(CT_THEME_META).filter(([, m]) => !m.dark)
  const fonts = Object.entries(CT_FONTS)

  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(20,15,8,0.5)',
        zIndex: 200, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 201,
        background: p.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '12px 20px 32px',
        boxShadow: '0 -8px 40px rgba(42,31,18,0.22)',
        animation: 'sheet-up .28s cubic-bezier(.2,.8,.3,1)',
        fontFamily: CT_TYPE.sans, color: p.ink,
        maxHeight: '88%', overflow: 'auto',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: p.line, margin: '0 auto 18px' }} />
        <div style={{ fontFamily: CT_TYPE.serif, fontSize: 24, marginBottom: 22 }}>Settings</div>

        {/* Re-setup earnings */}
        <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Profile
        </div>
        <button onClick={() => { onClose(); onGoIncomeSetup() }} style={{
          width: '100%', padding: '14px 16px', borderRadius: 14,
          background: p.bgCard, border: `1px solid ${p.line}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer', marginBottom: 22,
          fontFamily: CT_TYPE.sans, color: p.ink, fontSize: 14, textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>💰</span>
            <div>
              <div style={{ fontWeight: 600 }}>Update monthly earnings</div>
              <div style={{ fontSize: 11, color: p.inkMuted, marginTop: 2 }}>Change your income for this month</div>
            </div>
          </div>
          <span style={{ color: p.inkMuted, fontSize: 18 }}>›</span>
        </button>

        {/* Dark mode */}
        <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Appearance
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', borderRadius: 14,
          background: p.bgCard, border: `1px solid ${p.line}`,
          marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>{isDark ? '🌙' : '☀️'}</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Dark mode</span>
          </div>
          <button onClick={toggleDark} style={{
            width: 48, height: 28, borderRadius: 14,
            background: isDark ? CT_SEMANTIC.win : p.line,
            border: 'none', cursor: 'pointer', position: 'relative',
            transition: 'background .2s',
            flexShrink: 0,
          }}>
            <div style={{
              position: 'absolute', top: 3,
              left: isDark ? 23 : 3,
              width: 22, height: 22, borderRadius: 11,
              background: '#fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
              transition: 'left .2s',
            }} />
          </button>
        </div>

        {/* Theme (light only) */}
        {!isDark && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
            {lightThemes.map(([key, meta]) => {
              const active = themeKey === key
              return (
                <button key={key} onClick={() => onThemeChange(key)} style={{
                  flex: 1, padding: '14px 6px', borderRadius: 14,
                  background: meta.swatch,
                  border: `2px solid ${active ? p.ink : 'transparent'}`,
                  boxShadow: active ? `0 0 0 2px ${p.ink}44, 0 4px 12px rgba(0,0,0,0.1)` : '0 2px 8px rgba(0,0,0,0.08)',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  transition: 'border .15s, box-shadow .15s',
                }}>
                  {active && <span style={{ fontSize: 13 }}>✓</span>}
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#2A1F12', fontFamily: CT_TYPE.sans }}>
                    {meta.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Font */}
        <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Font
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
          {fonts.map(([key, f]) => {
            const active = fontChoice === key
            return (
              <button key={key} onClick={() => onFontChange(key)} style={{
                padding: '13px 16px', borderRadius: 12,
                background: active ? p.ink : p.bgCard,
                border: `1.5px solid ${active ? p.ink : p.line}`,
                color: active ? p.bg : p.ink,
                cursor: 'pointer', textAlign: 'left',
                fontSize: 16, fontFamily: f.stack,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'background .15s, color .15s',
              }}>
                <span>{f.label}</span>
                {active && <span style={{ fontSize: 13, fontFamily: CT_TYPE.sans }}>✓</span>}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default function FeedChicoScreen({
  palette: p, name, income, savingsPct, monthly,
  savingsLog = [], spendingLog = [],
  allocations = [],
  activeDreamId, dreams = [],
  dreamProgress = {},
  onAddEntry, onRemoveEntry,
  onAddSpend, onRemoveSpend,
  onGoSlider, onGoDreams, onGoCoach, onGoBudget, onGoIncomeSetup,
  themeKey, onThemeChange, fontChoice, onFontChange,
  className,
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [showSpend, setShowSpend] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const totalSaved = savingsLog.reduce((s, e) => s + e.amount, 0)
  const animTotal = useCountTo(totalSaved, 600)

  const thisMonthSaved = getThisMonth(savingsLog).reduce((s, e) => s + e.amount, 0)
  const thisMonthSpent = getThisMonth(spendingLog).reduce((s, e) => s + e.amount, 0)
  const thisMonthNet = thisMonthSaved - thisMonthSpent

  const chicoTarget = monthly * 6
  const chicoPct = chicoTarget > 0 ? Math.min(totalSaved / chicoTarget, 1) * 0.6 : 0
  const chicoState = chicoStateFromSavings(chicoPct)
  const line = chicoLine(chicoState, 0)

  const activeDream = dreams.find(d => d.id === activeDreamId) || dreams[0]
  const dreamPct = Math.min(1, dreamProgress[activeDreamId] || 0)
  const isGoalReached = dreamPct >= 1
  const dreamSaved = activeDream ? Math.round(activeDream.target * dreamPct) : 0
  const monthsLeft = activeDream && monthly > 0 && !isGoalReached
    ? Math.ceil((activeDream.target - dreamSaved) / monthly)
    : 0

  const activity = useMemo(() => [
    ...savingsLog.map(e => ({ ...e, type: 'save' })),
    ...spendingLog.map(e => ({ ...e, type: 'spend' })),
  ].sort((a, b) => {
    const diff = new Date(b.date) - new Date(a.date)
    return diff !== 0 ? diff : Number(b.id) - Number(a.id)
  }), [savingsLog, spendingLog])

  const handleAdd = (entry) => { onAddEntry(entry); setShowAdd(false) }
  const handleAddSpend = (entry) => { onAddSpend(entry); setShowSpend(false) }

  const today = new Date().toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div className={className} style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Header */}
      <div style={{
        padding: '16px 20px 14px',
        background: `linear-gradient(180deg, ${p.bgCard} 0%, ${p.bg} 100%)`,
        borderBottom: `1px solid ${p.line}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ fontFamily: CT_TYPE.serif, fontSize: 26, lineHeight: 1.1, color: p.ink }}>
            {greeting(name)} 🐒
          </div>
          <div style={{ fontSize: 12, color: p.inkMuted, marginTop: 3 }}>{today}</div>
        </div>
        <button onClick={() => setShowSettings(true)} style={{
          width: 38, height: 38, borderRadius: 12,
          background: 'linear-gradient(135deg, #C9854A, #E8A05A)',
          boxShadow: '0 4px 14px rgba(201,133,74,0.45), 0 1px 3px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0, lineHeight: 1,
          border: 'none', cursor: 'pointer',
        }}>🐒</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px' }}>

        {/* Chico + speech */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, marginBottom: 16 }}>
          <Chico state={chicoState} size={110} />
          <div style={{
            flex: 1, padding: '12px 14px', borderRadius: 14,
            background: p.bgCard, border: `1px solid ${p.line}`,
            boxShadow: '0 3px 12px rgba(42,31,18,0.08)',
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

        {/* Summary card */}
        <div style={{
          padding: '16px', borderRadius: 18,
          background: `linear-gradient(135deg, ${p.bgCard} 0%, #FFF3E0 100%)`,
          border: `1px solid ${p.line}`,
          boxShadow: '0 4px 20px rgba(42,31,18,0.1)',
          marginBottom: 12,
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

          {/* This month row */}
          <div style={{
            display: 'flex', gap: 0, marginTop: 12,
            borderRadius: 12, overflow: 'hidden',
            border: `1px solid ${p.line}`,
          }}>
            <div style={{ flex: 1, padding: '10px 8px', textAlign: 'center', background: 'rgba(34,160,107,0.07)' }}>
              <div style={{ fontSize: 10, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>Saved</div>
              <div style={{ fontFamily: CT_TYPE.serif, fontSize: 15, color: CT_SEMANTIC.win, fontVariantNumeric: 'tabular-nums' }}>
                +₱{thisMonthSaved.toLocaleString('en-PH')}
              </div>
            </div>
            <div style={{ width: 1, background: p.line }} />
            <div style={{ flex: 1, padding: '10px 8px', textAlign: 'center', background: 'rgba(229,75,60,0.06)' }}>
              <div style={{ fontSize: 10, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>Spent</div>
              <div style={{ fontFamily: CT_TYPE.serif, fontSize: 15, color: CT_SEMANTIC.danger, fontVariantNumeric: 'tabular-nums' }}>
                -₱{thisMonthSpent.toLocaleString('en-PH')}
              </div>
            </div>
            <div style={{ width: 1, background: p.line }} />
            <div style={{ flex: 1, padding: '10px 8px', textAlign: 'center', background: `rgba(${thisMonthNet >= 0 ? '34,160,107' : '229,75,60'},0.06)` }}>
              <div style={{ fontSize: 10, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>Net</div>
              <div style={{ fontFamily: CT_TYPE.serif, fontSize: 15, fontVariantNumeric: 'tabular-nums', color: thisMonthNet >= 0 ? CT_SEMANTIC.win : CT_SEMANTIC.danger }}>
                {thisMonthNet >= 0 ? '+' : ''}₱{thisMonthNet.toLocaleString('en-PH')}
              </div>
            </div>
          </div>

          {/* Dream progress */}
          {activeDream && (
            <div style={{ marginTop: 14, borderTop: `1px dashed ${p.line}`, paddingTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{activeDream.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: p.ink }}>{activeDream.label}</div>
                  <div style={{ fontSize: 11, color: p.inkMuted }}>Goal: ₱{activeDream.target.toLocaleString('en-PH')}</div>
                </div>
                <button onClick={onGoDreams} style={{
                  padding: '4px 10px', borderRadius: 999,
                  border: `1px solid ${p.line}`, background: 'transparent',
                  color: p.inkSoft, fontSize: 10, cursor: 'pointer', whiteSpace: 'nowrap',
                }}>Change</button>
              </div>

              <div style={{ height: 10, borderRadius: 5, background: p.line, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${Math.min(100, dreamPct * 100)}%`,
                  background: isGoalReached
                    ? `linear-gradient(90deg, ${CT_SEMANTIC.win}, #34D399)`
                    : `linear-gradient(90deg, ${CT_SEMANTIC.dream}, #9B6FFF)`,
                  borderRadius: 5, transition: 'width .8s cubic-bezier(.2,.8,.3,1)',
                  boxShadow: isGoalReached ? '0 0 8px rgba(34,160,107,0.5)' : '0 0 8px rgba(124,77,255,0.4)',
                }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
                <span style={{ fontSize: 11, color: isGoalReached ? CT_SEMANTIC.win : CT_SEMANTIC.dream, fontWeight: 700 }}>
                  {Math.round(dreamPct * 100)}% of ₱{activeDream.target.toLocaleString('en-PH')}
                </span>
                <span style={{ fontSize: 11, color: p.inkMuted }}>
                  {isGoalReached ? '🎉 Reached!' : monthsLeft > 0 ? `~${monthsLeft} month${monthsLeft !== 1 ? 's' : ''} left` : monthly === 0 ? 'Set your savings rate' : '—'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Activity log */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Activity
          </div>

          {activity.length === 0 ? (
            <div style={{
              padding: '24px 16px', borderRadius: 14,
              border: `1.5px dashed ${p.line}`, background: 'transparent',
              textAlign: 'center', color: p.inkMuted, fontSize: 13, lineHeight: 1.5,
            }}>
              No activity yet.<br />Log your savings or spending below!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {activity.map(entry => {
                const isSave = entry.type === 'save'
                return (
                  <div key={`${entry.type}-${entry.id}`} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px', borderRadius: 12,
                    background: p.bgCard, border: `1px solid ${p.line}`,
                    boxShadow: '0 2px 8px rgba(42,31,18,0.06)',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: isSave ? CT_SEMANTIC.winSoft : CT_SEMANTIC.dangerSoft,
                      boxShadow: isSave ? '0 2px 6px rgba(34,160,107,0.2)' : '0 2px 6px rgba(229,75,60,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, flexShrink: 0,
                    }}>
                      {isSave ? '💰' : (entry.categoryEmoji || '💸')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: isSave ? CT_SEMANTIC.win : CT_SEMANTIC.danger, fontVariantNumeric: 'tabular-nums' }}>
                          {isSave ? '+' : '-'}₱{entry.amount.toLocaleString('en-PH')}
                        </span>
                        {!isSave && entry.categoryLabel && (
                          <span style={{ fontSize: 11, color: p.inkSoft }}>{entry.categoryLabel}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: p.inkMuted, marginTop: 1 }}>
                        {formatDate(entry.date)}{entry.note ? ` · ${entry.note}` : ''}
                      </div>
                    </div>
                    <button
                      onClick={() => isSave ? onRemoveEntry(entry.id) : onRemoveSpend(entry.id)}
                      style={{ border: 'none', background: 'transparent', color: p.inkMuted, fontSize: 20, cursor: 'pointer', padding: '4px 6px', lineHeight: 1, borderRadius: 6 }}>
                      ×
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div style={{ height: 8 }} />
      </div>

      {/* Bottom actions */}
      <div style={{
        padding: '10px 20px 16px',
        borderTop: `1px solid ${p.line}`,
        background: `linear-gradient(180deg, ${p.bg} 0%, ${p.bgCard} 100%)`,
      }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <button onClick={() => setShowAdd(true)} style={{
            flex: 1, padding: '13px', borderRadius: 14,
            background: `linear-gradient(135deg, ${CT_SEMANTIC.win}, #1a9060)`,
            boxShadow: '0 4px 16px rgba(34,160,107,0.35)',
            border: 'none', color: '#fff',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            fontFamily: CT_TYPE.sans,
          }}>
            + Save
          </button>
          <button onClick={() => setShowSpend(true)} style={{
            flex: 1, padding: '13px', borderRadius: 14,
            background: `linear-gradient(135deg, ${CT_SEMANTIC.danger}, #b91c1c)`,
            boxShadow: '0 4px 16px rgba(229,75,60,0.3)',
            border: 'none', color: '#fff',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            fontFamily: CT_TYPE.sans,
          }}>
            - Spend
          </button>
        </div>

        {/* Nav row */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { emoji: '💰', label: 'Savings',  onClick: onGoSlider },
            { emoji: '🌟', label: 'Dreams',   onClick: onGoDreams },
            { emoji: '📊', label: 'Budget',   onClick: onGoBudget },
            { emoji: '🐒', label: 'Chico',    onClick: onGoCoach },
          ].map(btn => (
            <button key={btn.label} onClick={btn.onClick} style={{
              flex: 1, padding: '10px 4px', borderRadius: 12,
              background: p.bgCard, border: `1px solid ${p.line}`,
              boxShadow: '0 2px 6px rgba(42,31,18,0.08)',
              color: p.inkSoft, fontSize: 11, cursor: 'pointer', fontFamily: CT_TYPE.sans,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <span style={{ fontSize: 16 }}>{btn.emoji}</span>
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {showAdd && (
        <AddSavingsSheet palette={p} onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      )}
      {showSpend && (
        <AddSpendingSheet palette={p} allocations={allocations} onSave={handleAddSpend} onCancel={() => setShowSpend(false)} />
      )}
      {showSettings && (
        <SettingsSheet
          palette={p}
          themeKey={themeKey} onThemeChange={onThemeChange}
          fontChoice={fontChoice} onFontChange={onFontChange}
          onGoIncomeSetup={onGoIncomeSetup}
          onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}
