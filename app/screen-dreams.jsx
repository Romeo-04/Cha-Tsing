// screen-dreams.jsx — Dream tracker with blur-to-clear photo reveal

const DREAM_LIBRARY = [
  { id: 'boracay',  emoji: '🏝',  label: 'Boracay trip',     target: 45000,   tone: 'aspirational',
    img: 'linear-gradient(135deg, #7DD3FC 0%, #FED7AA 60%, #FECACA 100%)' }, // tropical
  { id: 'iphone',   emoji: '📱',  label: 'New phone',         target: 65000,   tone: 'aspirational',
    img: 'linear-gradient(135deg, #1F2937 0%, #4B5563 50%, #9CA3AF 100%)' },
  { id: 'condo',    emoji: '🏢',  label: 'Condo down payment',target: 350000,  tone: 'practical',
    img: 'linear-gradient(160deg, #93C5FD 0%, #DBEAFE 40%, #F3F4F6 100%)' },
  { id: 'japan',    emoji: '⛩',  label: 'Japan trip',        target: 120000,  tone: 'aspirational',
    img: 'linear-gradient(135deg, #FCA5A5 0%, #FECACA 50%, #FEF3C7 100%)' },
  { id: 'emergency',emoji: '🛟',  label: 'Emergency fund',    target: 180000,  tone: 'practical',
    img: 'linear-gradient(135deg, #34D399 0%, #A7F3D0 50%, #FEF3C7 100%)' },
  { id: 'wedding',  emoji: '💍',  label: 'Wedding',           target: 400000,  tone: 'practical',
    img: 'linear-gradient(135deg, #F9A8D4 0%, #FBCFE8 50%, #FEF3C7 100%)' },
];

function DreamTrackerScreen({ palette, monthlySavings, onBack, onNext }) {
  const p = palette;
  const [activeId, setActiveId] = React.useState('boracay');
  const [progress, setProgress] = React.useState({
    boracay: 0.65, iphone: 0.32, condo: 0.08, japan: 0.18, emergency: 0.42, wedding: 0.05,
  });

  const active = DREAM_LIBRARY.find(d => d.id === activeId);
  const pct = progress[activeId] || 0;
  const saved = Math.round(active.target * pct);
  const monthsLeft = monthlySavings > 0 ? Math.ceil((active.target - saved) / monthlySavings) : 99;

  const animSaved = useCountTo(saved, 500);
  const animPct = useCountTo(pct, 500);

  // blur amount inverse to progress: 0% = 24px blur, 100% = 0px
  const blurPx = (1 - animPct) * 22;
  const grayscale = (1 - animPct) * 80;

  return (
    <div style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <CTHeader palette={p} title="Your dreams" onBack={onBack} />

      {/* hero card with blurred photo */}
      <div style={{ padding: '4px 24px 0' }}>
        <div style={{
          position: 'relative', height: 240, borderRadius: 22, overflow: 'hidden',
          border: `1px solid ${p.line}`, boxShadow: '0 12px 30px rgba(42,31,18,0.12)',
        }}>
          {/* blurred 'photo' (CSS gradient placeholder, behaves like a photo) */}
          <div style={{
            position: 'absolute', inset: -30,
            background: active.img,
            filter: `blur(${blurPx}px) grayscale(${grayscale}%)`,
            transition: 'filter .5s ease',
          }} />
          {/* mono striped placeholder pattern overlay (drop here for real photo) */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(45deg, transparent 0 12px, rgba(255,255,255,0.04) 12px 24px)',
            mixBlendMode: 'overlay',
          }} />
          {/* darken at bottom for legibility */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: 120,
            background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.55))',
          }} />
          {/* big emoji center, fades out as it clears */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 80, opacity: Math.max(0.25, 1 - animPct),
            transition: 'opacity .5s', filter: `drop-shadow(0 4px 12px rgba(0,0,0,0.25))`,
          }}>
            {active.emoji}
          </div>
          {/* label */}
          <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14, color: '#fff' }}>
            <div style={{ fontSize: 11, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 1.5 }}>
              Coming into focus
            </div>
            <div style={{ fontFamily: CT_TYPE.serif, fontSize: 26, lineHeight: 1.1 }}>
              {active.label}
            </div>
          </div>
          {/* progress chip top-right */}
          <div style={{
            position: 'absolute', top: 14, right: 14,
            padding: '6px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
            fontSize: 13, fontWeight: 600, color: p.ink, fontVariantNumeric: 'tabular-nums',
          }}>
            {Math.round(animPct * 100)}%
          </div>
        </div>

        {/* numbers row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Saved</div>
            <div style={{ fontFamily: CT_TYPE.serif, fontSize: 24, color: p.ink, fontVariantNumeric: 'tabular-nums' }}>
              {peso(animSaved)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Goal</div>
            <div style={{ fontFamily: CT_TYPE.serif, fontSize: 24, color: p.inkSoft, fontVariantNumeric: 'tabular-nums' }}>
              {peso(active.target)}
            </div>
          </div>
        </div>

        {/* months countdown */}
        <div style={{
          marginTop: 12, padding: '10px 14px', borderRadius: 12,
          background: p.bgCard, border: `1px solid ${p.line}`,
          display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: p.inkSoft,
        }}>
          <Chico state={pct >= 0.5 ? 'thriving' : 'okay'} size={36} animate={false} />
          <span>
            At <b style={{ color: p.ink }}>{peso(monthlySavings)}/mo</b>, ~
            <b style={{ color: CT_SEMANTIC.dream }}> {monthsLeft} months</b> until banana time.
          </span>
        </div>
      </div>

      {/* dream picker */}
      <div style={{ marginTop: 18, padding: '0 24px 6px', fontSize: 12, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
        Switch dream
      </div>
      <div style={{
        display: 'flex', gap: 10, padding: '4px 24px 8px', overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {DREAM_LIBRARY.map(d => {
          const isActive = d.id === activeId;
          const dpct = progress[d.id] || 0;
          return (
            <button key={d.id} onClick={() => setActiveId(d.id)}
              style={{
                flexShrink: 0, width: 110, padding: '10px 12px',
                borderRadius: 14, border: `1px solid ${isActive ? p.ink : p.line}`,
                background: isActive ? p.ink : p.bgCard,
                color: isActive ? p.bg : p.ink,
                cursor: 'pointer', textAlign: 'left',
                fontFamily: CT_TYPE.sans,
              }}>
              <div style={{ fontSize: 22 }}>{d.emoji}</div>
              <div style={{ fontSize: 12, marginTop: 4, fontWeight: 600, lineHeight: 1.2 }}>{d.label}</div>
              <div style={{
                marginTop: 6, height: 4, borderRadius: 2,
                background: isActive ? 'rgba(255,255,255,0.2)' : p.line,
                overflow: 'hidden',
              }}>
                <div style={{ height: '100%', width: `${dpct * 100}%`, background: CT_SEMANTIC.dream }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* simulate progress */}
      <div style={{ padding: '8px 24px 0' }}>
        <div style={{ fontSize: 12, color: p.inkMuted, marginBottom: 6, letterSpacing: 0.4 }}>
          Drag to preview future progress
        </div>
        <FatSlider
          value={pct} max={1}
          onChange={(v) => setProgress(prev => ({ ...prev, [activeId]: v }))}
          state={pct >= 0.5 ? 'thriving' : 'okay'} p={p} />
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 24px 16px' }}>
        <CTButton palette={p} label="See my insights →" onClick={onNext} />
      </div>
    </div>
  );
}

Object.assign(window, { DreamTrackerScreen, DREAM_LIBRARY });
