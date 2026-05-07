export default function WaveBg({ palette: p }) {
  const isDark = p.bg.startsWith('#1') || p.bg.startsWith('#2')
  const waveColor   = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(42,31,18,0.04)'
  const accentColor = isDark ? 'rgba(201,133,74,0.07)'  : 'rgba(201,133,74,0.09)'

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <svg viewBox="0 0 390 844" width="390" height="844" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <style>{`
            @keyframes ct-wave1 { 0%,100%{d:path("M0 600 Q97 560 195 590 Q293 620 390 580 L390 844 L0 844 Z")} 50%{d:path("M0 580 Q97 620 195 590 Q293 560 390 600 L390 844 L0 844 Z")} }
            @keyframes ct-wave2 { 0%,100%{d:path("M0 650 Q97 620 195 650 Q293 680 390 650 L390 844 L0 844 Z")} 50%{d:path("M0 660 Q97 680 195 650 Q293 620 390 640 L390 844 L0 844 Z")} }
            @keyframes ct-wave3 { 0%,100%{d:path("M0 720 Q97 700 195 720 Q293 740 390 720 L390 844 L0 844 Z")} 50%{d:path("M0 730 Q97 740 195 720 Q293 700 390 710 L390 844 L0 844 Z")} }
            @keyframes ct-blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,-15px) scale(1.05)} 66%{transform:translate(-10px,10px) scale(0.97)} }
            @keyframes ct-blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-15px,20px) scale(1.03)} 66%{transform:translate(10px,-8px) scale(0.98)} }
          `}</style>
        </defs>
        <ellipse cx="320" cy="120" rx="120" ry="90" fill={accentColor}
          style={{ animation: 'ct-blob1 8s ease-in-out infinite', transformOrigin: '320px 120px' }} />
        <ellipse cx="60" cy="300" rx="90" ry="70" fill={accentColor}
          style={{ animation: 'ct-blob2 11s ease-in-out infinite', transformOrigin: '60px 300px' }} />
        <path fill={waveColor} style={{ animation: 'ct-wave1 7s ease-in-out infinite' }}
          d="M0 600 Q97 560 195 590 Q293 620 390 580 L390 844 L0 844 Z" />
        <path fill={waveColor} style={{ animation: 'ct-wave2 9s ease-in-out infinite' }}
          d="M0 650 Q97 620 195 650 Q293 680 390 650 L390 844 L0 844 Z" />
        <path fill={accentColor} style={{ animation: 'ct-wave3 11s ease-in-out infinite' }}
          d="M0 720 Q97 700 195 720 Q293 740 390 720 L390 844 L0 844 Z" />
      </svg>
    </div>
  )
}
