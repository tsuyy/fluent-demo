import { useState } from 'react'
import './styles/tokens.css'
import './index.css'
 
import ThesisScreen             from './screens/ThesisScreen'
import LoadingScreen            from './screens/LoadingScreen'
import PersonaPicker            from './screens/PersonaPicker'
import WhatFluentNoticed        from './screens/WhatFluentNoticed'
import HomeScreen               from './screens/HomeScreen'
import Flow2Screen              from './screens/Flow2Screen'
import SomethingDifferentScreen from './screens/SomethingDifferentScreen'
import MovementRecoveryScreen   from './screens/MovementRecoveryScreen'
import HeartNervousSystemScreen from './screens/HeartNervousSystemScreen'
import SleepScreen              from './screens/SleepScreen'
import HowIveChangedScreen      from './screens/HowIveChangedScreen'
import MomentsScreen            from './screens/MomentsScreen'
import ScrollytellingScreen     from './screens/ScrollytellingScreen'
 
export default function App() {
  const [screen,          setScreen]          = useState('thesis')
  const [persona,         setPersona]         = useState(null)
  const [flow2Card,       setFlow2Card]       = useState(null)
  const [visitedPersonas, setVisitedPersonas] = useState(new Set())
  const [pickerPrev,      setPickerPrev]      = useState('noticed') // where picker's back button goes
 
  // ── Helpers ───────────────────────────────────────────────────────────────
 
  function goToPicker(from) {
    setPickerPrev(from)
    setScreen('picker')
  }
 
  // Flow2Screen emits 'flow2:cardId' for next-insight, 'picker' for persona chip,
  // 'home' for last-card CTA, and category strings for other nav.
  function handleFlow2Navigate(target) {
    if (target.startsWith('flow2:')) {
      setFlow2Card(target.slice(6))
      // stay on flow2 screen — card change handled by the prop update
    } else if (target === 'picker') {
      goToPicker('flow2')
    } else {
      setScreen(target)
    }
  }
 
  // ── Primary path ──────────────────────────────────────────────────────────
 
  if (screen === 'thesis') return (
    <ThesisScreen
      onContinue={() => {
        setPersona('yvonne')
        setScreen('loading')
      }}
    />
  )
 
  // ── Loading (shared) ──────────────────────────────────────────────────────
 
  if (screen === 'loading') return (
    <LoadingScreen
      persona={persona}
      isRepeatVisit={visitedPersonas.has(persona)}
      onComplete={() => {
        setVisitedPersonas(prev => new Set([...prev, persona]))
        setScreen('noticed')
      }}
    />
  )
 
  // ── What Fluent Noticed ───────────────────────────────────────────────────
 
  if (screen === 'noticed') return (
    <WhatFluentNoticed
      persona={persona}
      onExplore={(dest) => {
        if (dest === 'home') {
          setScreen('home')
        } else {
          setFlow2Card(dest)
          setScreen('flow2')
        }
      }}
      onHome={() => setScreen('thesis')}         // fluent wordmark → thesis
      onSwitch={() => goToPicker('noticed')}     // persona chip → picker
    />
  )
 
  // ── Flow 2 ────────────────────────────────────────────────────────────────
 
  if (screen === 'flow2') return (
    <Flow2Screen
      key={flow2Card}                            // remounts on card change so state resets cleanly
      cardId={flow2Card || 'rhr_shift'}
      persona={persona}
      onBack={() => setScreen('noticed')}
      onNavigate={handleFlow2Navigate}
    />
  )
 
  // ── Home ──────────────────────────────────────────────────────────────────
 
  if (screen === 'home') return (
    <HomeScreen
      persona={persona}
      onNavigate={(cat) => {
        if (cat === 'secondary') {
          goToPicker('home')
        } else {
          setScreen(cat)
        }
      }}
      onBack={() => setScreen('noticed')}
      onPersonaSwitch={() => goToPicker('home')}
    />
  )
 
  // ── Persona picker ────────────────────────────────────────────────────────
 
  if (screen === 'picker') return (
    <PersonaPicker
      currentPersona={persona}
      onSelect={(p) => {
        setPersona(p)
        setScreen('loading')
      }}
      onBack={() => setScreen(pickerPrev)}
    />
  )
 
  // ── Category screens ──────────────────────────────────────────────────────
 
  if (screen === 'different') return (
    <SomethingDifferentScreen
      persona={persona}
      onNavigate={(cat) => {
        if (cat === 'picker') {
          goToPicker('different')  
        } else {
          setScreen(cat)
        }
      }}      
      onBack={() => setScreen('home')}
      onFlow2={(cardId) => { setFlow2Card(cardId); setScreen('flow2') }}
    />
  )
 
  if (screen === 'activity') return (
    <MovementRecoveryScreen
      persona={persona}
      onNavigate={(cat) => {
        if (cat === 'picker') {
          goToPicker('activity')   
        } else {
          setScreen(cat)
        }
      }}      
      onBack={() => setScreen('home')}
    />
  )
 
  if (screen === 'cardio') return (
    <HeartNervousSystemScreen
      persona={persona}
      onNavigate={(cat) => {
        if (cat === 'picker') {
          goToPicker('cardio')  
        } else {
          setScreen(cat)
        }
      }}
      onBack={() => setScreen('home')}
    />
  )
 
  if (screen === 'sleep') return (
    <SleepScreen
      persona={persona}
      onNavigate={(cat) => {
        if (cat === 'picker') {
          goToPicker('sleep')  
        } else {
          setScreen(cat)
        }
      }}      
      onBack={() => setScreen('home')}
    />
  )
 
  if (screen === 'changed') return (
    <HowIveChangedScreen
      persona={persona}
      onNavigate={(cat) => {
        if (cat === 'picker') {
          goToPicker('changed')   
        } else {
          setScreen(cat)
        }
      }}
      onBack={() => setScreen('home')}
    />
  )
 
  if (screen === 'moments') return (
    <MomentsScreen
      persona={persona}
      onNavigate={(cat) => {
        if (cat === 'picker') {
          goToPicker('moments')   // ← use the actual screen name as prevScreen
        } else {
          setScreen(cat)
        }
      }}
      onBack={() => setScreen('home')}
    />
  )
 
  if (screen === 'scrollytelling') return (
    <ScrollytellingScreen
      persona={persona}
      onBack={() => setScreen('changed')}
      onComplete={() => setScreen('home')}
    />
  )
 
  // ── Fallback ──────────────────────────────────────────────────────────────
 
  return (
    <ThesisScreen
      onContinue={() => {
        setPersona('yvonne')
        setScreen('loading')
      }}
    />
  )
}
 