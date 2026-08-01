import { useState } from 'react'
import './styles/tokens.css'
import './index.css'
import OnboardingQ1 from './screens/OnboardingQ1'
import OnboardingQ2 from './screens/OnboardingQ2'
import LoadingScreen from './screens/LoadingScreen'
import PersonaPicker from './screens/PersonaPicker'
import WhatFluentNoticed from './screens/WhatFluentNoticed'
import HomeScreen from './screens/HomeScreen'

// Temporary placeholder
function PlaceholderScreen({ name, onNext }) {
  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'var(--color-base)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 24,
    }}>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
        {name}
      </p>
      <button
        onClick={onNext}
        style={{
          background: 'var(--color-accent)',
          color: '#fff', border: 'none',
          padding: '12px 24px', borderRadius: 8,
          cursor: 'pointer', fontSize: 16,
        }}
      >
        Next →
      </button>
    </div>
  )
}

export default function App() {
  const [screen, setScreen]   = useState('q1')
  const [persona, setPersona] = useState(null)
  const [q1, setQ1]           = useState(null)
  const [q2, setQ2]           = useState(null)

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
    />
  )

  if (screen === 'loading') return (
    <LoadingScreen persona={persona} onComplete={() => setScreen('noticed')} />
  )

  if (screen === 'noticed') return (
    <WhatFluentNoticed
        persona={persona}
        q1={q1}
        onExplore={(dest) => setScreen(dest === 'home' || dest === 'topics' ? 'home' : 'flow2')}
        onBack={() => setScreen('suggestion')}
    />
  )

  if (screen === 'home') return (
    <HomeScreen
        persona={persona}
        onNavigate={(cat) => setScreen(cat)}
        onPersonaSwitch={() => setScreen('suggestion')}
    />
  )
}