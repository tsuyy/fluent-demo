import { useState } from 'react'
import { motion } from 'framer-motion'
import FloatingNav from '../components/nav/FloatingNav'
import QuarterlyArcChart from '../components/charts/QuarterlyArcChart'
import SeasonalStepsChart from '../components/charts/SeasonalStepsChart'
import RetirementArcChart from '../components/charts/RetirementArcChart'
import PageContainer from '../components/layout/PageContainer'

const PERSONA_LABELS = { jamie: 'Jamie', yvonne: 'Yvonne', robert: 'Robert', alex: 'Alex' }


const GRADIENTS = {
  jamie:  'radial-gradient(ellipse at 15% 70%, rgba(180,60,60,0.2) 0%, transparent 55%)',
  yvonne: 'radial-gradient(ellipse at 80% 20%, rgba(6,129,252,0.15) 0%, rgba(39,196,138,0.08) 40%, transparent 65%)',
  robert: 'radial-gradient(ellipse at 20% 60%, rgba(39,196,138,0.15) 0%, transparent 55%)',
  alex:   'radial-gradient(ellipse at 60% 30%, rgba(39,196,138,0.1) 0%, transparent 55%)',
}

const METRIC_CARDS = {
  yvonne: [
    {
      label: 'Resting Heart Rate',
      current: '59', unit: 'bpm',
      change: '-7', direction: 'down_good',
      context: 'from 66 when you started',
      insight: 'Your heart takes 10,080 fewer beats every day',
    },
    {
      label: 'HRV',
      current: '45.6', unit: 'ms',
      change: '+37%', direction: 'up_good',
      context: 'above your personal low',
      insight: 'Your nervous system is more than a third more regulated',
    },
    {
      label: 'Breathing Rate',
      current: '15.8', unit: 'br/min',
      change: '-28%', direction: 'down_good',
      context: 'from 20–22 when you started',
      insight: 'The most underrated signal in your data',
    },
    {
      label: 'Active Hours',
      current: '312', unit: 'hr in 2025',
      change: '+58%', direction: 'up_good',
      context: 'vs 198hr in 2022',
      insight: "That's 13 full days of motion more per year",
    },
  ],
  jamie: [
    {
      label: 'Resting Heart Rate',
      current: '70.4', unit: 'bpm',
      change: '-2.7', direction: 'down_good',
      context: 'from 73.1 when you started',
      insight: 'Gradually improving since you started tracking',
    },
    {
      label: 'HRV',
      current: '37.2', unit: 'ms',
      change: '+3.4', direction: 'up_good',
      context: 'above where you started',
      insight: 'Your nervous system is recovering better',
    },
    {
      label: 'Sleep',
      current: '7.1', unit: 'hr avg',
      change: '+0.3', direction: 'up_good',
      context: 'vs 6.8hr when you started',
      insight: 'You sleep most on Mondays — your body resets',
    },
  ],
  robert: [
    {
      label: 'Resting Heart Rate',
      current: '57.2', unit: 'bpm',
      change: '-5.8', direction: 'down_good',
      context: 'from 63 before retirement',
      insight: 'Your heart takes 3,600 fewer beats every day',
    },
    {
      label: 'HRV',
      current: '35.5', unit: 'ms',
      change: '+7', direction: 'up_good',
      context: 'above pre-retirement baseline',
      insight: 'Structured weeks consistently show better recovery',
    },
    {
      label: 'Sleep',
      current: '7.0', unit: 'hr avg',
      change: '+0.6', direction: 'up_good',
      context: 'vs 6.4hr pre-retirement',
      insight: 'Retirement gave your sleep back',
    },
    {
      label: 'Daily Steps',
      current: '6,900', unit: 'avg',
      change: '+33%', direction: 'up_good',
      context: 'vs 5,200 pre-retirement',
      insight: 'You move more in retirement',
    },
  ],
  alex: [
    {
      label: 'Daily Steps',
      current: '8,400', unit: 'avg',
      change: '+500', direction: 'up_good',
      context: 'gradual increase year over year',
      insight: 'Slowly and consistently moving more',
    },
    {
      label: 'Peak Month',
      current: 'October', unit: '',
      change: 'every year', direction: 'stable',
      context: 'without exception',
      insight: 'Your most active month — consistent for 5 years',
    },
  ],
}

const INTERESTING_FACTS = {
  yvonne: [
    { emoji: '🚴', stat: '5,051 cycling miles', context: 'Chicago to Tokyo' },
    { emoji: '🏃', stat: '1,248 running miles', context: 'Started Jan 2024. Just to see if you could.' },
    { emoji: '🎾', stat: '+5.5ms HRV after tennis', context: 'Your strongest recovery signal. More than any other sport.' },
    { emoji: '⛷️', stat: '−10.4ms HRV from skiing', context: 'Costs the most. You ski anyway. That\'s not optimization — that\'s agency.' },
    { emoji: '❤️', stat: '10,080 fewer heartbeats/day', context: 'Than when you started tracking.' },
    { emoji: '😴', stat: 'You sleep most on Mondays', context: '7.7 hr avg. Your body resets after the weekend.' },
  ],
  robert: [
    { emoji: '❤️', stat: '3,600 fewer heartbeats/day', context: 'Than before you retired.' },
    { emoji: '🏌️', stat: 'Structured weeks: 57.9 bpm', context: 'vs 62.0 on unstructured weeks. Structure is a health variable.' },
    { emoji: '😴', stat: '36 more minutes of sleep', context: 'Per night vs pre-retirement. Retirement gave it back.' },
  ],
  alex: [
    { emoji: '📱', stat: '5 years of steps', context: 'October peaks and February dips — every single year.' },
    { emoji: '📈', stat: '+500 steps/day', context: 'Gradual increase across 5 years.' },
  ],
}

function MetricCard({ card, delay }) {
  const isGood = card.direction === 'up_good' || card.direction === 'down_good'
  const arrow  = card.direction === 'up_good' ? '↑' : card.direction === 'down_good' ? '↓' : '→'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, padding: '16px',
      }}
    >
      <p style={{
        fontSize: 10, letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.3)',
        marginBottom: 10,
      }}>
        {card.label}
      </p>
      <div style={{
        display: 'flex', alignItems: 'baseline',
        gap: 6, marginBottom: 4,
      }}>
        <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
          {card.current}
        </span>
        {card.unit && (
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            {card.unit}
          </span>
        )}
      </div>
      <p style={{
        fontSize: 12,
        color: isGood ? '#27C48A' : 'rgba(255,255,255,0.4)',
        marginBottom: 4,
      }}>
        {arrow} {card.change} {card.context}
      </p>
      <p style={{
        fontSize: 11,
        color: 'rgba(255,255,255,0.25)',
        lineHeight: 1.5, marginTop: 8,
        fontStyle: 'italic',
      }}>
        "{card.insight}"
      </p>
    </motion.div>
  )
}

function FactCard({ fact, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10, padding: '14px 16px',
        display: 'flex', gap: 14, alignItems: 'flex-start',
      }}
    >
      <span style={{ fontSize: 20 }}>{fact.emoji}</span>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>
          {fact.stat}
        </p>
        <p style={{
          fontSize: 12, color: 'rgba(255,255,255,0.35)',
          lineHeight: 1.5,
        }}>
          {fact.context}
        </p>
      </div>
    </motion.div>
  )
}

export default function HowIveChangedScreen({ persona, onNavigate, onBack }) {
  const gradient = GRADIENTS[persona] || GRADIENTS.yvonne
  const metricCards = METRIC_CARDS[persona] || METRIC_CARDS.yvonne
  const facts = INTERESTING_FACTS[persona] || []
  const isYvonne = persona === 'yvonne'
  const isRobert = persona === 'robert'
  const isAlex   = persona === 'alex'

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--color-base)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      flex: 1, overflowY: 'auto',
    }}>
      <PageContainer>
      <div style={{
        position: 'absolute', inset: 0,
        background: gradient, pointerEvents: 'none',
      }} />

      {/* Nav */}
      <div style={{
        position: 'fixed', top: 32, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', zIndex: 20,
      }}>
        <motion.span
          whileHover={{ opacity: 0.7 }}
          onClick={onBack}
          style={{ fontSize: 16, fontWeight: 500, cursor: 'pointer' }}
        >
          fluent
        </motion.span>
        <motion.span
          whileHover={{ opacity: 0.7 }}
          onClick={() => onNavigate('picker')}
          style={{
            fontSize: 14,
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            flexShrink: 0, whiteSpace: 'nowrap',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20, padding: '4px 12px',
          }}
        >
          {PERSONA_LABELS[persona] || persona}
        </motion.span>
      </div>

      {/* Scrollable content */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '80px 64px 120px',
        position: 'relative', zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 40 }}
        >
          <h1 style={{
            fontSize: 'clamp(24px, 3vw, 40px)',
            fontWeight: 700, marginBottom: 6,
          }}>
            How I've changed over time
          </h1>
          <p style={{
            color: 'var(--color-text-secondary)', fontSize: 15,
          }}>
            How your body has shifted over months and years
          </p>
        </motion.div>

        {/* Metric trend cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${metricCards.length}, 1fr)`,
          gap: 16, marginBottom: 32,
        }}>
          {metricCards.map((card, i) => (
            <MetricCard key={card.label} card={card} delay={0.1 + i * 0.06} />
          ))}
        </div>

        {/* Hero chart — Yvonne: quarterly arc, Robert: retirement, Alex: steps */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '20px 20px 12px',
            marginBottom: 32,
          }}
        >
          {isYvonne && (
            <>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Your cardiovascular arc — 18 quarters
              </p>
              <p style={{
                fontSize: 11, color: 'var(--color-text-tertiary)',
                marginBottom: 16,
              }}>
                RHR declining · HRV climbing · the two lines diverging is the story
              </p>
              <QuarterlyArcChart height={280} />
            </>
          )}
          {isRobert && (
            <>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Your cardiovascular arc — 2 years
              </p>
              <p style={{
                fontSize: 11, color: 'var(--color-text-tertiary)',
                marginBottom: 16,
              }}>
                Before retirement · transition · new equilibrium
              </p>
              <RetirementArcChart height={220} />
            </>
          )}
          {isAlex && (
            <>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                5 years of movement — seasonal pattern
              </p>
              <p style={{
                fontSize: 11, color: 'var(--color-text-tertiary)',
                marginBottom: 16,
              }}>
                October peak · February quiet · every year
              </p>
              <SeasonalStepsChart height={200} />
            </>
          )}
          {!isYvonne && !isRobert && !isAlex && (
            <>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                8 months of trends
              </p>
              <p style={{
                fontSize: 11, color: 'var(--color-text-tertiary)',
                marginBottom: 16,
              }}>
                The patterns are starting to emerge
              </p>
              <div style={{
                height: 180,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
              }}>
                <p style={{
                  color: 'rgba(255,255,255,0.2)', fontSize: 12,
                  textAlign: 'center', lineHeight: 1.8,
                }}>
                  "Come back in a year.<br />
                  The arc will be clearer."
                </p>
              </div>
            </>
          )}
        </motion.div>

        {/* Interesting facts */}
        {facts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              What the data found
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isYvonne ? '1fr 1fr' : '1fr',
              gap: 12,
            }}>
              {facts.map((fact, i) => (
                <FactCard
                  key={fact.stat}
                  fact={fact}
                  delay={0.5 + i * 0.05}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
       {['yvonne', 'robert'].includes(persona) && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 48 }}>
          <motion.button
            onClick={() => onNavigate('scrollytelling')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8, padding: '12px 24px',
              color: 'var(--color-text-secondary)',
              fontSize: 14, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Your 2026 story →
          </motion.button>
        </div>
      )}
        </PageContainer>

      <FloatingNav active="changed" onNavigate={onNavigate} />
    </div>
  )
}