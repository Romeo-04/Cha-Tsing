import { CT_TYPE } from '../../tokens.js'

export default function CTButton({ palette, onClick, label, variant = 'primary' }) {
  const p = palette
  const isPrimary = variant === 'primary'
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '16px 22px',
      borderRadius: 12, border: isPrimary ? 'none' : `1px solid ${p.line}`,
      background: isPrimary ? p.ink : 'transparent',
      color: isPrimary ? p.bg : p.ink,
      fontSize: 16, fontWeight: 600, fontFamily: CT_TYPE.sans,
      cursor: 'pointer', letterSpacing: 0.2,
      transition: 'opacity .15s ease',
    }}
    onMouseDown={e => e.currentTarget.style.opacity = '0.75'}
    onMouseUp={e => e.currentTarget.style.opacity = '1'}
    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >{label}</button>
  )
}
