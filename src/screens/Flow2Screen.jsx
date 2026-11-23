import { useState } from 'react'
import FloatingNav from '../components/nav/FloatingNav'
import { useIsNarrow } from '../components/scrolly/useIsNarrow'
import { motion, AnimatePresence } from 'framer-motion'
import IllnessArcChart      from '../components/charts/IllnessArcChart'
import SoberExperimentChart from '../components/charts/SoberExperimentChart'
import illnessArcData        from '../data/yvonne/illness_arc.json'
import soberData              from '../data/yvonne/sober_experiment.json'
 
// ── Insight sequence ─────────────────────────────────────────────────────────
// "next insight" advances within the sequence.
// Last card → button becomes "explore other topics →" → home.
const SEQUENCES = {
  yvonne: ['illness_arc', 'sober_experiment'],
}
 
// ── Card content ──────────────────────────────────────────────────────────────
// Each card has four distinct layers per the observation/interpretation principle:
//   observation    — what the data literally shows
//   interpretation — what that pattern typically means, held loosely
//   question       — open invitation (null = no verification block)
//   questionType   — 'felt' (single-select) | 'annotation' (multi-select) | null
const CARDS = {
 
 
  illness_arc: {
    headline: 'Elevated wrist temperature and HRV drop, Feb 11–12',
    subtitle: "Fluent can show the change. You know what was going on.",
    observation: "On Feb 11–12, two nights in a row, your wrist temperature ran above baseline: +1.03° and +1.5°. HRV was 11–17 ms lower. Resting heart rate didn't move.",
    observationNote: 'Wrist temperature: how warm your skin runs while you sleep. HRV: how much the timing between heartbeats varies. Lower HRV can be associated with strain, poor sleep, or illness.',
    interpretation: "You did a 60-minute hot class on Feb 10 and ran 9 miles on Feb 11. Across eight other hot-class-and-run occasions, wrist temperature was typically close to baseline (median +0.2°C). This time, it was about +1.5°C above baseline. Your HRV dip also coincided with your first two runs over 8 miles, four days apart. For comparison, you had a fever on Feb 24–25, when HRV averaged about 30 ms below baseline. The Feb 11–12 change was smaller and came almost two weeks earlier. These patterns offer possible context, but don't establish what caused the changes.",
    interpretationNote: 'Baseline = mean of the previous 30 nights, excluding the night scored. Exploratory, one person, data through Oct 2026.',
    dataNote: 'Wrist temp +1.03°C, +1.46°C · HRV −10.5 to −16.8 ms · RHR unchanged · Feb 11–12  |  Fever window: HRV avg −29.7 ms · Feb 24–25',
    question: "Looking back at Feb 11–12, changes like these can occur alongside feeling run down, restless sleep, or feeling unusually warm. How did those days feel?",
    questionType: 'felt',
    chips: [
      "I don't remember",
      'Nothing unusual',
      'Run down',
      'Restless sleep',
      'Warm at night',
      'Body aches',
    ],
    contextQuestion: 'Anything else going on around then? Add context in your own words or pick from the suggestions. Fluent saves it to Moments for future comparisons.',
    contextChips: ['Late night', 'Alcohol', 'Travel', 'Felt off', 'Around sick people', 'Enter something else', 'Skip'],
    acknowledgment: "Saved to Moments. When a similar pattern shows up again, Fluent will show this note beside it, so you can compare.",
    acknowledgmentOverrides: {
      "I don't remember": "That's common; recall fades. Saved to Moments as unrecorded. Next time, Fluent can ask sooner.",
      'Nothing unusual': "Noted. Changes like this can pass without being felt. Saved to Moments.",
      'Run down': "Noted. Saved to Moments, so it can be compared with similar readings later.",
      'Restless sleep': "Noted. Saved to Moments, so it can be compared with similar readings later.",
      'Warm at night': "Noted. Saved to Moments, so it can be compared with similar readings later.",
      'Body aches': "Noted. Saved to Moments, so it can be compared with similar readings later.",
    },
    chart: 'illness_arc',
  },
 
 
  sober_experiment: {
    headline: "Alcohol-free experiment · Jul 6\u201320",
    subtitle: "Here's what your data showed.",
    observation: "In July 2026, you went alcohol-free for fourteen days. Training, sleep schedule, and diet stayed the same. Fluent tracked the period as it unfolded. Your HRV averaged 10.7ms higher than in the 30 nights before the experiment, a 23% increase. Deep sleep added about 9.5 minutes per night on average. Respiratory rate dropped slightly. Your resting heart rate fell about 2 bpm, a much smaller change in proportion (4%). Your nervous system regulation changed significantly. These are different signals, and alcohol appears to affect one more than the other.",
    interpretation: "HRV reflects parasympathetic nervous system regulation — the system's ability to recover and adapt. RHR reflects baseline cardiovascular demand. On the nights after drinking, your HRV was lower while your resting heart rate did not rise. After the experiment ended, the days you didn't drink stayed above the starting level — HRV averaging 51ms, about 6ms above the 30 nights before the experiment. The nights after drinking or smoking averaged 47.5ms over the same weeks, about 4ms lower. A small gap on 7 nights, and I'd treat it as a hint.",
    dataNote: 'HRV +10.7ms (+23%) vs the 30 nights before (Jun 6–Jul 5) · Deep sleep +9.5min · RHR −2.2bpm · Jul 6–20 2026  |  Other nights, Jul 21–Aug 11: HRV 51.3ms (n=15) · Nights after substance use: HRV 47.5ms (n=7)',
    question: 'Did this match what you noticed during that period?',
    questionType: 'felt',
    chips: [
      'Yes — I felt different',
      'I noticed some things',
      'Not really',
      "I wasn't paying attention to it",
      'Skip',
    ],
    contextQuestion: 'What did you notice?',
    contextChips: ['Slept better', 'More energy', 'Felt clearer', 'Less anxious', 'Nothing obvious', 'Something else'],
    acknowledgment: "The body often shifts before the felt experience catches up — or the changes are gradual enough to be invisible day to day. The data can sometimes see what daily life makes hard to notice. Your resting heart rate moved about 2 bpm. Your nervous system regulation moved far more. That distinction is worth knowing.",
    chart: 'sober_experiment',
  },
 
 
 
 
}
 
// ── Chart renderer ─────────────────────────────────────────────────────────────
function Flow2Chart({ type, metric }) {
  if (!type) return null
  if (type === 'illness_arc')      return <IllnessArcChart data={illnessArcData} height={300} />
  if (type === 'sober_experiment') return <SoberExperimentChart data={soberData} height={240} />
  return null
}
 
 
const GRADIENTS = {
  yvonne: 'radial-gradient(ellipse at 70% 30%, rgba(6,129,252,0.15) 0%, rgba(39,196,138,0.08) 40%, transparent 65%)',
}
 
// ── Main component ─────────────────────────────────────────────────────────────
export default function Flow2Screen({ cardId, persona, onBack, onNavigate }) {
  const narrow = useIsNarrow()
  const [step,         setStep]         = useState('chart')
  const [feltAnswer,   setFeltAnswer]   = useState(null)
  const [contextChips, setContextChips] = useState([])
  const [metric,       setMetric]       = useState('RHR')
 
  const content   = CARDS[cardId] || CARDS.illness_arc
  const sequence  = SEQUENCES[persona] || SEQUENCES.yvonne
  const cardIndex = sequence.indexOf(cardId)
  const nextCardId = sequence[cardIndex + 1] ?? null
  const isLast    = nextCardId === null
 
  const displayAcknowledgment =
    content.acknowledgmentOverrides?.[feltAnswer] ??
    (feltAnswer === 'Not really' || feltAnswer === 'It felt different than that'
      ? "Fair enough — the pattern is consistent in your data. That doesn't mean it has to match how you feel. There may be something going on that Fluent can't see from the numbers alone."
      : content.acknowledgment)
 
function handleFelt(chip) {
    setFeltAnswer(chip)
    if (chip === 'Skip' || !content.contextQuestion) {
      setStep('ack')
    } else {
      setStep('context')
    }
  }
 
  function toggleContext(chip) {
    if (chip === 'Skip') { setStep('ack'); return }
    setContextChips(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip])
  }
 
  function handleNext() {
    if (isLast) {
      onNavigate('home')
    } else {
      // Reset interaction state for the new card
      setStep('chart')
      setFeltAnswer(null)
      setContextChips([])
      setMetric('RHR')
      onNavigate('flow2:' + nextCardId)
    }
  }
 
  const showNextButton = step === 'ack' || !content.question
 
  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--color-base)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', flex: 1 }}>
 
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: GRADIENTS[persona] || GRADIENTS.yvonne }} />
 
      {/* Top nav — consistent pill style */}
      <div style={{ position: 'fixed', top: 32, left: 48, right: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>fluent</span>
      </div>
 
      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '96px 48px 120px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
 
          {/* Headline + subtitle */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 'clamp(24px, 3vw, 42px)', fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>
            {content.headline}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ color: 'var(--color-text-secondary)', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
            {content.subtitle}
          </motion.p>
 
          {/* Chart block */}
          {content.chart && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px 20px 12px', marginBottom: 4 }}>
              <Flow2Chart type={content.chart} metric={metric} />
            </motion.div>
          )}
 
          {/* Data note */}
          {content.dataNote && (
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 13, marginBottom: 28, lineHeight: 1.5, paddingLeft: 4 }}>
              {content.dataNote}
            </p>
          )}
 
          {/* Observation + interpretation — same width as chart block */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {content.observation && (
              <div>
                <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
                  {content.observation}
                </p>
                {content.observationNote && (
                  <p style={{ fontSize: 13, lineHeight: 1.5, fontStyle: 'italic', color: 'var(--color-text-tertiary)', margin: '8px 0 0' }}>
                    {content.observationNote}
                  </p>
                )}
              </div>
            )}
            {content.interpretation && (
              <div style={{ paddingLeft: 16, borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-text-secondary)', margin: 0 }}>
                  {content.interpretation}
                </p>
                {content.interpretationNote && (
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--color-text-tertiary)', margin: '8px 0 0' }}>
                    {content.interpretationNote}
                  </p>
                )}
              </div>
            )}
          </motion.div>
 
          {/* Verification block — same width */}
          {content.question && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24 }}>
              <p style={{ fontSize: 15, marginBottom: 16, lineHeight: 1.5 }}>{content.question}</p>
              {content.designNote && (
                <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--color-text-tertiary)', margin: '-8px 0 16px' }}>{content.designNote}</p>
              )}
 
              {/* FELT — single select */}
              {content.questionType === 'felt' && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {content.chips.map(chip => (
                    <motion.span key={chip} whileHover={{ scale: step === 'ack' ? 1 : 1.02 }}
                      onClick={() => { if (step !== 'ack') handleFelt(chip) }}
                      style={{ background: feltAnswer === chip ? 'rgba(6,129,252,0.15)' : 'rgba(255,255,255,0.08)', border: feltAnswer === chip ? '1px solid rgba(6,129,252,0.4)' : '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '8px 16px', fontSize: 14, cursor: step === 'ack' ? 'default' : 'pointer', color: feltAnswer === chip ? '#0681fc' : 'var(--color-text-secondary)', opacity: step === 'ack' && feltAnswer !== chip ? 0.4 : 1, pointerEvents: step === 'ack' ? 'none' : 'auto', transition: 'all 0.15s' }}>
                      {chip}
                    </motion.span>
                  ))}
                </div>
              )}
 
              {/* ANNOTATION — multi-select */}
              {content.questionType === 'annotation' && (
                <>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                    {content.chips.map(chip => (
                      <motion.span key={chip} whileHover={{ scale: 1.02 }}
                        onClick={() => { if (step === 'ack') return; setContextChips(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]); if (step !== 'ack') setStep('context') }}
                        style={{ background: contextChips.includes(chip) ? 'rgba(39,196,138,0.15)' : 'rgba(255,255,255,0.06)', border: contextChips.includes(chip) ? '1px solid rgba(39,196,138,0.4)' : '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '8px 16px', fontSize: 14, cursor: 'pointer', color: contextChips.includes(chip) ? '#27C48A' : 'var(--color-text-secondary)', transition: 'all 0.15s' }}>
                        {chip}
                      </motion.span>
                    ))}
                  </div>
                  {contextChips.length > 0 && step !== 'ack' && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setStep('ack')}
                      style={{ fontSize: 14, color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'block', marginTop: 4, textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>
                      done →
                    </motion.span>
                  )}
                </>
              )}
 
              {/* Context chips — after felt answer */}
              <AnimatePresence>
                {step === 'context' && content.contextQuestion && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: 16 }}>
                    <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 12 }}>{content.contextQuestion}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                      {content.contextChips.map(chip => (
                        <motion.span key={chip} whileHover={{ scale: 1.02 }} onClick={() => toggleContext(chip)}
                          style={{ background: contextChips.includes(chip) ? 'rgba(39,196,138,0.15)' : 'rgba(255,255,255,0.06)', border: contextChips.includes(chip) ? '1px solid rgba(39,196,138,0.4)' : '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '6px 14px', fontSize: 13, cursor: 'pointer', color: contextChips.includes(chip) ? '#27C48A' : 'var(--color-text-tertiary)', transition: 'all 0.15s' }}>
                          {chip}
                        </motion.span>
                      ))}
                    </div>
                    {contextChips.length > 0 && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setStep('ack')}
                        style={{ fontSize: 14, color: 'var(--color-text-secondary)', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>
                        done →
                      </motion.span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
 
              {/* Acknowledgment */}
              <AnimatePresence>
                {step === 'ack' && displayAcknowledgment && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginTop: 8 }}>
                      {displayAcknowledgment}
                    </p>
                    {cardId === 'rhr_shift' && contextChips.length > 0 && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                        onClick={() => onNavigate('moments')}
                        style={{ fontSize: 14, color: 'var(--color-accent)', marginTop: 8, cursor: 'pointer' }}>
                        See it in your timeline →
                      </motion.p>
                    )}
                    {(contextChips.length > 0 || feltAnswer) && (
                      <p style={{ fontSize: 13, color: 'var(--color-recovery)', marginTop: 8 }}>✓ saved</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
 
      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: narrow ? 88 : 32, left: 48, right: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
        <motion.span whileHover={{ opacity: 0.7 }} onClick={onBack}
          style={{ color: 'var(--color-text-tertiary)', fontSize: 14, cursor: 'pointer' }}>
          ←
        </motion.span>
 
        {showNextButton && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleNext}
            style={{ color: 'var(--color-text-primary)', fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>
            {isLast ? 'explore other topics →' : 'next insight →'}
          </motion.span>
        )}
      </div>
      <FloatingNav active="noticed" onNavigate={onNavigate} />
    </div>
  )
}
 