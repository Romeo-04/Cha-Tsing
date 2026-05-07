import { CT_TYPE, CT_SEMANTIC, peso } from '../tokens.js'
import CTHeader from '../components/ui/CTHeader.jsx'
import CTButton from '../components/ui/CTButton.jsx'
import Chico, { chicoStateFromSavings } from '../components/Chico.jsx'
import WaveBg from '../components/WaveBg.jsx'

function getThisMonth(entries) {
  const now = new Date()
  return entries.filter(e => {
    const d = new Date(e.date)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
}

export default function InsightsScreen({
  palette, income, savingsPct,
  allocations = [], spendingLog = [], savingsLog = [],
  onBack, onTalk, className,
}) {
  const p = palette
  const takeHome   = Math.round(income * 0.84)
  const monthly    = Math.round(takeHome * savingsPct)
  const annual     = monthly * 12
  const spendBudget = takeHome - monthly
  const state      = chicoStateFromSavings(savingsPct)

  // ── Real spending bar from allocations ──────────────────────────────────
  const allocTotal = allocations.reduce((s, a) => s + a.amount, 0)
  const COLORS = ['#7C4DFF','#22A06B','#C9854A','#E54B3C','#7DD3FC','#F9A8D4','#9C8870']
  let categories = []
  if (allocations.length > 0) {
    const base = spendBudget > 0 ? spendBudget : allocTotal
    categories = allocations.map((a, i) => ({
      label: a.label,
      emoji: a.emoji || '',
      color: a.color || COLORS[i % COLORS.length],
      amount: a.amount,
      pct: base > 0 ? a.amount / base : 0,
    }))
    const unallocated = spendBudget - allocTotal
    if (unallocated > 500) {
      categories.push({ label: 'Other / unallocated', emoji: '💳', color: '#9C8870', amount: unallocated, pct: spendBudget > 0 ? unallocated / spendBudget : 0 })
    }
  } else {
    // Fallback: show just Save vs Spend split
    categories = [
      { label: 'Savings', color: CT_SEMANTIC.win,   pct: takeHome > 0 ? monthly / takeHome : 0,     amount: monthly },
      { label: 'Spending', color: CT_SEMANTIC.amber, pct: takeHome > 0 ? spendBudget / takeHome : 0, amount: spendBudget },
    ]
  }

  // ── This month actual spending ───────────────────────────────────────────
  const thisMonthSpend  = getThisMonth(spendingLog)
  const thisMonthSaved  = getThisMonth(savingsLog).reduce((s, e) => s + e.amount, 0)
  const thisMonthSpent  = thisMonthSpend.reduce((s, e) => s + e.amount, 0)
  const totalSaved      = savingsLog.reduce((s, e) => s + e.amount, 0)

  const spentByCategory = {}
  thisMonthSpend.forEach(e => { spentByCategory[e.category] = (spentByCategory[e.category] || 0) + e.amount })

  // ── Real insight cards ───────────────────────────────────────────────────
  const biggestAlloc = allocations.length > 0
    ? [...allocations].sort((a, b) => b.amount - a.amount)[0]
    : null

  // Find most overspent category this month
  const overspentEntries = allocations
    .map(a => ({ ...a, spent: spentByCategory[a.id] || 0, over: (spentByCategory[a.id] || 0) - a.amount }))
    .filter(a => a.over > 0)
    .sort((a, b) => b.over - a.over)
  const worstOverspend = overspentEntries[0] || null

  // Top actual spending category this month
  const topActualId  = Object.entries(spentByCategory).sort((a, b) => b[1] - a[1])[0]?.[0]
  const topActualAlloc = topActualId ? allocations.find(a => a.id === topActualId) : null

  const insights = [
    // Card 1 — savings rate (always real)
    {
      title: state === 'rich'     ? "You're saving like a banana baron"         :
             state === 'thriving' ? "You're outsaving most of your peers"       :
             state === 'okay'     ? "You're saving less than the recommended 20%" :
             state === 'stressed' ? "You're cutting it pretty close"            :
                                    "We need to have a chat",
      body:  state === 'rich'     ? `At this pace you'll hit a million in ${Math.ceil(1_000_000 / monthly).toLocaleString('en-PH')} months. I'm proud. Genuinely proud monkey energy.` :
             state === 'thriving' ? `Your annual rate of ${peso(annual)} compounds beautifully. Keep climbing.` :
             state === 'okay'     ? `Bumping to 20% means ${peso(Math.round(takeHome * 0.2))}/mo — that's ${peso(Math.round((takeHome * 0.2 - monthly) * 12))} more a year.` :
             state === 'stressed' ? `Less than 12% is risky territory. One surprise expense could undo a year of progress.` :
                                    `Saving under 5% means no buffer. Let's find ₱2,000/mo somewhere. I believe in you.`,
      tone: state === 'rich' || state === 'thriving' ? 'win' : state === 'okay' ? 'amber' : 'danger',
    },

    // Card 2 — spending breakdown (real allocations / actual spending)
    worstOverspend ? {
      title: `You went over on ${worstOverspend.emoji} ${worstOverspend.label}`,
      body: `This month you spent ${peso(worstOverspend.spent)} on ${worstOverspend.label} but budgeted ${peso(worstOverspend.amount)}. That's ${peso(worstOverspend.over)} over. Worth a look.`,
      tone: 'danger',
    } : biggestAlloc ? {
      title: `Your biggest expense: ${biggestAlloc.emoji} ${biggestAlloc.label}`,
      body: `At ${peso(biggestAlloc.amount)}/mo, it's ${takeHome > 0 ? Math.round(biggestAlloc.amount / takeHome * 100) : 0}% of your take-home. ${biggestAlloc.amount > takeHome * 0.35 ? "That's a big chunk — see if there's room to trim." : "Looks reasonable. Banana approved."}`,
      tone: biggestAlloc.amount > takeHome * 0.35 ? 'amber' : 'win',
    } : thisMonthSpent > 0 ? {
      title: "You've been spending this month",
      body: `${peso(thisMonthSpent)} spent so far. Add your expense budgets in the Savings tab so I can compare what's planned vs what's actually happening.`,
      tone: 'amber',
    } : {
      title: "No spending data yet",
      body: "Add your expense allocations in the Savings tab, then log actual spending. I'll start giving you real breakdowns instead of making things up.",
      tone: 'amber',
    },

    // Card 3 — progress or projection (real if savings logged, else projection)
    totalSaved > 0 ? {
      title: "You've already started",
      body: `${peso(totalSaved)} saved total${thisMonthSaved > 0 ? `, including ${peso(thisMonthSaved)} this month` : ''}. At ${peso(monthly)}/mo, you'll have ${peso(totalSaved + annual)} by this time next year. That's a real number.`,
      tone: 'win',
    } : {
      title: "If you start logging today",
      body: `${peso(annual)}/year at this rate. Assuming 6% annual growth, that compounds to roughly ${peso(annual * 15)} in 15 years. Start logging your actual savings to track real progress.`,
      tone: 'win',
    },
  ]

  return (
    <div className={className} style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'auto', position: 'relative',
    }}>
      <WaveBg palette={p} />
      <CTHeader palette={p} title="Insights" onBack={onBack} />

      {/* Chico + headline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '4px 24px 0', position: 'relative', zIndex: 1 }}>
        <Chico state={state} size={110} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
            This month, Chico says
          </div>
          <div style={{ fontFamily: CT_TYPE.serif, fontSize: 22, lineHeight: 1.15, color: p.ink, marginTop: 4 }}>
            {state === 'rich'     ? "Magnificent."         :
             state === 'thriving' ? "We're doing the thing." :
             state === 'okay'     ? "We could do better."   :
             state === 'stressed' ? "I'm worried."          :
                                    "Banana red alert."}
          </div>
        </div>
      </div>

      {/* Savings card */}
      <div style={{ padding: '14px 24px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ padding: 18, borderRadius: 20, background: p.bgCard, border: `1px solid ${p.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 12, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Saving rate</span>
            <span style={{ fontSize: 12, color: CT_SEMANTIC.win, fontWeight: 600 }}>{Math.round(savingsPct * 100)}%</span>
          </div>
          <div style={{ fontFamily: CT_TYPE.serif, fontSize: 38, color: p.ink, marginTop: 4, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5 }}>
            {peso(monthly)} <span style={{ fontSize: 14, color: p.inkSoft }}>/mo</span>
          </div>

          {/* This month actual if available */}
          {(thisMonthSaved > 0 || thisMonthSpent > 0) && (
            <div style={{ display: 'flex', gap: 12, marginTop: 10, padding: '10px 12px', borderRadius: 12, background: p.bgSoft }}>
              {thisMonthSaved > 0 && (
                <div>
                  <div style={{ fontSize: 10, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 0.8 }}>Saved this month</div>
                  <div style={{ fontSize: 14, fontFamily: CT_TYPE.serif, color: CT_SEMANTIC.win, fontVariantNumeric: 'tabular-nums' }}>+{peso(thisMonthSaved)}</div>
                </div>
              )}
              {thisMonthSaved > 0 && thisMonthSpent > 0 && <div style={{ width: 1, background: p.line }} />}
              {thisMonthSpent > 0 && (
                <div>
                  <div style={{ fontSize: 10, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 0.8 }}>Spent this month</div>
                  <div style={{ fontSize: 14, fontFamily: CT_TYPE.serif, color: CT_SEMANTIC.danger, fontVariantNumeric: 'tabular-nums' }}>-{peso(thisMonthSpent)}</div>
                </div>
              )}
            </div>
          )}

          {/* Spending breakdown bar */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden' }}>
              {categories.map((c, i) => (
                <div key={i} style={{ flex: Math.max(c.pct, 0.02), background: c.color }} />
              ))}
            </div>
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {categories.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: p.inkSoft }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.label}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: p.inkMuted }}>{Math.round(c.pct * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insight cards */}
      <div style={{ padding: '14px 24px 0', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 12, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Chico's takes</div>
        {insights.map((ins, i) => {
          const accent = ins.tone === 'win' ? CT_SEMANTIC.win : ins.tone === 'danger' ? CT_SEMANTIC.danger : CT_SEMANTIC.amber
          return (
            <div key={i} style={{ padding: '14px 16px', borderRadius: 16, background: p.bgCard, border: `1px solid ${p.line}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: accent }} />
              <div style={{ paddingLeft: 6 }}>
                <div style={{ fontFamily: CT_TYPE.serif, fontSize: 17, color: p.ink, lineHeight: 1.2 }}>{ins.title}</div>
                <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 6, lineHeight: 1.45 }}>{ins.body}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ flex: 1, minHeight: 18 }} />
      <div style={{ padding: '0 24px 18px', display: 'flex', gap: 10, position: 'relative', zIndex: 1 }}>
        <button onClick={onBack} style={{
          flex: 1, padding: '14px', borderRadius: 16,
          background: 'transparent', border: `1px solid ${p.line}`,
          color: p.ink, fontFamily: CT_TYPE.sans, fontSize: 15, fontWeight: 500, cursor: 'pointer',
        }}>← Adjust</button>
        <button onClick={onTalk} style={{
          flex: 1.4, padding: '14px', borderRadius: 16,
          background: p.ink, border: 'none',
          color: p.bg, fontFamily: CT_TYPE.sans, fontSize: 15, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}><span style={{ fontSize: 18 }}>🐒</span> Talk to Chico</button>
      </div>
    </div>
  )
}
