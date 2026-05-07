// Onboarding.jsx — "Hi, I'm Chico"

import { useState } from 'react'
import { CT_TYPE, CT_SEMANTIC, peso } from '../tokens.js'
import CTHeader from '../components/ui/CTHeader.jsx'
import CTButton from '../components/ui/CTButton.jsx'
import Chico from '../components/Chico.jsx'

export default function OnboardingScreen({ palette, income, onIncomeChange, onContinue, className }) {
  const p = palette
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState(income)

  const takeHome = Math.round(draft * 0.84)

  return (
    <div className={className} style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <CTHeader palette={p} title="Welcome" />

      {/* Chico hero */}
      <div style={{
        display: 'flex', justifyContent: 'center', padding: '8px 0 0',
      }}>
        <Chico state="thriving" size={180} />
      </div>

      {step === 0 && (
        <div style={{ padding: '12px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: CT_TYPE.serif, fontSize: 38, lineHeight: 1.05, color: p.ink, textWrap: 'pretty' }}>
            Hi, I'm Chico.
          </div>
          <div style={{ fontSize: 16, color: p.inkSoft, marginTop: 14, lineHeight: 1.5 }}>
            I'm a monkey who's seen some things. Mostly bananas. Sometimes money.
            Tell me what you bring home and I'll tell you how stressed I am about it.
          </div>
          <div style={{ flex: 1 }} />
          <CTButton palette={p} onClick={() => setStep(1)} label="Okay, fine" />
          <div style={{ height: 18 }} />
        </div>
      )}

      {step === 1 && (
        <div style={{ padding: '12px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: CT_TYPE.serif, fontSize: 28, lineHeight: 1.1 }}>
            What's your gross monthly?
          </div>
          <div style={{ fontSize: 14, color: p.inkSoft, marginTop: 8 }}>
            Before the government takes its share. I won't judge. (I will judge.)
          </div>

          <div style={{
            marginTop: 22, padding: '18px 18px',
            background: p.bgCard, borderRadius: 18, border: `1px solid ${p.line}`,
          }}>
            <div style={{ fontSize: 12, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
              Gross monthly
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <span style={{ fontSize: 28, color: p.inkSoft, fontFamily: CT_TYPE.serif }}>₱</span>
              <input
                type="number"
                value={draft}
                onChange={e => setDraft(Number(e.target.value) || 0)}
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: 38, fontFamily: CT_TYPE.serif, color: p.ink,
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
                {peso(takeHome)}
              </span>
            </div>
          </div>

          {/* quick presets */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {[25000, 40000, 60000, 90000, 120000].map(v => (
              <button key={v}
                onClick={() => setDraft(v)}
                style={{
                  padding: '8px 12px', borderRadius: 999,
                  border: `1px solid ${p.line}`,
                  background: draft === v ? p.ink : 'transparent',
                  color: draft === v ? p.bg : p.inkSoft,
                  fontSize: 13, cursor: 'pointer', fontFamily: CT_TYPE.sans,
                }}>
                {peso(v)}
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />
          <CTButton palette={p} onClick={() => { onIncomeChange(draft); onContinue() }} label="Show me the damage →" />
          <div style={{ height: 18 }} />
        </div>
      )}
    </div>
  )
}
