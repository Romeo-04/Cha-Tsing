import { useState, useEffect } from 'react'
import { CT_PALETTES, CT_FONTS } from './tokens.js'
import OnboardingScreen from './screens/Onboarding.jsx'
import SavingsSliderScreen from './screens/Slider.jsx'
import DreamsScreen, { BASE_DREAMS } from './screens/Dreams.jsx'
import InsightsScreen from './screens/Insights.jsx'
import CoachScreen from './screens/Coach.jsx'
import FeedChicoScreen from './screens/FeedChico.jsx'
import BudgetScreen from './screens/Budget.jsx'
import UpdateEarningsScreen from './screens/UpdateEarnings.jsx'

const SCREEN_ORDER = ['onboarding', 'slider', 'dreams', 'insights', 'coach', 'feed', 'savings-page', 'dreams-page', 'budget-page', 'income-setup']

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export default function App() {
  const [name, setNameState] = useState(() => load('ct_name', ''))
  const [income, setIncomeState] = useState(() => load('ct_income', 35000))
  const [savingsPct, setSavingsPctState] = useState(() => load('ct_savings_pct', 0.18))
  const [allocations, setAllocations] = useState(() => load('ct_allocations', []))
  const [savingsLog, setSavingsLog] = useState(() => load('ct_savings_log', []))
  const [spendingLog, setSpendingLog] = useState(() => load('ct_spending_log', []))
  const [activeDreamId, setActiveDreamIdState] = useState(() => load('ct_active_dream_id', 'boracay'))
  const [dreams, setDreamsState] = useState(() => load('ct_dreams', BASE_DREAMS))
  const [dreamProgress, setDreamProgressState] = useState(() => load('ct_dream_progress', {}))
  const [screen, setScreen] = useState(() => load('ct_name', '') ? 'feed' : 'onboarding')
  const [direction, setDirection] = useState('forward')
  const [dreamSource, setDreamSource] = useState('slider')
  const [themeKey, setThemeKeyState] = useState(() => load('ct_theme', 'cream'))
  const [fontChoice, setFontChoiceState] = useState(() => load('ct_font', 'dm-sans'))

  const palette = CT_PALETTES[themeKey] || CT_PALETTES['cream']

  useEffect(() => { localStorage.setItem('ct_name', JSON.stringify(name)) }, [name])
  useEffect(() => { localStorage.setItem('ct_income', JSON.stringify(income)) }, [income])
  useEffect(() => { localStorage.setItem('ct_savings_pct', JSON.stringify(savingsPct)) }, [savingsPct])
  useEffect(() => { localStorage.setItem('ct_allocations', JSON.stringify(allocations)) }, [allocations])
  useEffect(() => { localStorage.setItem('ct_savings_log', JSON.stringify(savingsLog)) }, [savingsLog])
  useEffect(() => { localStorage.setItem('ct_spending_log', JSON.stringify(spendingLog)) }, [spendingLog])
  useEffect(() => { localStorage.setItem('ct_active_dream_id', JSON.stringify(activeDreamId)) }, [activeDreamId])
  useEffect(() => { localStorage.setItem('ct_dreams', JSON.stringify(dreams)) }, [dreams])
  useEffect(() => { localStorage.setItem('ct_dream_progress', JSON.stringify(dreamProgress)) }, [dreamProgress])
  useEffect(() => { localStorage.setItem('ct_theme', JSON.stringify(themeKey)) }, [themeKey])
  useEffect(() => { localStorage.setItem('ct_font', JSON.stringify(fontChoice)) }, [fontChoice])
  useEffect(() => {
    document.documentElement.style.setProperty('--ct-sans', CT_FONTS[fontChoice]?.stack || CT_FONTS['dm-sans'].stack)
  }, [fontChoice])

  const setName = (n) => setNameState(n)
  const setIncome = (v) => setIncomeState(v)
  const setSavingsPct = (v) => setSavingsPctState(v)
  const setActiveDreamId = (id) => setActiveDreamIdState(id)
  const setDreams = (d) => setDreamsState(d)
  const setDreamProgress = (v) => setDreamProgressState(v)
  const setThemeKey = (k) => setThemeKeyState(k)
  const setFontChoice = (f) => setFontChoiceState(f)

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

  const addSavingsEntry = (entry) => setSavingsLog(prev => [entry, ...prev])
  const removeSavingsEntry = (id) => setSavingsLog(prev => prev.filter(e => e.id !== id))
  const addSpendingEntry = (entry) => setSpendingLog(prev => [entry, ...prev])
  const removeSpendingEntry = (id) => setSpendingLog(prev => prev.filter(e => e.id !== id))

  const takeHome = Math.round(income * 0.84)
  const monthly = Math.round(takeHome * savingsPct)

  const cls = direction === 'forward' ? 'screen-enter' : 'screen-enter-back'

  let content
  if (screen === 'onboarding') {
    content = (
      <OnboardingScreen key="onboarding" className={cls}
        palette={palette} income={income} name={name}
        onNameChange={setName}
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
        onBack={() => navigate(name ? 'feed' : 'onboarding')}
        onNext={() => { setDreamSource('slider'); navigate('dreams') }} />
    )
  } else if (screen === 'dreams') {
    content = (
      <DreamsScreen key="dreams" className={cls}
        palette={palette} monthlySavings={monthly}
        activeDreamId={activeDreamId}
        onActiveDreamChange={setActiveDreamId}
        dreams={dreams}
        onDreamsChange={setDreams}
        dreamProgress={dreamProgress}
        onDreamProgressChange={setDreamProgress}
        onBack={() => navigate(dreamSource)}
        onNext={() => navigate('insights')} />
    )
  } else if (screen === 'insights') {
    content = (
      <InsightsScreen key="insights" className={cls}
        palette={palette} income={income} savingsPct={savingsPct}
        onBack={() => navigate('slider')}
        onTalk={() => navigate('coach')} />
    )
  } else if (screen === 'coach') {
    content = (
      <CoachScreen key="coach" className={cls}
        palette={palette} income={income} savingsPct={savingsPct}
        onSavingsChange={setSavingsPct}
        allocations={allocations}
        onAddAllocation={addAllocation}
        onRemoveAllocation={removeAllocation}
        spendingLog={spendingLog}
        onBack={() => navigate('feed')} />
    )
  } else if (screen === 'budget-page') {
    content = (
      <BudgetScreen key="budget-page" className={cls}
        palette={palette}
        allocations={allocations}
        spendingLog={spendingLog}
        onBack={() => navigate('feed')} />
    )
  } else if (screen === 'savings-page') {
    content = (
      <SavingsSliderScreen key="savings-page" className={cls}
        palette={palette} income={income} savingsPct={savingsPct}
        onSavingsChange={setSavingsPct}
        allocations={allocations}
        onAddAllocation={addAllocation}
        onRemoveAllocation={removeAllocation}
        nextLabel="Done"
        onBack={() => navigate('feed')}
        onNext={() => navigate('feed')} />
    )
  } else if (screen === 'dreams-page') {
    content = (
      <DreamsScreen key="dreams-page" className={cls}
        palette={palette} monthlySavings={monthly}
        activeDreamId={activeDreamId}
        onActiveDreamChange={setActiveDreamId}
        dreams={dreams}
        onDreamsChange={setDreams}
        dreamProgress={dreamProgress}
        onDreamProgressChange={setDreamProgress}
        nextLabel="Done"
        onBack={() => navigate('feed')}
        onNext={() => navigate('feed')} />
    )
  } else if (screen === 'income-setup') {
    content = (
      <UpdateEarningsScreen key="income-setup" className={cls}
        palette={palette} income={income}
        onIncomeChange={setIncome}
        onBack={() => navigate('feed')} />
    )
  } else {
    content = (
      <FeedChicoScreen key="feed" className={cls}
        palette={palette} name={name} income={income}
        savingsPct={savingsPct} monthly={monthly}
        savingsLog={savingsLog} spendingLog={spendingLog}
        allocations={allocations}
        activeDreamId={activeDreamId}
        dreams={dreams}
        dreamProgress={dreamProgress}
        onAddEntry={addSavingsEntry}
        onRemoveEntry={removeSavingsEntry}
        onAddSpend={addSpendingEntry}
        onRemoveSpend={removeSpendingEntry}
        onGoSlider={() => navigate('savings-page')}
        onGoDreams={() => navigate('dreams-page')}
        onGoCoach={() => navigate('coach')}
        onGoBudget={() => navigate('budget-page')}
        onGoIncomeSetup={() => navigate('income-setup')}
        themeKey={themeKey} onThemeChange={setThemeKey}
        fontChoice={fontChoice} onFontChange={setFontChoice} />
    )
  }

  return (
    <div className="app-frame" style={{ background: palette.bg, transition: 'background .3s' }}>
      {content}
    </div>
  )
}
