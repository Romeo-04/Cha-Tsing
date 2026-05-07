import { useState } from 'react'
import { CT_PALETTES } from './tokens.js'
import OnboardingScreen from './screens/Onboarding.jsx'
import SavingsSliderScreen from './screens/Slider.jsx'
import DreamsScreen from './screens/Dreams.jsx'
import InsightsScreen from './screens/Insights.jsx'
import CoachScreen from './screens/Coach.jsx'

const SCREEN_ORDER = ['onboarding', 'slider', 'dreams', 'insights', 'coach']

export default function App() {
  const [screen, setScreen] = useState('onboarding')
  const [direction, setDirection] = useState('forward')
  const [income, setIncome] = useState(35000)
  const [savingsPct, setSavingsPct] = useState(0.18)
  const [allocations, setAllocations] = useState([])
  const [paletteName] = useState('cream')

  const palette = CT_PALETTES[paletteName]

  const navigate = (to) => {
    const from = SCREEN_ORDER.indexOf(screen)
    const toIdx = SCREEN_ORDER.indexOf(to)
    setDirection(toIdx >= from ? 'forward' : 'back')
    setScreen(to)
  }

  const addAllocation = (b) => setAllocations(prev =>
    prev.find(a => a.id === b.id)
      ? prev.map(a => a.id === b.id ? b : a)
      : [...prev, b])
  const removeAllocation = (id) => setAllocations(prev => prev.filter(a => a.id !== id))

  const takeHome = Math.round(income * 0.84)
  const monthly = Math.round(takeHome * savingsPct)

  const cls = direction === 'forward' ? 'screen-enter' : 'screen-enter-back'

  let content
  if (screen === 'onboarding') {
    content = (
      <OnboardingScreen key="onboarding" className={cls}
        palette={palette} income={income}
        onIncomeChange={setIncome}
        onContinue={() => navigate('slider')} />
    )
  } else if (screen === 'slider') {
    content = (
      <SavingsSliderScreen key="slider" className={cls}
        palette={palette} income={income} savingsPct={savingsPct}
        onSavingsChange={setSavingsPct}
        allocations={allocations}
        onAddAllocation={addAllocation}
        onRemoveAllocation={removeAllocation}
        onBack={() => navigate('onboarding')}
        onNext={() => navigate('dreams')} />
    )
  } else if (screen === 'dreams') {
    content = (
      <DreamsScreen key="dreams" className={cls}
        palette={palette} monthlySavings={monthly}
        onBack={() => navigate('slider')}
        onNext={() => navigate('insights')} />
    )
  } else if (screen === 'insights') {
    content = (
      <InsightsScreen key="insights" className={cls}
        palette={palette} income={income} savingsPct={savingsPct}
        onBack={() => navigate('slider')}
        onTalk={() => navigate('coach')} />
    )
  } else {
    content = (
      <CoachScreen key="coach" className={cls}
        palette={palette} income={income} savingsPct={savingsPct}
        onSavingsChange={setSavingsPct}
        allocations={allocations}
        onAddAllocation={addAllocation}
        onRemoveAllocation={removeAllocation}
        onBack={() => navigate('insights')} />
    )
  }

  return (
    <div className="app-frame" style={{ background: palette.bg }}>
      {content}
    </div>
  )
}
