import { useState } from 'react'
import { CT_TYPE, CT_SEMANTIC } from '../tokens.js'
import Chico from '../components/Chico.jsx'
import CTHeader from '../components/ui/CTHeader.jsx'
import CTButton from '../components/ui/CTButton.jsx'

export default function OnboardingScreen({ palette: p, income, name, onNameChange, onIncomeChange, onContinue, className }) {
  const [step, setStep] = useState(0)
  const [draftName, setDraftName] = useState(name || '')
  const [draftIncome, setDraftIncome] = useState(income)

  const takeHome = Math.round(draftIncome * 0.84)

  const handleContinue = () => {
    onNameChange(draftName.trim())
    onIncomeChange(draftIncome)
    onContinue()
  }

  return (
    <div className={className} style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <CTHeader palette={p} title="Welcome" />

      {/* Chico — fixed height container so it never overflows */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: 160, flexShrink: 0,
      }}>
        <Chico state={step === 0 ? 'thriving' : 'okay'} size={130} />
      </div>

      {step === 0 && (
        <div style={{ padding: '4px 24px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: CT_TYPE.serif, fontSize: 34, lineHeight: 1.1, color: p.ink }}>
            Hi, I'm Chico.
          </div>
          <div style={{ fontSize: 15, color: p.inkSoft, marginTop: 10, lineHeight: 1.55 }}>
            I'm your money-saving monkey. Tell me your name and I'll keep you company on your financial journey.
          </div>

          <div style={{
            marginTop: 24, padding: '16px',
            background: p.bgCard, borderRadius: 14, border: `1px solid ${p.line}`,
          }}>
            <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              What should I call you?
            </div>
            <input
              type="text"
              value={draftName}
              onChange={e => setDraftName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && draftName.trim()) setStep(1) }}
              placeholder="Your first name"
              autoFocus
              style={{
                width: '100%', border: 'none', background: 'transparent',
                fontSize: 28, fontFamily: CT_TYPE.serif, color: p.ink,
                outline: 'none', padding: 0,
              }}
            />
          </div>

          <div style={{ flex: 1 }} />
          <CTButton palette={p}
            onClick={() => draftName.trim() && setStep(1)}
            label={draftName.trim() ? `Nice to meet you, ${draftName.trim()} →` : 'Nice to meet you →'} />
          <div style={{ height: 20 }} />
        </div>
      )}

      {step === 1 && (
        <div style={{ padding: '4px 24px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: CT_TYPE.serif, fontSize: 28, lineHeight: 1.1, color: p.ink }}>
            What's your gross monthly, {draftName.trim()}?
          </div>
          <div style={{ fontSize: 14, color: p.inkSoft, marginTop: 8, lineHeight: 1.5 }}>
            Before tax. I won't judge. (I will judge.)
          </div>

          <div style={{
            marginTop: 20, padding: '16px',
            background: p.bgCard, borderRadius: 14, border: `1px solid ${p.line}`,
          }}>
            <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
              Gross monthly income
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
              <span style={{ fontSize: 26, color: p.inkSoft, fontFamily: CT_TYPE.serif }}>₱</span>
              <input
                type="number"
                value={draftIncome || ''}
                onChange={e => setDraftIncome(Number(e.target.value) || 0)}
                placeholder="0"
                autoFocus
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: 36, fontFamily: CT_TYPE.serif, color: p.ink,
                  outline: 'none', minWidth: 0, padding: 0,
                }}
              />
            </div>
            <div style={{
              marginTop: 14, paddingTop: 14, borderTop: `1px dashed ${p.line}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 12, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
                Take-home (est.)
              </span>
              <span style={{ fontSize: 18, fontFamily: CT_TYPE.serif, color: CT_SEMANTIC.win }}>
                ₱{takeHome.toLocaleString('en-PH')}
              </span>
            </div>
          </div>

          {/* Quick presets */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {[20000, 35000, 50000, 75000, 100000].map(v => (
              <button key={v} onClick={() => setDraftIncome(v)} style={{
                padding: '8px 14px', borderRadius: 999,
                border: `1px solid ${draftIncome === v ? p.ink : p.line}`,
                background: draftIncome === v ? p.ink : 'transparent',
                color: draftIncome === v ? p.bg : p.inkSoft,
                fontSize: 13, cursor: 'pointer', fontFamily: CT_TYPE.sans,
              }}>
                ₱{(v / 1000).toFixed(0)}k
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />
          <CTButton palette={p} onClick={handleContinue} label="Show me the damage →" />
          <div style={{ height: 20 }} />
        </div>
      )}
    </div>
  )
}
