import { useState, useEffect } from 'react'
import { CT_TYPE, CT_SEMANTIC } from '../tokens.js'
import Chico from '../components/Chico.jsx'
import WaveBg from '../components/WaveBg.jsx'

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Mac/i.test(navigator.platform))
}

function isMobile() {
  return /iphone|ipad|ipod|android/i.test(navigator.userAgent)
}

export function useInstallGate() {
  const [show, setShow] = useState(() => {
    if (isStandalone()) return false
    if (sessionStorage.getItem('ct_install_skipped')) return false
    return isMobile()
  })
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const dismiss = () => {
    sessionStorage.setItem('ct_install_skipped', '1')
    setShow(false)
  }

  return { show, dismiss, installPrompt, ios: isIOS() }
}

export default function InstallGate({ palette: p, onContinue, installPrompt, ios }) {
  const [installing, setInstalling] = useState(false)

  const handleInstall = async () => {
    if (!installPrompt) return
    setInstalling(true)
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') onContinue()
    else setInstalling(false)
  }

  return (
    <div style={{
      flex: 1, background: p.bg, fontFamily: CT_TYPE.sans, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
    }}>
      <WaveBg palette={p} />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 28px 24px', position: 'relative', zIndex: 1,
      }}>
        <Chico state="thriving" size={150} />

        <div style={{ fontFamily: CT_TYPE.serif, fontSize: 30, textAlign: 'center', lineHeight: 1.15, marginTop: 20, color: p.ink }}>
          Add Cha-Tsing to your home screen
        </div>

        <div style={{ fontSize: 14, color: p.inkSoft, textAlign: 'center', lineHeight: 1.6, marginTop: 10, marginBottom: 28 }}>
          Install the app for the full experience — offline support, full screen, and no browser bars getting in the way.
        </div>

        {ios ? (
          <div style={{
            width: '100%', borderRadius: 18, background: p.bgCard,
            border: `1px solid ${p.line}`, padding: '18px 20px', marginBottom: 24,
          }}>
            <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
              How to install on iPhone / iPad
            </div>
            {[
              { icon: '⬆️', text: 'Tap the Share button at the bottom of Safari' },
              { icon: '➕', text: 'Scroll down and tap "Add to Home Screen"' },
              { icon: '✅', text: 'Tap "Add" — then open Cha-Tsing from your home screen' },
            ].map((step, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: i < arr.length - 1 ? 14 : 0 }}>
                <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.3 }}>{step.icon}</span>
                <span style={{ fontSize: 14, color: p.ink, lineHeight: 1.45 }}>{step.text}</span>
              </div>
            ))}
          </div>
        ) : (
          <button onClick={handleInstall} disabled={!installPrompt || installing}
            style={{
              width: '100%', padding: '16px', borderRadius: 16, marginBottom: 20,
              background: installPrompt ? p.ink : p.line,
              border: 'none', color: p.bg,
              fontSize: 16, fontWeight: 700, cursor: installPrompt ? 'pointer' : 'default',
              fontFamily: CT_TYPE.sans,
            }}>
            {installing ? 'Installing…' : '📲  Install App'}
          </button>
        )}

        <button onClick={onContinue} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: p.inkMuted, fontSize: 13, fontFamily: CT_TYPE.sans,
          padding: '8px 0', textDecoration: 'underline', textUnderlineOffset: 3,
        }}>
          Continue in browser anyway
        </button>

        <div style={{ fontSize: 11, color: p.inkMuted, textAlign: 'center', marginTop: 6, lineHeight: 1.5 }}>
          Some features may not work correctly without installing.
        </div>
      </div>
    </div>
  )
}
