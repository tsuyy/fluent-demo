import { useState } from 'react'
import './styles/tokens.css'
import './index.css'
import OnboardingQ1 from './screens/OnboardingQ1'
import OnboardingQ2 from './screens/OnboardingQ2'
import LoadingScreen from './screens/LoadingScreen'
import PersonaPicker from './screens/PersonaPicker'
import WhatFluentNoticed from './screens/WhatFluentNoticed'
import HomeScreen from './screens/HomeScreen'
import Flow2Screen from './screens/Flow2Screen'
import MovementRecoveryScreen from './screens/MovementRecoveryScreen'
import FloatingNav from './components/nav/FloatingNav'
import SleepScreen from './screens/SleepScreen'
import HowIveChangedScreen from './screens/HowIveChangedScreen'
import HeartNervousSystemScreen from './screens/HeartNervousSystemScreen'
import MomentsScreen from './screens/MomentsScreen'
import SomethingDifferentScreen from './screens/SomethingDifferentScreen'
import ScrollytellingScreen from './screens/ScrollytellingScreen'


export default function App() {
  const [screen, setScreen]   = useState('q1')
  const [persona, setPersona] = useState(null)
  const [q1, setQ1]           = useState(null)
  const [q2, setQ2]           = useState(null)
  const [flow2Card, setFlow2Card] = useState(null)


  if (screen === 'q1') return (
    <OnboardingQ1 onSelect={(ans) => { setQ1(ans); setScreen('q2') }} />
  )

  if (screen === 'q2') return (
    <OnboardingQ2 onSelect={(ans) => { setQ2(ans); setScreen('suggestion') }} />
  )

  if (screen === 'suggestion') return (
    <PersonaPicker
        q1={q1} q2={q2}
        onSelect={(p) => { setPersona(p); setScreen('loading') }}
        onBack={() => setScreen('q2')}
    />
  )

  if (screen === 'loading') return (
    <LoadingScreen persona={persona} onComplete={() => setScreen('noticed')} />
  )

  if (screen === 'noticed') return (
    <WhatFluentNoticed
        persona={persona}
        q1={q1}
        onExplore={(dest) => {
        if (dest === 'home' || dest === 'topics') {
            setScreen('home')
        } else {
            setFlow2Card(dest)
            setScreen('flow2')
        }
        }}
        onBack={() => setScreen('suggestion')}
    />
  )

  if (screen === 'flow2') return (
    <Flow2Screen
        cardId={flow2Card || 'monday'}
        persona={persona}
        onBack={() => setScreen('noticed')}
        onNext={() => setScreen('noticed')}
    />
  )

  if (screen === 'home') return (
    <HomeScreen
        persona={persona}
        onNavigate={(cat) => setScreen(cat)}
        onPersonaSwitch={() => setScreen('suggestion')}
    />
  )
  if (screen === 'activity') return (
    <MovementRecoveryScreen
        persona={persona}
        onNavigate={(cat) => setScreen(cat)}
        onBack={() => setScreen('home')}
    />
  )

  if (screen === 'sleep') return (
    <SleepScreen
        persona={persona}
        onNavigate={(cat) => setScreen(cat)}
        onBack={() => setScreen('home')}
    />
  )
  if (screen === 'changed') return (
    <HowIveChangedScreen
        persona={persona}
        onNavigate={(cat) => setScreen(cat)}
        onBack={() => setScreen('home')}
    />
  )
  if (screen === 'cardio') return (
    <HeartNervousSystemScreen
        persona={persona}
        onNavigate={(cat) => setScreen(cat)}
        onBack={() => setScreen('home')}
    />
 )
  if (screen === 'different') return (
    <SomethingDifferentScreen
        persona={persona}
        onNavigate={(cat) => setScreen(cat)}
        onBack={() => setScreen('home')}
        onFlow2={(cardId) => {
        setFlow2Card(cardId)
        setScreen('flow2')
        }}
    />
  )
  if (screen === 'moments') return (
    <MomentsScreen
        persona={persona}
        onNavigate={(cat) => setScreen(cat)}
        onBack={() => setScreen('home')}
    />
  )
}