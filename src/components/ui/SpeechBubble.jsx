export default function SpeechBubble({ p, text, state }) {
  const bg = p.bgCard
  return (
    <div style={{
      margin: '4px auto 0', maxWidth: 320, padding: '10px 16px',
      background: bg, border: `1px solid ${p.line}`,
      borderRadius: 18, position: 'relative',
      fontSize: 14, color: p.ink, textAlign: 'center', fontStyle: 'italic',
      lineHeight: 1.35,
    }}>
      <div style={{
        position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
        width: 12, height: 12, background: bg,
        borderTop: `1px solid ${p.line}`, borderLeft: `1px solid ${p.line}`,
      }} />
      "{text}"
    </div>
  )
}
