import { CT_TYPE } from '../../tokens.js'

export default function CTButton({ palette, onClick, label, variant = 'primary' }) {
  const p = palette
  const isPrimary = variant === 'primary'
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '16px 22px',
      borderRadius: 18, border: 'none',
      background: isPrimary ? p.ink : 'transparent',
      color: isPrimary ? p.bg : p.ink,
      fontSize: 16, fontWeight: 600, fontFamily: CT_TYPE.sans,
      cursor: 'pointer', letterSpacing: 0.2,
      boxShadow: isPrimary ? '0 8px 24px rgba(42,31,18,0.25)' : 'none',
      transition: 'transform .15s ease',
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >{label}</button>
  )
}
