import { useState } from 'react'
import FloatingNav from '../components/nav/FloatingNav'
import { useIsNarrow } from '../components/scrolly/useIsNarrow'
import { motion, AnimatePresence } from 'framer-motion'
import WeeklyRhythmFullChart from '../components/charts/WeeklyRhythmFullChart'
import SleepHRVChart         from '../components/charts/SleepHRVChart'
import RetirementArcChart    from '../components/charts/RetirementArcChart'
import SeasonalStepsChart    from '../components/charts/SeasonalStepsChart'
import IllnessArcChart      from '../components/charts/IllnessArcChart'
import SoberExperimentChart from '../components/charts/SoberExperimentChart'
import illnessArcData        from '../data/yvonne/illness_arc.json'
import soberData              from '../data/yvonne/sober_experiment.json'
 
// ── Insight sequence per persona ─────────────────────────────────────────────
// "next insight" advances within the persona's sequence.
// Last card → button becomes "explore other topics →" → home.
const SEQUENCES = {
  jamie:  ['monday',     'sleep_hrv'],
  yvonne: ['illness_arc', 'sober_experiment'],
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
    headline: 'Your resting heart rate is lowest on Mondays',
    subtitle: 'About 68 bpm on Mondays, the lowest day of the week, and about 75 bpm on Saturdays, the highest.',
    observation: 'Over the last 8 weeks, Monday had your lowest resting heart rate in every week, averaging 68 bpm. Saturday was highest at about 75 bpm, based on the 5 weeks with a Saturday reading.',
    interpretation: "One reading: whatever raises your heart rate over the weekend has settled by Monday morning. Resting heart rate also moves with sleep, alcohol, stress and illness, so this shows when it runs high or low, not why.",
    dataNote: "8 weeks, 46 of 56 days with a reading. Weekends have the most gaps, where your tracker wasn't worn. Exploratory: one person.",
    question: 'Does this match how your Mondays typically feel?',
    questionType: 'felt',
    chips: ['Yes', 'Not really', "I don't remember"],
    contextQuestion: 'Anything come to mind about your weekends?',
    contextChips: ['Late night', 'Social', 'Alcohol', 'Travel', 'Stress', 'Busy weekend', 'Other', 'Skip'],
    acknowledgment: 'Thanks. If you add what happened on a few weekends, Fluent can check over time whether they shape your Mondays.',
    chart: 'weekly_rhythm',
  },
 
  sleep_hrv: {
    persona: 'jamie',
    headline: 'Sleep looked normal, but HRV was low the next morning',
    subtitle: 'On 4 nights, sleep efficiency was typical and the next morning\'s HRV was about 7 ms below your usual.',
    observation: "On 4 nights (Nov 8, Dec 2, Feb 13 and Feb 14), sleep efficiency was 87–91%, close to your usual 87%. The next morning's HRV was 29–31 ms, about 7 ms below your usual 37 ms.",
    interpretation: "One reading: sleep efficiency measures how much of the night you spent asleep, not how well your body recovered, so the two can disagree. HRV can also run lower after alcohol, illness or a late meal. Fluent can't tell which applied on these nights.",
    dataNote: '4 mismatch nights out of 16 nights with both sleep and HRV tracked. Exploratory: one person.',
    question: 'Do you remember how those mornings felt?',
    questionType: 'felt',
    chips: ["I don't remember", 'Nothing unusual', 'Tired', 'Restless', 'Felt fine'],
    contextQuestion: 'Anything that might explain those nights?',
    contextChips: ['Late night', 'Alcohol', 'Stress', 'Illness', 'Travel', 'Other', 'Skip'],
    acknowledgment: 'Thanks. Adding what was going on lets Fluent compare these nights with future ones.',
    chart: 'sleep_hrv_quadrant',
  },
 
  illness_arc: {
    persona: 'yvonne',
    headline: 'Elevated wrist temperature and HRV drop, Feb 11–12',
    subtitle: "Fluent can show the change. You know what was going on.",
    observation: "On Feb 11–12, two nights in a row, your wrist temperature ran above baseline: +1.0° and +1.5°. HRV was 11–17 ms lower. Resting heart rate didn't move.",
    observationNote: 'Wrist temperature: how warm your skin runs while you sleep. HRV: how much the timing between heartbeats varies. Lower HRV can be associated with strain, poor sleep, or illness.',
    interpretation: "You did a 60-minute hot class on Feb 10 and ran 9 miles on Feb 11. After a hot class and a run the next day, your wrist temperature was usually near baseline (median about +0.2°, 8 other occasions). The night after your Feb 11 run it was about +1.5° above. The HRV dip fits your first two runs over 8 miles, four days apart. For comparison, you had a fever on Feb 24–25, when HRV averaged about 30 ms below baseline. The Feb 11–12 change was smaller and came almost two weeks earlier. Whether it meant anything is untested.",
    interpretationNote: 'Baseline = mean of the previous 30 nights, excluding the night scored. Exploratory, one person, data through Oct 2026.',
    dataNote: 'Wrist temp +1.0°C, +1.5°C · HRV −10 to −17 ms · RHR unchanged · Feb 11–12  |  Fever window: HRV avg −29.7 ms · Feb 24–25',
    question: "Looking back at Feb 11–12, changes like these can occur alongside feeling run down, restless sleep, or feeling unusually warm. You may not have noticed anything. How did those days feel?",
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
    persona: 'yvonne',
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
  if (type === 'illness_arc')      return <IllnessArcChart data={illnessArcData} height={300} />
  if (type === 'sober_experiment') return <SoberExperimentChart data={soberData} height={240} />
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
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{layer.label}</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.52)' }}>{layer.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
  return null
}
 
const PERSONA_LABELS = { jamie: 'Jamie', yvonne: 'Yvonne', robert: 'Robert', alex: 'Alex' }
 
const GRADIENTS = {
  jamie:  'radial-gradient(ellipse at 20% 80%, rgba(196,80,232,0.2) 0%, transparent 60%)',
  yvonne: 'radial-gradient(ellipse at 70% 30%, rgba(6,129,252,0.15) 0%, rgba(39,196,138,0.08) 40%, transparent 65%)',
  robert: 'radial-gradient(ellipse at 20% 60%, rgba(39,196,138,0.15) 0%, transparent 55%)',
  alex:   'radial-gradient(ellipse at 60% 40%, rgba(39,196,138,0.1) 0%, transparent 55%)',
}
 
// ── Main component ─────────────────────────────────────────────────────────────
export default function Flow2Screen({ cardId, persona, onBack, onNavigate }) {
  const narrow = useIsNarrow()
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
                    <span key={m} onClick={() => setMetric(m)} style={{ background: metric === m ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: metric === m ? '#fff' : 'var(--color-text-secondary)', transition: 'all 0.2s' }}>{m}</span>
                  ))}
                </div>
              )}
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
 