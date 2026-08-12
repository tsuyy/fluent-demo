import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WeeklyRhythmFullChart from '../components/charts/WeeklyRhythmFullChart'
import SleepHRVChart         from '../components/charts/SleepHRVChart'
import RHRTrendChart         from '../components/charts/RHRTrendChart'
import SportHRVChart         from '../components/charts/SportHRVChart'
import RetirementArcChart    from '../components/charts/RetirementArcChart'
import SeasonalStepsChart    from '../components/charts/SeasonalStepsChart'
 
// ── Insight sequence per persona ─────────────────────────────────────────────
// "next insight" advances within the persona's sequence.
// Last card → button becomes "explore other topics →" → home.
const SEQUENCES = {
  jamie:  ['monday',     'sleep_hrv'],
  yvonne: ['rhr_shift',  'tennis'],
  robert: ['retirement', 'silence'],
  alex:   ['seasonal',   'capability'],
}
 
// ── Card content ──────────────────────────────────────────────────────────────
// Each card has four distinct layers per the observation/interpretation principle:
//   observation    — what the data literally shows
//   interpretation — what that pattern typically means, held loosely
//   question       — open invitation (null = no verification block)
//   questionType   — 'felt' (single-select) | 'annotation' (multi-select) | null
const CARDS = {
  monday: {
    persona: 'jamie',
    headline: 'Your Mondays are actually your best days',
    subtitle: 'Your weekends seem to be costing you more than your work week does — the opposite of what you might expect.',
    observation: 'Your resting heart rate is consistently lower on Mondays than any other day — lower than Friday, lower than Saturday and Sunday. This pattern has shown up in 7 of the last 8 weeks.',
    interpretation: 'A lower resting heart rate on Monday typically means your body recovered well by the end of the weekend — but it can also mean your weekend stress or disrupted sleep resolved by Sunday night rather than accumulating into Monday.',
    dataNote: "Based on 8 weeks of available data. Some weekend readings are missing where her tracker wasn't worn.",
    question: 'Does this match how your Mondays typically feel?',
    questionType: 'felt',
    chips: ['Yes', 'Not really', 'Skip'],
    contextQuestion: 'Anything come to mind about your weekends?',
    contextChips: ['Late night', 'Social', 'Alcohol', 'Travel', 'Stress', 'Busy weekend', 'Other', 'Skip'],
    acknowledgment: 'Worth knowing either way — your weekends are likely setting your Mondays, not the other way around.',
    chart: 'weekly_rhythm',
  },
 
  sleep_hrv: {
    persona: 'jamie',
    headline: 'Your sleep looked fine — your HRV says otherwise',
    subtitle: 'Some weeks your sleep tracked normally, but your HRV tells a different story.',
    observation: "Last week your sleep tracked normally — around 7 hours, reasonable deep and REM stages recorded. But your HRV the following mornings was below your baseline.",
    interpretation: "These two signals don't always agree. When they don't, the mismatch often explains weeks that feel harder than they should — your nervous system may not have recovered even when your sleep duration looked fine.",
    dataNote: 'Based on weeks where both sleep and HRV were tracked overnight.',
    question: null,
    questionType: null,
    chips: [],
    contextQuestion: null,
    contextChips: [],
    acknowledgment: null,
    chart: 'sleep_hrv_quadrant',
  },
 
  rhr_shift: {
    persona: 'yvonne',
    headline: 'Your RHR has quietly shifted',
    subtitle: "Your resting heart rate has been lower than usual for the past two weeks. Fluent noticed — but doesn't know why yet.",
    observation: "Your resting heart rate has been below your personal baseline for the past two weeks — consistently, not just a one-day fluctuation.",
    interpretation: "A sustained shift like this is often associated with a change in routine, training load, or recovery quality — but it can also reflect cooler temperatures, less life stress, or something else entirely. Fluent can't say which from the data alone.",
    dataNote: 'Compared against your personal baseline — not a population average.',
    question: 'Does anything come to mind about the past two weeks?',
    questionType: 'annotation',
    chips: ['Travel', 'Cooler weather', 'Less training', 'More rest', 'Life change', 'Something else'],
    contextQuestion: null,
    contextChips: [],
    acknowledgment: "That makes sense. Fluent saved this to your timeline — you can see what it looks like in Moments that shaped my health.",
    chart: 'rhr_trend',
  },
 
  tennis: {
    persona: 'yvonne',
    headline: 'Tennis might be your best recovery tool',
    subtitle: 'Out of everything you do, tennis produces the strongest recovery response — more than any other activity in your data.',
    observation: "Out of everything in your data, tennis produces the strongest recovery response — your HRV is consistently higher in the day or two after a session than after any other activity. Cycling and running show modest positive effects. Skiing costs recovery for several days.",
    interpretation: "Tennis may be doing something different for your nervous system — leaving it more regulated rather than more depleted. Fluent can't say exactly why from the data alone, but the pattern is consistent across 22 sessions.",
    dataNote: 'Based on 22 tennis sessions tracked since 2025.',
    question: null,
    questionType: null,
    chips: [],
    contextQuestion: null,
    contextChips: [],
    acknowledgment: null,
    chart: 'sport_hrv',
  },
 
  retirement: {
    persona: 'robert',
    headline: 'Retirement left a mark on your heart rate',
    subtitle: 'Your resting heart rate settled into a new, healthier pattern after you retired.',
    observation: "Your resting heart rate settled into a new, lower range in the months after you retired — and has stayed there.",
    interpretation: "This kind of sustained shift over several months is typically associated with a change in baseline daily rhythm rather than a single event. A lower resting heart rate generally reflects less baseline demand on your cardiovascular system.",
    dataNote: 'Compared against your pre-retirement baseline of 63 bpm.',
    question: 'Does this match how that transition felt for you?',
    questionType: 'felt',
    chips: ["Yes, that's exactly how it felt", 'It felt different than that', 'Skip'],
    contextQuestion: 'Anything come to mind about that period?',
    contextChips: ['Took time to adjust', 'Felt immediate', 'Still adjusting', 'Something else', 'Skip'],
    acknowledgment: 'Your body registered this transition in ways you may never have consciously noticed — even when the experience itself felt like straightforward relief.',
    chart: 'retirement_arc',
  },
 
  silence: {
    persona: 'robert',
    headline: "Nothing stood out this quarter — and that's worth knowing",
    subtitle: "Your key patterns are all consistent with how you've been trending. No news is the finding here.",
    observation: "Your key patterns this quarter — resting heart rate, activity, sleep — are all consistent with how you've been trending. Nothing exceeded the threshold that would normally prompt a closer look.",
    interpretation: "Sometimes the most useful thing to know is that nothing unusual is happening. Stability in these signals, sustained over a quarter, is itself meaningful.",
    dataNote: null,
    question: null,
    questionType: null,
    chips: [],
    contextQuestion: null,
    contextChips: [],
    acknowledgment: null,
    chart: null,
  },
 
  seasonal: {
    persona: 'alex',
    headline: 'October was your most active month — February your quietest',
    subtitle: "Your steps follow a seasonal rhythm you've probably felt but never seen confirmed.",
    observation: "Your step count follows a seasonal rhythm — higher in autumn, lower in mid-winter. October consistently shows your most active days. February consistently shows your quietest. This pattern has held across the years in your data.",
    interpretation: "Seasonal variation in activity is common and often invisible until you see it across multiple years. Yours is consistent enough to be a real pattern, not noise.",
    dataNote: 'Based on 5 years of iPhone step data.',
    question: 'Does October feel like your most active time of year?',
    questionType: 'felt',
    chips: ['Yes, that tracks', 'Not really', 'Skip'],
    contextQuestion: 'What drives that pattern for you?',
    contextChips: ['Weather / season', 'Work schedule', 'Social life', 'Daylight hours', 'Just how it is', 'Something else', 'Skip'],
    acknowledgment: 'Seasonal rhythms in activity are common and often invisible until you see them across multiple years. Yours is consistent enough to be a real pattern, not just noise.',
    chart: 'seasonal_steps',
  },
 
  capability: {
    persona: 'alex',
    headline: "Here's what steps can't tell you",
    subtitle: "Your activity patterns are clear, but Fluent can't see whether those active days left you energized or depleted.",
    observation: "Your activity patterns are clear — Fluent can see when you move more and when you move less, across weeks, months, and seasons.",
    interpretation: "But steps alone can't tell us whether those active days left you energized or depleted, how your body recovered overnight, or whether your sleep was restoring or just passing time. That's what a wearable would add.",
    dataNote: null,
    question: null,
    questionType: null,
    chips: [],
    contextQuestion: null,
    contextChips: [],
    acknowledgment: null,
    chart: 'capability_gap',
  },
}
 
// ── Chart renderer ─────────────────────────────────────────────────────────────
function Flow2Chart({ type, metric }) {
  if (!type) return null
  if (type === 'weekly_rhythm')     return <WeeklyRhythmFullChart height={200} metric={metric} />
  if (type === 'sleep_hrv_quadrant') return <SleepHRVChart height={200} />
  if (type === 'rhr_trend')          return <RHRTrendChart height={180} />
  if (type === 'sport_hrv')          return <SportHRVChart height={200} />
  if (type === 'retirement_arc')     return <RetirementArcChart height={180} />
  if (type === 'seasonal_steps')     return <SeasonalStepsChart height={180} />
  if (type === 'capability_gap') return (
    <div style={{ padding: '16px 0' }}>
      {[
        { label: 'Recovery signals',  desc: 'How your body responded',    color: '#27C48A' },
        { label: 'Sleep quality',     desc: 'How you recovered overnight', color: '#0681fc' },
        { label: 'Cardiovascular',    desc: 'How your heart is adapting',  color: '#E8504A' },
      ].map((layer, i) => (
        <motion.div key={layer.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 0.5, x: 0 }} transition={{ delay: i * 0.1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px dashed rgba(255,255,255,0.08)', marginBottom: 10 }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: layer.color, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{layer.label}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{layer.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
  return null
}
 
const PERSONA_LABELS = { jamie: 'Jamie', yvonne: 'Yvonne', robert: 'Robert', alex: 'Alex' }
 
const GRADIENTS = {
  jamie:  'radial-gradient(ellipse at 20% 80%, rgba(180,60,60,0.2) 0%, transparent 60%)',
  yvonne: 'radial-gradient(ellipse at 70% 30%, rgba(6,129,252,0.15) 0%, rgba(39,196,138,0.08) 40%, transparent 65%)',
  robert: 'radial-gradient(ellipse at 20% 60%, rgba(39,196,138,0.15) 0%, transparent 55%)',
  alex:   'radial-gradient(ellipse at 60% 40%, rgba(39,196,138,0.1) 0%, transparent 55%)',
}
 
// ── Main component ─────────────────────────────────────────────────────────────
export default function Flow2Screen({ cardId, persona, onBack, onNavigate }) {
  const [step,         setStep]         = useState('chart')
  const [feltAnswer,   setFeltAnswer]   = useState(null)
  const [contextChips, setContextChips] = useState([])
  const [metric,       setMetric]       = useState('RHR')
 
  const content   = CARDS[cardId] || CARDS.monday
  const sequence  = SEQUENCES[persona] || SEQUENCES.yvonne
  const cardIndex = sequence.indexOf(cardId)
  const nextCardId = sequence[cardIndex + 1] ?? null
  const isLast    = nextCardId === null
 
  const displayAcknowledgment =
    feltAnswer === 'Not really' || feltAnswer === 'It felt different than that'
      ? "Fair enough — the pattern is consistent in your data. That doesn't mean it has to match how you feel. There may be something going on that Fluent can't see from the numbers alone."
      : content.acknowledgment
 
  function handleFelt(chip) {
    setFeltAnswer(chip)
    if (chip === 'Skip') setStep('ack')
    else setStep('context')
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
  const label = PERSONA_LABELS[persona] || persona
 
  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--color-base)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', flex: 1 }}>
 
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: GRADIENTS[persona] || GRADIENTS.yvonne }} />
 
      {/* Top nav — consistent pill style */}
      <div style={{ position: 'fixed', top: 32, left: 48, right: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>fluent</span>
        <motion.span
          whileHover={{ opacity: 0.7 }}
          onClick={() => onNavigate('picker')}
          style={{ fontSize: 14, color: 'var(--color-text-secondary)', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 12px' }}
        >
          {label}
        </motion.span>
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
              {content.chart === 'weekly_rhythm' && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  {['RHR', 'HRV'].map(m => (
                    <span key={m} onClick={() => setMetric(m)} style={{ background: metric === m ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: metric === m ? '#fff' : 'var(--color-text-secondary)', transition: 'all 0.2s' }}>{m}</span>
                  ))}
                </div>
              )}
              <Flow2Chart type={content.chart} metric={metric} />
            </motion.div>
          )}
 
          {/* Data note */}
          {content.dataNote && (
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 12, marginBottom: 28, lineHeight: 1.5, paddingLeft: 4 }}>
              {content.dataNote}
            </p>
          )}
 
          {/* Observation + interpretation — same width as chart block */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {content.observation && (
              <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
                {content.observation}
              </p>
            )}
            {content.interpretation && (
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-text-secondary)', margin: 0, paddingLeft: 16, borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                {content.interpretation}
              </p>
            )}
          </motion.div>
 
          {/* Verification block — same width */}
          {content.question && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24 }}>
              <p style={{ fontSize: 15, marginBottom: 16, lineHeight: 1.5 }}>{content.question}</p>
 
              {/* FELT — single select */}
              {content.questionType === 'felt' && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {content.chips.map(chip => (
                    <motion.span key={chip} whileHover={{ scale: step === 'ack' ? 1 : 1.02 }}
                      onClick={() => { if (step !== 'ack') handleFelt(chip) }}
                      style={{ background: feltAnswer === chip ? 'rgba(6,129,252,0.15)' : 'rgba(255,255,255,0.08)', border: feltAnswer === chip ? '1px solid rgba(6,129,252,0.4)' : '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '8px 16px', fontSize: 13, cursor: step === 'ack' ? 'default' : 'pointer', color: feltAnswer === chip ? '#0681fc' : 'var(--color-text-secondary)', opacity: step === 'ack' && feltAnswer !== chip ? 0.4 : 1, pointerEvents: step === 'ack' ? 'none' : 'auto', transition: 'all 0.15s' }}>
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
                        style={{ background: contextChips.includes(chip) ? 'rgba(39,196,138,0.15)' : 'rgba(255,255,255,0.06)', border: contextChips.includes(chip) ? '1px solid rgba(39,196,138,0.4)' : '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '8px 16px', fontSize: 13, cursor: 'pointer', color: contextChips.includes(chip) ? '#27C48A' : 'var(--color-text-secondary)', transition: 'all 0.15s' }}>
                        {chip}
                      </motion.span>
                    ))}
                  </div>
                  {contextChips.length > 0 && step !== 'ack' && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setStep('ack')}
                      style={{ fontSize: 13, color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'block', marginTop: 4, textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>
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
                          style={{ background: contextChips.includes(chip) ? 'rgba(39,196,138,0.15)' : 'rgba(255,255,255,0.06)', border: contextChips.includes(chip) ? '1px solid rgba(39,196,138,0.4)' : '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '6px 14px', fontSize: 12, cursor: 'pointer', color: contextChips.includes(chip) ? '#27C48A' : 'var(--color-text-tertiary)', transition: 'all 0.15s' }}>
                          {chip}
                        </motion.span>
                      ))}
                    </div>
                    {contextChips.length > 0 && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setStep('ack')}
                        style={{ fontSize: 13, color: 'var(--color-text-secondary)', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>
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
                        style={{ fontSize: 13, color: 'var(--color-accent)', marginTop: 8, cursor: 'pointer' }}>
                        See it in your timeline →
                      </motion.p>
                    )}
                    {(contextChips.length > 0 || feltAnswer) && (
                      <p style={{ fontSize: 12, color: 'var(--color-recovery)', marginTop: 8 }}>✓ saved</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
 
      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 32, left: 48, right: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
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
    </div>
  )
}
 