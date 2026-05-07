import { useMemo } from 'react'
import { CT_TYPE, CT_SEMANTIC } from '../tokens.js'
import CTHeader from '../components/ui/CTHeader.jsx'
import Chico from '../components/Chico.jsx'
import WaveBg from '../components/WaveBg.jsx'

function getThisMonth(entries) {
  const now = new Date()
  return entries.filter(e => {
    const d = new Date(e.date)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
}

function barColor(pct) {
  if (pct >= 1)    return CT_SEMANTIC.danger
  if (pct >= 0.85) return CT_SEMANTIC.amber
  return CT_SEMANTIC.win
}

export default function BudgetScreen({
  palette: p, allocations = [], spendingLog = [],
  onBack, className,
}) {
  const thisMonth = useMemo(() => getThisMonth(spendingLog), [spendingLog])

  const spentByCategory = useMemo(() => {
    const map = {}
    thisMonth.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount })
    return map
  }, [thisMonth])

  const totalBudget   = allocations.reduce((s, a) => s + a.amount, 0)
  const totalSpent    = thisMonth.reduce((s, e) => s + e.amount, 0)
  const totalLeft     = totalBudget - totalSpent
  const overallPct    = totalBudget > 0 ? totalSpent / totalBudget : 0

  const allocIds = new Set(allocations.map(a => a.id))
  const unmatched      = thisMonth.filter(e => !allocIds.has(e.category))
  const unmatchedTotal = unmatched.reduce((s, e) => s + e.amount, 0)

  const monthName = new Date().toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })

  const chicoState = overallPct >= 1 ? 'shocked'
    : overallPct >= 0.85 ? 'stressed'
    : overallPct >= 0.4  ? 'okay'
    : 'thriving'

  const chicoLine = overallPct >= 1
    ? `Over budget by ₱${Math.abs(totalLeft).toLocaleString('en-PH')}. Time to tighten up.`
    : overallPct >= 0.85
      ? `Almost maxed out — ₱${totalLeft.toLocaleString('en-PH')} left. Watch it.`
      : totalSpent === 0
        ? "No spending logged yet this month. Start tracking!"
        : `₱${totalLeft.toLocaleString('en-PH')} still in budget. Keep it up! 🍌`

  return (
    <div className={className} style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
    }}>
      <WaveBg palette={p} />
      <CTHeader palette={p} title="Budget Tracker" onBack={onBack} />

      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px' }}>

        <div style={{ fontSize: 12, color: p.inkMuted, marginTop: 12, marginBottom: 10 }}>{monthName}</div>

        {/* Summary card */}
        <div style={{
          padding: '16px', borderRadius: 18,
          background: p.bg.startsWith('#1') || p.bg.startsWith('#2') ? p.bgCard : `linear-gradient(135deg, ${p.bgCard} 0%, #FFF3E0 100%)`,
          border: `1px solid ${p.line}`,
          boxShadow: '0 4px 20px rgba(42,31,18,0.1)',
          marginBottom: 12,
        }}>
          <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', border: `1px solid ${p.line}` }}>
            <div style={{ flex: 1, padding: '10px 8px', textAlign: 'center', background: 'rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize: 10, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>Budgeted</div>
              <div style={{ fontFamily: CT_TYPE.serif, fontSize: 15, color: p.ink, fontVariantNumeric: 'tabular-nums' }}>
                ₱{totalBudget.toLocaleString('en-PH')}
              </div>
            </div>
            <div style={{ width: 1, background: p.line }} />
            <div style={{ flex: 1, padding: '10px 8px', textAlign: 'center', background: 'rgba(229,75,60,0.06)' }}>
              <div style={{ fontSize: 10, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>Spent</div>
              <div style={{ fontFamily: CT_TYPE.serif, fontSize: 15, color: CT_SEMANTIC.danger, fontVariantNumeric: 'tabular-nums' }}>
                ₱{totalSpent.toLocaleString('en-PH')}
              </div>
            </div>
            <div style={{ width: 1, background: p.line }} />
            <div style={{ flex: 1, padding: '10px 8px', textAlign: 'center', background: `rgba(${totalLeft >= 0 ? '34,160,107' : '229,75,60'},0.06)` }}>
              <div style={{ fontSize: 10, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>
                {totalLeft >= 0 ? 'Remaining' : 'Over'}
              </div>
              <div style={{ fontFamily: CT_TYPE.serif, fontSize: 15, fontVariantNumeric: 'tabular-nums', color: totalLeft >= 0 ? CT_SEMANTIC.win : CT_SEMANTIC.danger }}>
                ₱{Math.abs(totalLeft).toLocaleString('en-PH')}
              </div>
            </div>
          </div>

          {totalBudget > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: p.inkMuted }}>Overall budget used</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: barColor(overallPct) }}>
                  {Math.round(overallPct * 100)}%
                </span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: p.line, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, overallPct * 100)}%`,
                  background: barColor(overallPct),
                  borderRadius: 4,
                  transition: 'width .6s cubic-bezier(.2,.8,.3,1)',
                  boxShadow: `0 0 8px ${barColor(overallPct)}66`,
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Chico comment */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
          padding: '10px 14px', borderRadius: 14,
          background: p.bgCard, border: `1px solid ${p.line}`,
          boxShadow: '0 2px 8px rgba(42,31,18,0.07)',
        }}>
          <Chico state={chicoState} size={44} animate={false} />
          <span style={{ fontSize: 13, color: p.ink, lineHeight: 1.4, fontStyle: 'italic' }}>
            "{chicoLine}"
          </span>
        </div>

        {/* No allocations prompt */}
        {allocations.length === 0 ? (
          <div style={{
            padding: '24px 16px', borderRadius: 14,
            border: `1.5px dashed ${p.line}`,
            textAlign: 'center', color: p.inkMuted, fontSize: 13, lineHeight: 1.6,
          }}>
            No budget categories yet.<br />
            Go to <strong>Savings</strong> to add your expense allocations.
          </div>
        ) : (
          <>
            <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              By category
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {allocations.map(a => {
                const spent     = spentByCategory[a.id] || 0
                const left      = a.amount - spent
                const pct       = a.amount > 0 ? spent / a.amount : 0
                const color     = barColor(pct)
                const isOver    = pct >= 1
                const isWarning = pct >= 0.85 && pct < 1

                return (
                  <div key={a.id} style={{
                    padding: '14px 16px', borderRadius: 14,
                    background: p.bgCard,
                    border: `1px solid ${isOver ? CT_SEMANTIC.danger + '55' : p.line}`,
                    boxShadow: isOver
                      ? `0 2px 12px rgba(229,75,60,0.15)`
                      : '0 2px 8px rgba(42,31,18,0.06)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: `${color}22`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, flexShrink: 0,
                      }}>
                        {a.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: p.ink }}>{a.label}</div>
                        <div style={{ fontSize: 11, color: p.inkMuted, fontVariantNumeric: 'tabular-nums' }}>
                          Budget: ₱{a.amount.toLocaleString('en-PH')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>
                          {left >= 0
                            ? `₱${left.toLocaleString('en-PH')} left`
                            : `Over ₱${Math.abs(left).toLocaleString('en-PH')}`}
                        </div>
                        <div style={{ fontSize: 11, color: p.inkMuted, fontVariantNumeric: 'tabular-nums' }}>
                          ₱{spent.toLocaleString('en-PH')} spent
                        </div>
                      </div>
                    </div>

                    <div style={{ height: 7, borderRadius: 4, background: p.line, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(100, pct * 100)}%`,
                        background: color,
                        borderRadius: 4,
                        transition: 'width .6s cubic-bezier(.2,.8,.3,1)',
                        boxShadow: `0 0 6px ${color}55`,
                      }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                      <span style={{ fontSize: 10, color: p.inkMuted }}>
                        {spent === 0 ? 'Nothing logged yet' : `${Math.round(pct * 100)}% used`}
                      </span>
                      {isOver && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: CT_SEMANTIC.danger }}>
                          Over budget!
                        </span>
                      )}
                      {isWarning && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: CT_SEMANTIC.amber }}>
                          Almost maxed
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Unmatched spending */}
              {unmatchedTotal > 0 && (
                <div style={{
                  padding: '14px 16px', borderRadius: 14,
                  background: p.bgCard, border: `1.5px dashed ${p.line}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: p.bgSoft,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, flexShrink: 0,
                    }}>💸</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: p.ink }}>Other spending</div>
                      <div style={{ fontSize: 11, color: p.inkMuted }}>Not in your budget plan</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: CT_SEMANTIC.amber, fontVariantNumeric: 'tabular-nums' }}>
                      ₱{unmatchedTotal.toLocaleString('en-PH')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}
