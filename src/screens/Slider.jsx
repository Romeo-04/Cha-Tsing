import { useState, useEffect, useRef } from 'react'
import { CT_TYPE, CT_SEMANTIC, useCountTo } from '../tokens.js'
import CTHeader from '../components/ui/CTHeader.jsx'
import CTButton from '../components/ui/CTButton.jsx'
import FatSlider from '../components/ui/FatSlider.jsx'
import Chico, { chicoStateFromSavings, chicoLine } from '../components/Chico.jsx'
import { BubbleStage, AllocationStack, DroppableChico } from '../components/Bubbles.jsx'

export default function SavingsSliderScreen({
  palette, income, savingsPct, onSavingsChange,
  onNext, onBack,
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
  const state = chicoStateFromSavings(truePct)

  const animSavings = useCountTo(savingsAmount, 350)
  const animSpending = useCountTo(spendingAmount, 350)
  const animAnnual = useCountTo(savingsAmount * 12, 350)

  const [seed, setSeed] = useState(0)
  const lastStateRef = useRef(state)
  useEffect(() => {
    if (lastStateRef.current !== state) {
      setSeed(s => s + 1)
      lastStateRef.current = state
    }
  }, [state])

  const line = chicoLine(state, seed)

  // Editable amount fields
  const [editingSavings, setEditingSavings] = useState(false)
  const [editingSpend, setEditingSpend] = useState(false)
  const [savingsDraft, setSavingsDraft] = useState('')
  const [spendDraft, setSpendDraft] = useState('')

  const commitSavings = (raw) => {
    const v = Math.max(0, Math.min(remaining, Number(raw) || 0))
    if (remaining > 0) onSavingsChange(v / remaining)
    setEditingSavings(false)
  }
  const commitSpend = (raw) => {
    const v = Math.max(0, Math.min(remaining, Number(raw) || 0))
    const newSavings = Math.max(0, remaining - v)
    if (remaining > 0) onSavingsChange(newSavings / remaining)
    setEditingSpend(false)
  }

  return (
    <div className={className} style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <CTHeader palette={p} title="How much will you save?" onBack={onBack} />

      <BubbleStage palette={p} allocations={allocations}
        onAdd={onAddAllocation} onRemove={onRemoveAllocation}
        onEditAllocation={onAddAllocation}>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 80px 0 20px' }}>

          {/* Chico + quote row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
            <DroppableChico state={state} size={100} palette={p} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
                Take-home
              </div>
              <div style={{ fontFamily: CT_TYPE.serif, fontSize: 28, lineHeight: 1, color: p.ink }}>
                ₱{takeHome.toLocaleString('en-PH')}
              </div>
              <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 4, fontStyle: 'italic', lineHeight: 1.3 }}>
                "{line}"
              </div>
            </div>
          </div>

          {/* Split bar */}
          <div style={{ marginTop: 18 }}>
            <div style={{
              display: 'flex', height: 68, borderRadius: 14, overflow: 'hidden',
              border: `1px solid ${p.line}`,
            }}>
              {/* Save side */}
              <div style={{
                width: `${Math.max(4, savingsPct * 100)}%`,
                background: CT_SEMANTIC.win,
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '0 12px', transition: 'width .2s ease', minWidth: 0,
              }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.8)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Save
                </div>
                {editingSavings ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <span style={{ fontSize: 13, color: '#fff' }}>₱</span>
                    <input
                      autoFocus type="number"
                      value={savingsDraft}
                      onChange={e => setSavingsDraft(e.target.value)}
                      onBlur={() => commitSavings(savingsDraft)}
                      onKeyDown={e => { if (e.key === 'Enter') commitSavings(savingsDraft) }}
                      style={{
                        width: 80, background: 'transparent', border: 'none',
                        borderBottom: '1px solid rgba(255,255,255,0.6)',
                        color: '#fff', fontSize: 16, fontFamily: CT_TYPE.serif,
                        outline: 'none', padding: '0 0 2px',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => { setSavingsDraft(String(savingsAmount)); setEditingSavings(true) }}
                    style={{
                      fontFamily: CT_TYPE.serif, fontSize: 17, color: '#fff',
                      fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
                      cursor: 'text', borderBottom: '1px solid transparent',
                    }}>
                    ₱{Math.round(animSavings).toLocaleString('en-PH')}
                  </div>
                )}
              </div>

              {/* Spend side */}
              <div style={{
                flex: 1, background: CT_SEMANTIC.amberSoft,
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '0 12px', alignItems: 'flex-end', minWidth: 0,
              }}>
                <div style={{ fontSize: 10, color: p.inkSoft, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Spend
                </div>
                {editingSpend ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <span style={{ fontSize: 13, color: p.ink }}>₱</span>
                    <input
                      autoFocus type="number"
                      value={spendDraft}
                      onChange={e => setSpendDraft(e.target.value)}
                      onBlur={() => commitSpend(spendDraft)}
                      onKeyDown={e => { if (e.key === 'Enter') commitSpend(spendDraft) }}
                      style={{
                        width: 80, background: 'transparent', border: 'none',
                        borderBottom: `1px solid ${p.inkSoft}`,
                        color: p.ink, fontSize: 16, fontFamily: CT_TYPE.serif,
                        outline: 'none', padding: '0 0 2px', textAlign: 'right',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => { setSpendDraft(String(spendingAmount)); setEditingSpend(true) }}
                    style={{
                      fontFamily: CT_TYPE.serif, fontSize: 17, color: p.ink,
                      fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
                      cursor: 'text', borderBottom: '1px solid transparent',
                    }}>
                    ₱{Math.round(animSpending).toLocaleString('en-PH')}
                  </div>
                )}
              </div>
            </div>

            {/* Slider */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: p.inkSoft }}>Drag to adjust · tap amounts to type</span>
                <span style={{ fontFamily: CT_TYPE.serif, fontSize: 26, color: p.ink, fontVariantNumeric: 'tabular-nums' }}>
                  {Math.round(savingsPct * 100)}%
                </span>
              </div>
              <FatSlider value={savingsPct} onChange={onSavingsChange} state={state} p={p} />
            </div>
          </div>

          {/* Annual projection */}
          <div style={{
            marginTop: 14, padding: '14px 16px', borderRadius: 14,
            background: state === 'rich' ? CT_SEMANTIC.winSoft :
                        state === 'shocked' ? CT_SEMANTIC.dangerSoft : p.bgCard,
            border: `1px solid ${p.line}`, transition: 'background .25s',
          }}>
            <div style={{ fontSize: 11, color: p.inkSoft, textTransform: 'uppercase', letterSpacing: 1 }}>
              In 12 months you'll have
            </div>
            <div style={{
              fontFamily: CT_TYPE.serif, fontSize: 36, color: p.ink, marginTop: 4,
              fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5,
            }}>
              ₱{Math.round(animAnnual).toLocaleString('en-PH')}
            </div>
            <div style={{ fontSize: 12, color: p.inkSoft, marginTop: 4 }}>
              That's {Math.max(0, Math.round((animAnnual) / 5000))} round-trip flights to Cebu, give or take.
            </div>
          </div>

          {/* Allocations */}
          <div style={{ marginTop: 12 }}>
            <AllocationStack palette={p} allocations={allocations} onRemove={onRemoveAllocation} />
          </div>

          <div style={{ flex: 1 }} />
          <CTButton palette={p} label="Lock it in →" onClick={onNext} />
          <div style={{ height: 16 }} />
        </div>
      </BubbleStage>
    </div>
  )
}
