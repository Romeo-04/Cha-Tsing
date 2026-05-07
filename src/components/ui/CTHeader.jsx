import { CT_TYPE, CT_SEMANTIC } from '../../tokens.js'
import CTButton from './CTButton.jsx'

export default function CTHeader({ palette, title, right, onBack }) {
  const p = palette
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 18px 6px',
    }}>
      {onBack ? (
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, border: 'none',
          background: p.bgCard, color: p.ink, fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>←</button>
      ) : (
        <div style={{
          width: 36, height: 36, borderRadius: 12, background: CT_SEMANTIC.amber,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: CT_TYPE.serif, fontSize: 22, fontWeight: 600,
        }}>C</div>
      )}
      <div style={{ flex: 1, fontFamily: CT_TYPE.sans, fontSize: 14, color: p.inkSoft }}>
        {title}
      </div>
      {right}
    </div>
  )
}
