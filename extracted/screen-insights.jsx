// screen-insights.jsx — Insights / dashboard

function InsightsScreen({ palette, income, savingsPct, onBack, onRestart, onTalk }) {
  const p = palette;
  const takeHome = Math.round(income * 0.84);
  const monthly = Math.round(takeHome * savingsPct);
  const annual = monthly * 12;
  const state = chicoStateFromSavings(savingsPct);

  // fake spending breakdown
  const spend = takeHome - monthly;
  const categories = [
    { label: 'Rent & bills', pct: 0.42, color: '#7C4DFF' },
    { label: 'Food & groceries', pct: 0.22, color: '#22A06B' },
    { label: 'Transport', pct: 0.10, color: '#C9854A' },
    { label: 'Fun stuff', pct: 0.16, color: '#E54B3C' },
    { label: 'Other', pct: 0.10, color: '#9C8870' },
  ];

  const insights = [
    {
      title: state === 'rich' ? "You're saving like a banana baron" :
             state === 'thriving' ? "You're outsaving most of your peers" :
             state === 'okay' ? "You're saving less than the recommended 20%" :
             state === 'stressed' ? "You're cutting it pretty close" :
             "We need to have a chat",
      body: state === 'rich' ? `At this pace you'll hit a million in ${Math.ceil(1000000/monthly)} months. I'm proud. I'm a proud monkey.` :
            state === 'thriving' ? `Your annual rate of ${peso(annual)} compounds beautifully. Keep climbing.` :
            state === 'okay' ? `Bumping savings to 20% would mean ${peso(takeHome*0.2)}/mo — that's ${peso((takeHome*0.2 - monthly)*12)} more per year.` :
            state === 'stressed' ? `Less than 12% is risky territory. One emergency could undo a year of progress.` :
            `Saving under 5% means no buffer. Let's find ₱2,000/mo to start. I believe in you.`,
      tone: state === 'rich' || state === 'thriving' ? 'win' : state === 'okay' ? 'amber' : 'danger',
    },
    {
      title: "Your biggest leak is 'fun stuff'",
      body: `You're spending around ${peso(spend * 0.16)}/mo on lifestyle. Halving that adds ${peso(spend * 0.08 * 12)}/year to savings. I'm not saying don't have fun. I'm saying have 50% less of it.`,
      tone: 'amber',
    },
    {
      title: "If you started today",
      body: `By age 60 (assuming 6% growth), this rate compounds to roughly ${peso(annual * 38)}. That's a coconut farm. Maybe two.`,
      tone: 'win',
    },
  ];

  return (
    <div style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'auto',
    }}>
      <CTHeader palette={p} title="Insights" onBack={onBack} />

      {/* Top: Chico + headline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '4px 24px 0' }}>
        <Chico state={state} size={110} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
            This month, Chico says
          </div>
          <div style={{ fontFamily: CT_TYPE.serif, fontSize: 22, lineHeight: 1.15, color: p.ink, marginTop: 4 }}>
            {state === 'rich' ? "Magnificent." :
             state === 'thriving' ? "We're doing the thing." :
             state === 'okay' ? "We could do better." :
             state === 'stressed' ? "I'm worried." :
             "Banana red alert."}
          </div>
        </div>
      </div>

      {/* Big savings card */}
      <div style={{ padding: '14px 24px 0' }}>
        <div style={{
          padding: 18, borderRadius: 20, background: p.bgCard, border: `1px solid ${p.line}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 12, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
              Saving rate
            </span>
            <span style={{ fontSize: 12, color: CT_SEMANTIC.win, fontWeight: 600 }}>
              {Math.round(savingsPct * 100)}%
            </span>
          </div>
          <div style={{
            fontFamily: CT_TYPE.serif, fontSize: 38, color: p.ink, marginTop: 4,
            fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5,
          }}>
            {peso(monthly)} <span style={{ fontSize: 14, color: p.inkSoft }}>/mo</span>
          </div>

          {/* spending bar */}
          <div style={{ marginTop: 16 }}>
            <div style={{
              display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden',
            }}>
              {categories.map((c, i) => (
                <div key={i} style={{ flex: c.pct, background: c.color }} />
              ))}
            </div>
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {categories.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: p.inkSoft }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
                  <span style={{ flex: 1 }}>{c.label}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: p.inkMuted }}>{Math.round(c.pct * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insight cards */}
      <div style={{ padding: '14px 24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 12, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
          Chico's takes
        </div>
        {insights.map((ins, i) => {
          const accent = ins.tone === 'win' ? CT_SEMANTIC.win :
                         ins.tone === 'danger' ? CT_SEMANTIC.danger :
                         CT_SEMANTIC.amber;
          return (
            <div key={i} style={{
              padding: '14px 16px', borderRadius: 16,
              background: p.bgCard, border: `1px solid ${p.line}`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: accent,
              }} />
              <div style={{ paddingLeft: 6 }}>
                <div style={{ fontFamily: CT_TYPE.serif, fontSize: 17, color: p.ink, lineHeight: 1.2 }}>
                  {ins.title}
                </div>
                <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 6, lineHeight: 1.45 }}>
                  {ins.body}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, minHeight: 18 }} />
      <div style={{ padding: '0 24px 18px', display: 'flex', gap: 10 }}>
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
  );
}

Object.assign(window, { InsightsScreen });
