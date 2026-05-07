import { useState } from 'react'
import { CT_TYPE, CT_SEMANTIC } from '../tokens.js'
import CTHeader from '../components/ui/CTHeader.jsx'
import CTButton from '../components/ui/CTButton.jsx'

const PRESETS = [20000, 35000, 50000, 75000, 100000, 150000]

export default function UpdateEarningsScreen({ palette: p, income, onIncomeChange, onBack, className }) {
  const [draft, setDraft] = useState(income || 0)
  const takeHome = Math.round(draft * 0.84)
  const valid = draft > 0

  const save = () => {
    if (!valid) return
    onIncomeChange(draft)
    onBack()
  }

  return (
    <div className={className} style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <CTHeader palette={p} title="Update earnings" onBack={onBack} />

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: CT_TYPE.serif, fontSize: 28, lineHeight: 1.15, color: p.ink, marginBottom: 6 }}>
          What's your gross monthly now?
        </div>
        <div style={{ fontSize: 14, color: p.inkSoft, marginBottom: 24, lineHeight: 1.5 }}>
          Update this whenever your income changes — Chico will recalculate everything.
        </div>

        {/* Typeable input card */}
        <div style={{
          padding: '16px', background: p.bgCard, borderRadius: 16,
          border: `1px solid ${p.line}`,
          boxShadow: '0 4px 16px rgba(42,31,18,0.08)',
          marginBottom: 14,
        }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Gross monthly income
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 28, color: p.inkSoft, fontFamily: CT_TYPE.serif }}>₱</span>
            <input
              type="number"
              value={draft || ''}
              onChange={e => setDraft(Number(e.target.value) || 0)}
              onKeyDown={e => e.key === 'Enter' && save()}
              placeholder="e.g. 35000"
              autoFocus
              style={{
                flex: 1, border: 'none', background: 'transparent',
                fontSize: 38, fontFamily: CT_TYPE.serif, color: p.ink,
                outline: 'none', minWidth: 0, padding: 0,
              }}
            />
          </div>
          {draft > 0 && (
            <div style={{
              marginTop: 14, paddingTop: 14, borderTop: `1px dashed ${p.line}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 12, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
                Take-home (est. 84%)
              </span>
              <span style={{ fontSize: 20, fontFamily: CT_TYPE.serif, color: CT_SEMANTIC.win, fontVariantNumeric: 'tabular-nums' }}>
                ₱{takeHome.toLocaleString('en-PH')}
              </span>
            </div>
          )}
        </div>

        {/* Quick presets */}
        <div style={{ marginBottom: 8, fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
          Quick select
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {PRESETS.map(v => (
            <button key={v} onClick={() => setDraft(v)} style={{
              padding: '9px 16px', borderRadius: 999,
              border: `1.5px solid ${draft === v ? p.ink : p.line}`,
              background: draft === v ? p.ink : 'transparent',
              color: draft === v ? p.bg : p.inkSoft,
              fontSize: 13, fontWeight: draft === v ? 600 : 400,
              cursor: 'pointer', fontFamily: CT_TYPE.sans,
              transition: 'background .15s, color .15s',
            }}>
              ₱{(v / 1000).toFixed(0)}k
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <CTButton palette={p} label={valid ? 'Save earnings' : 'Enter an amount'} onClick={save} />
        <div style={{ height: 20 }} />
      </div>
    </div>
  )
}
