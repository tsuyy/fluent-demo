import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingNav from '../components/nav/FloatingNav'
import PageContainer from '../components/layout/PageContainer'

const SIGNALS = [
  { id: 'energy',   label: 'My energy feels off',      emoji: '⚡' },
  { id: 'sleep',    label: 'My sleep feels different',  emoji: '😴' },
  { id: 'recovery', label: 'I\'m not recovering well',  emoji: '💪' },
  { id: 'physical', label: 'Something feels physical',  emoji: '🫀' },
  { id: 'unsure',   label: 'I\'m not sure — show me',   emoji: '🔍' },
]

// Maps felt signal to the most relevant card + explanation
const SIGNAL_ROUTES = {
  jamie: {
    energy:   { cardId: 'monday',    reason: 'Your weekly rhythm shows a consistent pattern that might explain your energy levels.' },
    sleep:    { cardId: 'sleep_hrv', reason: 'Your sleep and HRV don\'t always agree — that mismatch often explains how you feel.' },
    recovery: { cardId: 'monday',    reason: 'Weekend activity appears to be affecting your weekly recovery pattern.' },
    physical: { cardId: 'sleep_hrv', reason: 'HRV is often the first signal when something physical is shifting.' },
    unsure:   { cardId: null,        reason: null }, // shows both cards
  },
  yvonne: {
    energy:   { cardId: 'rhr_shift', reason: 'Your resting heart rate has been shifting — that often shows up as felt energy changes.' },
    sleep:    { cardId: 'rhr_shift', reason: 'Sleep quality directly affects your RHR. The shift we noticed may be related.' },
    recovery: { cardId: 'tennis',   reason: 'Your sport recovery patterns show clear differences — tennis vs skiing especially.' },
    physical: { cardId: 'rhr_shift', reason: 'Your RHR has been notably lower than usual — worth investigating.' },
    unsure:   { cardId: null,        reason: null },
  },
  robert: {
    energy:   { cardId: 'retirement', reason: 'Your cardiovascular baseline shifted significantly around retirement.' },
    sleep:    { cardId: 'retirement', reason: 'Sleep patterns changed after retirement — structure seems to matter.' },
    recovery: { cardId: 'retirement', reason: 'Your recovery metrics follow your week structure closely.' },
    physical: { cardId: 'retirement', reason: 'Your heart rate has settled into a new baseline — worth seeing the arc.' },
    unsure:   { cardId: null,         reason: null },
  },
  alex: {
    energy: {
        cardId: 'seasonal',
        reason: 'Your step patterns show when you move more and less — that seasonal rhythm may be related to your energy levels.',
    },
    sleep: {
        cardId: null,
        wearableOnly: true,
        reason: 'Sleep signals require overnight wearable tracking. Steps alone can\'t explain sleep changes.',
    },
    recovery: {
        cardId: null,
        wearableOnly: true,
        reason: 'Recovery signals like HRV require a wearable worn overnight. Steps show movement volume but not how your body responded.',
    },
    physical: {
        cardId: null,
        wearableOnly: true,
        reason: 'Cardiovascular signals require overnight wearable tracking. Steps can\'t show how your heart is adapting.',
    },
    unsure: {
        cardId: 'seasonal',
        reason: 'Here\'s what your step data shows — and where a wearable would add depth.',
    },
  },
}

export default function SomethingDifferentScreen({
  persona, onNavigate, onBack, onFlow2
}) {
  const [selected, setSelected] = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  const routes = SIGNAL_ROUTES[persona] || SIGNAL_ROUTES.jamie
  const route = selected ? routes[selected] : null

  function handleSelect(id) {
    setSelected(id)
    setConfirmed(false)
  }

  function handleInvestigate() {
    if (!route) return
    if (route.cardId) {
      onFlow2(route.cardId)
    } else {
      onNavigate('noticed') // show all cards
    }
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--color-base)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      flex: 1,
    }}>

      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(232,80,74,0.08) 0%, transparent 60%)',
      }} />

      {/* Nav */}
      <div style={{
        position: 'absolute', top: 32, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', zIndex: 10,
      }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>fluent</span>
        <span
          onClick={() => onNavigate('switch')}
          style={{
            fontSize: 14, color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
        >
          {persona}
        </span>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '100px 24px 120px',
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center',
      }}>
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 48 }}
          >
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 700, marginBottom: 12,
              lineHeight: 1.15,
            }}>
              Something feels different lately.
            </h1>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: 16, lineHeight: 1.6,
            }}>
              Let's see if the data can help explain it.
              What's feeling different?
            </p>
          </motion.div>

          {/* Signal chips */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            gap: 12, marginBottom: 40,
          }}>
            {SIGNALS.map((signal, i) => {
              const isSelected = selected === signal.id
              return (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  onClick={() => handleSelect(signal.id)}
                  whileHover={{ x: 4 }}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: 16, padding: '12px 20px',
                    background: isSelected
                      ? 'rgba(6,129,252,0.1)'
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isSelected
                      ? 'rgba(6,129,252,0.4)'
                      : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 12, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 20 }}>{signal.emoji}</span>
                  <span style={{
                    fontSize: 16,
                    color: isSelected
                      ? 'var(--color-text-primary)'
                      : 'var(--color-text-secondary)',
                    fontWeight: isSelected ? 500 : 400,
                  }}>
                    {signal.label}
                  </span>
                  {isSelected && (
                    <span style={{
                      marginLeft: 'auto',
                      color: 'var(--color-accent)',
                      fontSize: 14,
                    }}>
                      ✓
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Response — appears after selection */}
          <AnimatePresence>
            {selected && route && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12, padding: '20px 24px',
                    marginBottom: 24,
                    }}
                >
                    {route.wearableOnly ? (
                    // Steps can't explain this signal
                    <>
                        <p style={{
                        fontSize: 14, lineHeight: 1.7,
                        color: 'var(--color-text-secondary)',
                        marginBottom: 16,
                        }}>
                        {route.reason}
                        </p>
                        <p style={{
                        fontSize: 13,
                        color: 'var(--color-text-tertiary)',
                        lineHeight: 1.6, marginBottom: 20,
                        }}>
                        A wearable worn overnight would capture the signals
                        that explain this — HRV, resting heart rate, sleep staging.
                        </p>
                        <motion.span
                        onClick={() => onNavigate('changed')}
                        whileHover={{ opacity: 0.8 }}
                        style={{
                            color: 'var(--color-accent)',
                            fontSize: 14, cursor: 'pointer',
                            display: 'block',
                        }}
                        >
                        See what Yvonne's data shows with a wearable →
                        </motion.span>
                    </>
                    ) : route.cardId ? (
                    // Has a card to investigate
                    <>
                        <p style={{
                        fontSize: 14, lineHeight: 1.7,
                        color: 'var(--color-text-secondary)',
                        marginBottom: 20,
                        }}>
                        {route.reason}
                        </p>
                        <motion.button
                        onClick={handleInvestigate}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            background: 'var(--color-accent)',
                            border: 'none', borderRadius: 8,
                            padding: '12px 24px',
                            color: '#fff', fontSize: 14,
                            fontWeight: 500, cursor: 'pointer',
                            fontFamily: 'inherit',
                        }}
                        >
                        Investigate this →
                        </motion.button>
                    </>
                    ) : selected === 'unsure' ? (
                    // Not sure — show noticed cards
                    <motion.button
                        onClick={() => onNavigate('noticed')}
                        whileHover={{ scale: 1.02 }}
                        style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 8, padding: '12px 24px',
                        color: '#fff', fontSize: 14,
                        fontWeight: 500, cursor: 'pointer',
                        fontFamily: 'inherit',
                        }}
                    >
                        Show me what Fluent noticed →
                    </motion.button>
                    ) : (
                    // Fallback
                    <motion.button
                        onClick={() => onNavigate('noticed')}
                        style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 8, padding: '12px 24px',
                        color: '#fff', fontSize: 14,
                        fontWeight: 500, cursor: 'pointer',
                        fontFamily: 'inherit',
                        }}
                    >
                        Show me what Fluent noticed →
                    </motion.button>
                    )}
                </motion.div>
                )}
            </AnimatePresence>
        </PageContainer>
      </div>

      <FloatingNav active="different" onNavigate={onNavigate} />
    </div>
  )
}