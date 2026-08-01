import { useState } from 'react'
import { motion } from 'framer-motion'
import WeeklyRhythmChart from '../components/charts/WeeklyRhythmChart'
import SportHRVChart from '../components/charts/SportHRVChart'
import RHRTrendChart from '../components/charts/RHRTrendChart'



const CARDS = {
  jamie: [
    {
      id: 'monday',
      headline: 'Your Mondays are actually your best days',
      subtitle: 'Your weekends seem to be costing you more than your work week does — the opposite of what you might expect.',
      viz: 'weekly_rhythm',
    },
    {
      id: 'sleep_hrv',
      headline: 'Your sleep looked fine — your HRV says otherwise',
      subtitle: 'Some weeks your sleep tracked normally, but your HRV tells a different story.',
      viz: 'sleep_hrv_quadrant',
    },
  ],
  yvonne: [
    {
      id: 'rhr_shift',
      headline: 'Your RHR has quietly shifted',
      subtitle: "Your resting heart rate has been lower than usual for the past two weeks. Fluent noticed — but doesn't know why yet.",
      viz: 'rhr_trend',
    },
    {
      id: 'tennis',
      headline: 'Tennis might be your best recovery tool',
      subtitle: 'Out of everything you do, tennis produces the strongest recovery response — more than any other activity in your data.',
      viz: 'sport_hrv',
    },
  ],
  robert: [
    {
      id: 'retirement',
      headline: 'Retirement left a mark on your heart rate',
      subtitle: 'Your resting heart rate settled into a new, healthier pattern after you retired.',
      viz: 'retirement_arc',
    },
    {
      id: 'silence',
      headline: 'Nothing stood out this quarter — and that\'s worth knowing',
      subtitle: 'Your key patterns are all consistent with how you\'ve been trending. No news is the finding here.',
      viz: null,
    },
  ],
  alex: [
    {
      id: 'seasonal',
      headline: 'October was your most active month — February your quietest',
      subtitle: "Your steps follow a seasonal rhythm you've probably felt but never seen confirmed.",
      viz: 'seasonal_steps',
    },
    {
      id: 'capability',
      headline: "Here's what steps can't tell you",
      subtitle: "Your activity patterns are clear, but Fluent can't see whether those active days left you energized or depleted.",
      viz: 'capability_gap',
    },
  ],
}

const GRADIENTS = {
  jamie:  'radial-gradient(ellipse at 30% 70%, rgba(180,60,60,0.3) 0%, transparent 60%)',
  yvonne: 'radial-gradient(ellipse at 70% 30%, rgba(6,129,252,0.2) 0%, rgba(39,196,138,0.1) 50%, transparent 70%)',
  robert: 'radial-gradient(ellipse at 20% 50%, rgba(39,196,138,0.2) 0%, transparent 60%)',
  alex:   'radial-gradient(ellipse at 60% 40%, rgba(39,196,138,0.15) 0%, transparent 60%)',
}

const Q1_ROUTES = {
  workouts:  'movement & recovery',
  love:      'how I\'ve changed over time',
  different: 'something feels different',
  explore:   'exploring your data',
}

function VizPlaceholder({ type, persona }) {
  if (type === 'weekly_rhythm' && persona === 'jamie') {
    return <WeeklyRhythmChart />
  }
  if (type === 'sport_hrv') {
    return <SportHRVChart height={160} />
  }
  if (type === 'rhr_trend') {
    return <RHRTrendChart height={140} />
  }
  if (!type) return null
    return (
    <div style={{
      height: 140,
      background: 'rgba(255,255,255,0.05)',
      borderRadius: 8,
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', margin: '16px 0',
    }}>
      <span style={{
        color: 'var(--color-text-tertiary)',
        fontSize: 11, letterSpacing: '0.05em',
      }}>
        {type?.replace(/_/g, ' ')}
      </span>
    </div>
  )
}

export default function WhatFluentNoticed({ persona, q1, onExplore, onBack }) {
  const [flow2Card, setFlow2Card] = useState(null)
  const cards = CARDS[persona] || CARDS.yvonne
  const gradient = GRADIENTS[persona] || GRADIENTS.yvonne
  const routeLabel = Q1_ROUTES[q1] || 'your data'

  return (
    <div style={{
        width: '100vw',
        height: '100vh',
        background: 'var(--color-base)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px 48px 0',    // ← no bottom padding
     }}>

      {/* Background gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: gradient, pointerEvents: 'none',
      }} />

      {/* Nav */}
      <div style={{
        position: 'absolute', top: 32, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', zIndex: 10,
      }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>fluent</span>
        <span style={{
          fontSize: 14, color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          textTransform: 'capitalize',
        }}>
          {persona}
        </span>
      </div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          fontSize: 'clamp(32px, 4vw, 52px)',
          fontWeight: 700, marginBottom: 48,
          position: 'relative', zIndex: 1,
          marginTop: 16,
        }}
      >
        Here's what Fluent noticed
      </motion.h1>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20, 
        alignItems: 'start',
        position: 'relative', zIndex: 1,
        overflow:'hidden',
      }}>
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
            onClick={() => onExplore(card.id)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'border-color 0.2s, transform 0.2s',
              minHeight: 320,
              maxHeight: 440,
            }}
            whileHover={{
              borderColor: 'rgba(255,255,255,0.2)',
              y: -2,
            }}
          >
            <h2 style={{
              fontSize: 'clamp(16px, 1.5vw, 22px)',
              fontWeight: 600,
              lineHeight: 1.3,
              marginBottom: 12,
            }}>
              {card.headline}
            </h2>

            <VizPlaceholder type={card.viz} persona={persona} />

            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: 14,
              lineHeight: 1.6,
            }}>
              {card.subtitle}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bottom nav — fixed to bottom of screen */}
        <div style={{
        position: 'fixed',
        bottom: 32,
        left: 48,
        right: 48,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        zIndex: 100,
        pointerEvents: 'none',
        }}>
        <span
            onClick={onBack}
            style={{
            color: 'var(--color-text-tertiary)',
            fontSize: 14, cursor: 'pointer',
            pointerEvents: 'all',
            }}
        >
            ← explore other sample data
        </span>

        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 8,
            pointerEvents: 'all',
        }}>
            <span
            onClick={() => onExplore('home')}
            style={{
                color: 'var(--color-text-primary)',
                fontSize: 15, cursor: 'pointer',
                fontWeight: 500,
                whiteSpace: 'nowrap',
            }}
            >
            go straight to {routeLabel} →
            </span>
            <span
            onClick={() => onExplore('topics')}
            style={{
                color: 'var(--color-text-tertiary)',
                fontSize: 13, cursor: 'pointer',
                whiteSpace: 'nowrap',
            }}
            >
            explore other topics
            </span>
        </div>
        </div>
    </div>
  )
}
