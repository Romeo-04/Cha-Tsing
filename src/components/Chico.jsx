// Chico.jsx — Chico the monkey, 5 expression states
// States: 'rich' | 'thriving' | 'okay' | 'stressed' | 'shocked'

const CHICO_PALETTE = {
  fur: '#C9854A',
  furDark: '#8E5A2D',
  furLight: '#E8B07A',
  face: '#F5D8B0',
  faceShadow: '#E5BD8A',
  mouth: '#5C2E14',
  blush: '#F2A28A',
}

export const CHICO_EXPRESSIONS = {
  rich: {
    eyeShape: 'star',
    browL: 'M70 84 Q78 78, 90 82',
    browR: 'M110 82 Q122 78, 130 84',
    mouth: 'bigSmile',
    arms: 'up',
    blush: true,
    tuft: 'M86 48 Q90 35, 100 40 Q110 35, 114 48 Q105 45, 100 48 Q95 45, 86 48 Z',
  },
  thriving: {
    eyeShape: 'happy',
    browL: 'M72 86 Q80 82, 90 86',
    browR: 'M110 86 Q120 82, 128 86',
    mouth: 'smile',
    arms: 'side',
    blush: true,
  },
  okay: {
    eyeShape: 'round',
    eyeH: 8,
    browL: 'M72 88 L90 88',
    browR: 'M110 88 L128 88',
    mouth: 'flat',
    arms: 'side',
    blush: false,
  },
  stressed: {
    eyeShape: 'worried',
    browL: 'M72 84 Q80 90, 90 86',
    browR: 'M110 86 Q120 90, 128 84',
    mouth: 'frown',
    arms: 'cover',
    blush: false,
  },
  shocked: {
    eyeShape: 'shock',
    browL: 'M72 78 Q80 72, 90 76',
    browR: 'M110 76 Q120 72, 128 78',
    mouth: 'oh',
    arms: 'cover',
    blush: false,
  },
  eating: {
    eyeShape: 'happy',
    browL: 'M72 86 Q80 80, 90 86',
    browR: 'M110 86 Q120 80, 128 86',
    mouth: 'chomp',
    arms: 'reach',
    blush: true,
  },
  hungry: {
    eyeShape: 'round',
    eyeH: 9,
    browL: 'M72 84 Q80 80, 90 84',
    browR: 'M110 84 Q120 80, 128 84',
    mouth: 'open',
    arms: 'reach',
    blush: true,
  },
}

export const CHICO_LINES = {
  rich: [
    "OOH-OOH-AAH! Banana stash secured! 🍌",
    "I'm seeing stars and they're all peso signs.",
    "Top of the tree, baby. Top. Of. The. Tree.",
    "This is how a wealthy monkey behaves.",
  ],
  thriving: [
    "Look at you, future-thinking primate.",
    "Steady swinging. I respect it.",
    "Ooh, this branch feels strong.",
    "Banana fund: thriving. Mood: chef's kiss.",
  ],
  okay: [
    "Eh, we're surviving. Could swing higher tho.",
    "Not bad. Not great. Very monkey.",
    "I'd save more bananas if I were you.",
    "We're fine. Define 'fine', though.",
  ],
  stressed: [
    "Uh. The branch is creaking, friend.",
    "I'm scratching my head. That's never a good sign.",
    "We need to talk about the banana situation.",
    "I'm not panicking. YOU'RE panicking.",
  ],
  shocked: [
    "OOK?! WHERE DID THE BANANAS GO?!",
    "I have seen things. Terrible, expensive things.",
    "*nervous monkey noises*",
    "This is not a drill. This is a banana emergency.",
  ],
}

export function chicoStateFromSavings(pct) {
  if (pct >= 0.4) return 'rich'
  if (pct >= 0.25) return 'thriving'
  if (pct >= 0.12) return 'okay'
  if (pct >= 0.05) return 'stressed'
  return 'shocked'
}

export function chicoLine(state, seed = 0) {
  const lines = CHICO_LINES[state] || CHICO_LINES.okay
  return lines[seed % lines.length]
}

export function Chico({ state = 'okay', size = 200, palette = CHICO_PALETTE, animate = true, savings = 0 }) {
  const p = palette
  const expr = CHICO_EXPRESSIONS[state] || CHICO_EXPRESSIONS.okay

  return (
    <div style={{
      width: size, height: size, display: 'inline-block', position: 'relative',
      animation: animate ? 'chico-bob 2.4s ease-in-out infinite' : 'none',
    }}>
      <svg viewBox="0 0 200 200" width={size} height={size} style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id={`chico-fur-${state}`} cx="0.5" cy="0.4" r="0.7">
            <stop offset="0%" stopColor={p.furLight} />
            <stop offset="100%" stopColor={p.fur} />
          </radialGradient>
          <radialGradient id={`chico-face-${state}`} cx="0.5" cy="0.55" r="0.5">
            <stop offset="0%" stopColor="#FBE6C5" />
            <stop offset="100%" stopColor={p.face} />
          </radialGradient>
        </defs>

        {/* === Money rain (rich mode only) === */}
        {state === 'rich' && (
          <g>
            {[15, 35, 60, 78, 90, 120, 150, 175].map((x, i) => (
              <text key={i} x={x} y="0" fontSize={i % 2 ? 18 : 14} fill="#22A06B"
                    style={{ animation: `chico-money-rain ${1.4 + (i % 3) * 0.4}s ease-in ${i * 0.15}s infinite` }}>
                ₱
              </text>
            ))}
          </g>
        )}

        {/* === Sparkles (rich + thriving) === */}
        {(state === 'rich' || state === 'thriving') && (
          <g>
            {[[30, 50], [170, 60], [25, 110], [175, 130]].map(([cx, cy], i) => (
              <g key={i} transform={`translate(${cx} ${cy})`}
                 style={{ animation: `chico-sparkle 1.6s ease-in-out ${i * 0.3}s infinite`, transformBox: 'fill-box', transformOrigin: 'center' }}>
                <path d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5 Z"
                      fill={state === 'rich' ? '#22A06B' : '#FFB347'} />
              </g>
            ))}
          </g>
        )}

        {/* === Ears (behind head) === */}
        <ellipse cx="32" cy="78" rx="14" ry="18" fill={p.fur} />
        <ellipse cx="32" cy="78" rx="7" ry="10" fill={p.face} />
        <ellipse cx="168" cy="78" rx="14" ry="18" fill={p.fur} />
        <ellipse cx="168" cy="78" rx="7" ry="10" fill={p.face} />

        {/* === Body (peeking from below) === */}
        <ellipse cx="100" cy="200" rx="56" ry="36" fill={`url(#chico-fur-${state})`} />
        <ellipse cx="100" cy="200" rx="38" ry="22" fill={p.face} />

        {/* === Arms (state-driven pose) === */}
        {expr.arms === 'up' && (
          <g>
            <path d="M55 175 Q35 130, 50 95" stroke={p.fur} strokeWidth="18" strokeLinecap="round" fill="none" />
            <path d="M145 175 Q165 130, 150 95" stroke={p.fur} strokeWidth="18" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="95" r="11" fill={p.face} />
            <circle cx="150" cy="95" r="11" fill={p.face} />
          </g>
        )}
        {expr.arms === 'cover' && (
          <g>
            <path d="M58 178 Q62 130, 82 110" stroke={p.fur} strokeWidth="18" strokeLinecap="round" fill="none" />
            <path d="M142 178 Q138 130, 118 110" stroke={p.fur} strokeWidth="18" strokeLinecap="round" fill="none" />
            <ellipse cx="82" cy="108" rx="13" ry="10" fill={p.face} />
            <ellipse cx="118" cy="108" rx="13" ry="10" fill={p.face} />
          </g>
        )}
        {expr.arms === 'side' && (
          <g>
            <path d="M58 175 Q40 165, 38 140" stroke={p.fur} strokeWidth="18" strokeLinecap="round" fill="none" />
            <path d="M142 175 Q160 165, 162 140" stroke={p.fur} strokeWidth="18" strokeLinecap="round" fill="none" />
            <circle cx="38" cy="140" r="11" fill={p.face} />
            <circle cx="162" cy="140" r="11" fill={p.face} />
          </g>
        )}
        {expr.arms === 'reach' && (
          <g style={{ animation: state === 'hungry' ? 'chico-reach 0.6s ease-in-out infinite' : 'none', transformOrigin: 'center bottom', transformBox: 'fill-box' }}>
            <path d="M58 175 Q50 145, 78 130" stroke={p.fur} strokeWidth="18" strokeLinecap="round" fill="none" />
            <path d="M142 175 Q150 145, 122 130" stroke={p.fur} strokeWidth="18" strokeLinecap="round" fill="none" />
            <circle cx="78" cy="128" r="12" fill={p.face} />
            <circle cx="122" cy="128" r="12" fill={p.face} />
          </g>
        )}

        {/* === Head === */}
        <ellipse cx="100" cy="100" rx="58" ry="55" fill={`url(#chico-fur-${state})`} />
        {/* face mask */}
        <ellipse cx="100" cy="108" rx="42" ry="40" fill={`url(#chico-face-${state})`} />
        {/* hair tuft */}
        <path d={expr.tuft || "M88 50 Q92 38, 100 42 Q108 38, 112 50 Q105 47, 100 50 Q95 47, 88 50 Z"}
              fill={p.furDark} />

        {/* === Brows === */}
        <g stroke={p.furDark} strokeWidth="3.5" strokeLinecap="round" fill="none">
          <path d={expr.browL} />
          <path d={expr.browR} />
        </g>

        {/* === Eyes === */}
        {expr.eyeShape === 'round' && (
          <g>
            <ellipse className="chico-eye" cx="82" cy="98" rx="7" ry={expr.eyeH || 8} fill="#1a1410" />
            <ellipse className="chico-eye" cx="118" cy="98" rx="7" ry={expr.eyeH || 8} fill="#1a1410" />
            <circle cx="84" cy="96" r="2" fill="#fff" />
            <circle cx="120" cy="96" r="2" fill="#fff" />
          </g>
        )}
        {expr.eyeShape === 'happy' && (
          <g stroke="#1a1410" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M75 100 Q82 92, 89 100" />
            <path d="M111 100 Q118 92, 125 100" />
          </g>
        )}
        {expr.eyeShape === 'star' && (
          <g fill="#1a1410">
            {[[82, 98], [118, 98]].map(([cx, cy], i) => (
              <path key={i}
                d={`M${cx} ${cy - 9} L${cx + 2.5} ${cy - 2.5} L${cx + 9} ${cy} L${cx + 2.5} ${cy + 2.5} L${cx} ${cy + 9} L${cx - 2.5} ${cy + 2.5} L${cx - 9} ${cy} L${cx - 2.5} ${cy - 2.5} Z`} />
            ))}
          </g>
        )}
        {expr.eyeShape === 'shock' && (
          <g>
            <circle cx="82" cy="98" r="9" fill="#fff" stroke="#1a1410" strokeWidth="2" />
            <circle cx="118" cy="98" r="9" fill="#fff" stroke="#1a1410" strokeWidth="2" />
            <circle cx="82" cy="100" r="3.5" fill="#1a1410" />
            <circle cx="118" cy="100" r="3.5" fill="#1a1410" />
          </g>
        )}
        {expr.eyeShape === 'worried' && (
          <g>
            <ellipse cx="82" cy="100" rx="6" ry="7" fill="#1a1410" />
            <ellipse cx="118" cy="100" rx="6" ry="7" fill="#1a1410" />
            <circle cx="80" cy="97" r="1.8" fill="#fff" />
            <circle cx="116" cy="97" r="1.8" fill="#fff" />
            {/* tear */}
            <path d="M76 108 Q73 115, 76 120 Q79 115, 76 108 Z" fill="#7DD3FC"
                  style={{ animation: 'chico-tear 1.8s ease-in infinite', transformBox: 'fill-box' }} />
          </g>
        )}

        {/* === Sweat drops (stressed) === */}
        {state === 'stressed' && (
          <g>
            <path d="M148 80 Q146 76, 148 72 Q150 76, 148 80 Z" fill="#7DD3FC"
                  style={{ animation: 'chico-sweat 1.8s ease-in infinite', transformBox: 'fill-box' }} />
          </g>
        )}

        {/* === Blush === */}
        {expr.blush && (
          <g opacity="0.55">
            <ellipse cx="70" cy="118" rx="9" ry="5" fill={p.blush} />
            <ellipse cx="130" cy="118" rx="9" ry="5" fill={p.blush} />
          </g>
        )}

        {/* === Snout & mouth === */}
        <ellipse cx="100" cy="125" rx="20" ry="14" fill={p.faceShadow} opacity="0.4" />
        {/* nostrils */}
        <ellipse cx="95" cy="120" rx="1.5" ry="2.2" fill={p.furDark} />
        <ellipse cx="105" cy="120" rx="1.5" ry="2.2" fill={p.furDark} />

        {/* mouth shape */}
        <g>
          {expr.mouth === 'bigSmile' && (
            <path d="M82 132 Q100 150, 118 132 Q115 142, 100 144 Q85 142, 82 132 Z"
                  fill={p.mouth} />
          )}
          {expr.mouth === 'smile' && (
            <path d="M86 134 Q100 144, 114 134" stroke={p.mouth} strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
          {expr.mouth === 'flat' && (
            <path d="M88 136 L112 136" stroke={p.mouth} strokeWidth="3" strokeLinecap="round" />
          )}
          {expr.mouth === 'frown' && (
            <path d="M86 140 Q100 130, 114 140" stroke={p.mouth} strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
          {expr.mouth === 'oh' && (
            <ellipse cx="100" cy="138" rx="6" ry="8" fill={p.mouth} />
          )}
          {expr.mouth === 'open' && (
            <ellipse cx="100" cy="138" rx="10" ry="7" fill={p.mouth} />
          )}
          {expr.mouth === 'chomp' && (
            <g style={{ animation: 'chico-munch 0.32s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }}>
              <path d="M84 132 Q100 148, 116 132 Q116 140, 100 142 Q84 140, 84 132 Z" fill={p.mouth} />
              <path d="M88 134 L92 138 L96 134 L100 138 L104 134 L108 138 L112 134" stroke="#fff" strokeWidth="1.2" fill="none" />
            </g>
          )}
        </g>
      </svg>
    </div>
  )
}

export default Chico
