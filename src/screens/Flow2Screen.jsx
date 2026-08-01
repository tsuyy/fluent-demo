import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WeeklyRhythmChart from '../components/charts/WeeklyRhythmChart'

const FLOW2_CONTENT = {
  monday: {
    persona: 'jamie',
    headline: 'Your Mondays are actually your best days',
    subtitle: 'Your weekends seem to be costing you more than your work week does — the opposite of what you might expect.',
    explanation: 'Your resting heart rate is consistently lower on Mondays than any other day — lower than Friday, lower than Saturday and Sunday. This pattern has shown up in 7 of the last 8 weeks.',
    dataNote: 'Based on 8 weeks of available data. Some weekend readings are missing where her tracker wasn\'t worn.',
    question: 'Does this match how your Mondays typically feel?',
    questionType: 'felt',
    chips: ['Yes', 'Not really', 'Skip'],
    contextQuestion: 'Anything come to mind about your weekends?',
    contextChips: ['Late night', 'Social', 'Alcohol', 'Travel', 'Stress', 'Busy weekend', 'Other', 'Skip'],
    acknowledgment: 'Worth knowing either way — your weekends are likely setting your Mondays, not the other way around.',
    chart: 'weekly_rhythm',
  },
}

export default function Flow2Screen({ cardId, persona, onBack, onNext }) {
  const [step, setStep]           = useState('chart')  // chart | question | context | ack
  const [feltAnswer, setFeltAnswer] = useState(null)
  const [contextChips, setContextChips] = useState([])

  const content = FLOW2_CONTENT[cardId] || FLOW2_CONTENT.monday

  function handleFelt(answer) {
    setFeltAnswer(answer)
    if (answer === 'Skip') {
      setStep('ack')
    } else {
      setStep('context')
    }
  }

  function toggleContext(chip) {
    if (chip === 'Skip') { setStep('ack'); return }
    setContextChips(prev =>
      prev.includes(chip)
        ? prev.filter(c => c !== chip)
        : [...prev, chip]
    )
  }

  function handleContextDone() {
    setStep('ack')
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'var(--color-base)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative',
    }}>

      {/* Background gradient */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 20% 80%, rgba(180,60,60,0.2) 0%, transparent 60%)',
      }} />

      {/* Nav */}
      <div style={{
        position: 'absolute', top: 32, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', zIndex: 10,
      }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>fluent</span>
        <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          {persona}
        </span>
      </div>

      {/* Main content — scrollable */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '80px 120px 120px',
        position: 'relative', zIndex: 1,
      }}>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 'clamp(24px, 3vw, 42px)',
            fontWeight: 700, marginBottom: 12,
            lineHeight: 1.2,
          }}
        >
          {content.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 16, lineHeight: 1.6,
            marginBottom: 32, maxWidth: 640,
          }}
        >
          {content.subtitle}
        </motion.p>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '16px 16px 8px',
            marginBottom: 8,
          }}
        >
          {/* Metric toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            {['RHR', 'HRV'].map(m => (
              <span key={m} style={{
                background: m === 'RHR' ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)',
                borderRadius: 20, padding: '4px 12px',
                fontSize: 12, fontWeight: 500,
                cursor: 'pointer',
                color: m === 'RHR' ? '#fff' : 'var(--color-text-secondary)',
              }}>
                {m}
              </span>
            ))}
          </div>
          <WeeklyRhythmChart />
        </motion.div>

        {/* Data note */}
        <p style={{
          color: 'var(--color-text-tertiary)',
          fontSize: 12, marginBottom: 32,
          lineHeight: 1.5,
        }}>
          {content.dataNote}
        </p>

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: 32 }}
        >
          <p style={{
            fontSize: 16, lineHeight: 1.7,
            color: 'var(--color-text-primary)',
            maxWidth: 600,
          }}>
            {content.explanation}
          </p>
        </motion.div>

        {/* Verification section */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: 24,
            maxWidth: 600,
          }}
        >
          {/* Felt question */}
          <p style={{ fontSize: 15, marginBottom: 16, lineHeight: 1.5 }}>
            {content.question}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {content.chips.map(chip => (
              <motion.span
                key={chip}
                onClick={() => step === 'chart' && handleFelt(chip)}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: feltAnswer === chip
                    ? 'rgba(6,129,252,0.2)'
                    : 'rgba(255,255,255,0.08)',
                  border: feltAnswer === chip
                    ? '1px solid rgba(6,129,252,0.5)'
                    : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 20, padding: '8px 16px',
                  fontSize: 13, cursor: 'pointer',
                  color: feltAnswer === chip
                    ? '#0681fc'
                    : 'var(--color-text-secondary)',
                  transition: 'all 0.15s',
                }}
              >
                {chip}
              </motion.span>
            ))}
          </div>

          {/* Context question — appears after felt answer */}
          <AnimatePresence>
            {step === 'context' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p style={{
                  fontSize: 14,
                  color: 'var(--color-text-secondary)',
                  marginBottom: 12,
                }}>
                  {content.contextQuestion}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {content.contextChips.map(chip => (
                    <motion.span
                      key={chip}
                      onClick={() => toggleContext(chip)}
                      whileHover={{ scale: 1.02 }}
                      style={{
                        background: contextChips.includes(chip)
                          ? 'rgba(39,196,138,0.15)'
                          : 'rgba(255,255,255,0.06)',
                        border: contextChips.includes(chip)
                          ? '1px solid rgba(39,196,138,0.4)'
                          : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 20, padding: '6px 14px',
                        fontSize: 12, cursor: 'pointer',
                        color: contextChips.includes(chip)
                          ? '#27C48A'
                          : 'var(--color-text-tertiary)',
                        transition: 'all 0.15s',
                      }}
                    >
                      {chip}
                    </motion.span>
                  ))}
                </div>
                {contextChips.length > 0 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleContextDone}
                    style={{
                      fontSize: 13,
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textDecorationColor: 'rgba(255,255,255,0.2)',
                    }}
                  >
                    done →
                  </motion.span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Acknowledgment */}
          <AnimatePresence>
            {step === 'ack' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p style={{
                  fontSize: 14,
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: 16,
                }}>
                  {content.acknowledgment}
                </p>
                {contextChips.length > 0 && (
                  <p style={{
                    fontSize: 12,
                    color: 'var(--color-recovery)',
                    marginTop: 8,
                  }}>
                    ✓ saved
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fixed navigation */}
      <div style={{
        position: 'fixed',
        bottom: 32, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', zIndex: 100,
      }}>
        <motion.span
          onClick={onBack}
          whileHover={{ opacity: 0.7 }}
          style={{
            color: 'var(--color-text-tertiary)',
            fontSize: 14, cursor: 'pointer',
          }}
        >
          ←
        </motion.span>

        {step === 'ack' && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onNext}
            style={{
              color: 'var(--color-text-primary)',
              fontSize: 14, cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            next insight →
          </motion.span>
        )}
      </div>
    </div>
  )
}