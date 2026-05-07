// screen-coach.jsx — post-insights chat with Chico + editable budget

function CoachScreen({
  palette, income, savingsPct, onSavingsChange,
  allocations, onAddAllocation, onRemoveAllocation,
  onBack,
}) {
  const p = palette;
  const takeHome = Math.round(income * 0.84);
  const allocTotal = allocations.reduce((s, a) => s + a.amount, 0);
  const remaining = Math.max(0, takeHome - allocTotal);
  const savingsAmt = Math.round(remaining * savingsPct);
  const truePct = takeHome > 0 ? savingsAmt / takeHome : 0;
  const state = chicoStateFromSavings(truePct);

  const [messages, setMessages] = React.useState([
    { from: 'chico', text: "Hey, real talk. Want to plan how we hit your goal?" },
  ]);
  const [showAdjuster, setShowAdjuster] = React.useState(false);
  const [adjusting, setAdjusting] = React.useState(null); // alloc being edited
  const [unexpected, setUnexpected] = React.useState(null); // 'gain'|'loss'

  const log = (msg) => setMessages(m => [...m, msg]);

  const ask = (q) => {
    log({ from: 'me', text: q.label });
    setTimeout(() => log({ from: 'chico', text: q.reply }), 350);
  };

  const QUICK = [
    { label: "Can I hit ₱100k this year?",
      reply: takeHome * 12 * 0.18 >= 100000
        ? `At your pace, ₱${(savingsAmt * 12).toLocaleString()}/yr. You're on track. 🍌`
        : `Right now: ₱${(savingsAmt * 12).toLocaleString()}/yr. Need to bump savings ~5% or trim a bubble.` },
    { label: "What should I cut first?",
      reply: allocations.length === 0
        ? "Nothing to cut yet — drag some expenses in first."
        : `Honestly? '${[...allocations].sort((a,b)=>b.amount-a.amount)[0].label}' is your biggest one. Worth a look.` },
    { label: "I got a raise!",
      reply: "Niiice. Tap the income field — bump it up, and I'll reflect it everywhere." },
    { label: "Surprise expense came up",
      reply: "Happens. Tap any bubble in your list to adjust it, or add a new one." },
  ];

  return (
    <div style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0,
    }}>
      <CTHeader palette={p} title="Talk to Chico" onBack={onBack} />

      {/* Chico header card */}
      <div style={{
        margin: '4px 20px 0', padding: '14px 16px', borderRadius: 18,
        background: p.bgCard, border: `1px solid ${p.line}`,
        display: 'flex', gap: 14, alignItems: 'center',
      }}>
        <Chico state={state} size={72} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
            Saving rate
          </div>
          <div style={{ fontFamily: CT_TYPE.serif, fontSize: 28, color: p.ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(truePct * 100)}%
          </div>
          <div style={{ fontSize: 12, color: p.inkSoft, marginTop: 4 }}>
            ₱{savingsAmt.toLocaleString()}/mo · ₱{(savingsAmt * 12).toLocaleString()}/yr
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div style={{
        flex: 1, overflow: 'auto', padding: '14px 20px',
        display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0,
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start',
            maxWidth: '82%',
            padding: '9px 13px', borderRadius: 16,
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

      {/* Unexpected event row */}
      <div style={{
        margin: '0 20px 8px', padding: '10px 12px', borderRadius: 14,
        background: CT_SEMANTIC.amberSoft, border: `1px solid ${CT_SEMANTIC.amber}33`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>⚡</span>
        <div style={{ flex: 1, fontSize: 12, color: p.ink, lineHeight: 1.3 }}>
          Something change today?
        </div>
        <button onClick={() => setShowAdjuster(true)} style={{
          padding: '6px 12px', borderRadius: 999, border: 'none',
          background: p.ink, color: p.bg, fontSize: 11, fontWeight: 600, cursor: 'pointer',
        }}>Adjust budget</button>
      </div>

      <div style={{ padding: '0 20px 18px' }}>
        <CTButton palette={p} label="Done · back to insights" onClick={onBack} />
      </div>

      {/* Adjuster sheet */}
      {showAdjuster && (
        <BudgetAdjusterSheet
          palette={p}
          allocations={allocations}
          savingsPct={savingsPct}
          onSavingsChange={onSavingsChange}
          onEditAlloc={(a) => { setAdjusting(a); }}
          onRemove={onRemoveAllocation}
          onClose={() => setShowAdjuster(false)} />
      )}
      {adjusting && (
        <BubbleEditSheet palette={p} bubble={{ ...adjusting, mode: 'edit' }}
          onSave={(u) => { onAddAllocation(u); setAdjusting(null); }}
          onCancel={() => setAdjusting(null)} />
      )}
    </div>
  );
}

function BudgetAdjusterSheet({ palette, allocations, savingsPct, onSavingsChange, onEditAlloc, onRemove, onClose }) {
  const p = palette;
  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(20,15,8,0.45)',
        zIndex: 200, animation: 'scrim-in .2s ease',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 201,
        background: p.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '12px 20px 20px', boxShadow: '0 -20px 40px rgba(0,0,0,0.2)',
        animation: 'sheet-up .28s cubic-bezier(.2,.8,.3,1)',
        maxHeight: '85%', overflow: 'auto',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: p.line, margin: '0 auto 12px' }} />
        <div style={{ fontFamily: CT_TYPE.serif, fontSize: 22, color: p.ink, marginBottom: 4 }}>
          Adjust on the fly
        </div>
        <div style={{ fontSize: 12, color: p.inkSoft, marginBottom: 14, lineHeight: 1.4 }}>
          Got a bonus or a surprise bill? Tweak any expense, or shift your savings rate.
        </div>

        {/* Savings slider */}
        <div style={{ padding: '12px 14px', borderRadius: 14, background: p.bgCard, border: `1px solid ${p.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Savings rate</span>
            <span style={{ fontFamily: CT_TYPE.serif, fontSize: 22, color: CT_SEMANTIC.win, fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(savingsPct * 100)}%
            </span>
          </div>
          <input type="range" min={0} max={0.6} step={0.01} value={savingsPct}
            onChange={(e) => onSavingsChange(Number(e.target.value))}
            style={{ width: '100%', marginTop: 8, accentColor: CT_SEMANTIC.win }} />
        </div>

        {/* Expense list */}
        <div style={{ marginTop: 14, fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
          Your expenses · tap to edit
        </div>
        {allocations.length === 0 ? (
          <div style={{ fontSize: 12, color: p.inkMuted, padding: '14px', textAlign: 'center', border: `1.5px dashed ${p.line}`, borderRadius: 14 }}>
            None yet — go add a bubble.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {allocations.map(a => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 12,
                background: p.bgCard, border: `1px solid ${p.line}`,
              }}>
                <span style={{ fontSize: 22 }}>{a.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: p.ink }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: a.color, fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
                    ₱{a.amount.toLocaleString()}/mo
                  </div>
                </div>
                <button onClick={() => onEditAlloc(a)} style={{
                  padding: '6px 10px', borderRadius: 999, border: `1px solid ${p.line}`,
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
          width: '100%', marginTop: 16, padding: '13px', borderRadius: 14,
          background: p.ink, border: 'none', color: p.bg,
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>Done</button>
      </div>
    </>
  );
}

Object.assign(window, { CoachScreen, BudgetAdjusterSheet });
