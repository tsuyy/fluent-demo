import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingNav from '../components/nav/FloatingNav'
import PageContainer from '../components/layout/PageContainer'
import IllnessArcChart      from '../components/charts/IllnessArcChart'
import SoberExperimentChart from '../components/charts/SoberExperimentChart'
import SportRecoveryBars      from '../components/charts/SportRecoveryBars'
import RHRTrendChart         from '../components/charts/RHRTrendChart'
import illnessArcData        from '../data/yvonne/illness_arc.json'
import soberData              from '../data/yvonne/sober_experiment.json'
import RetirementArcChart from '../components/charts/RetirementArcChart'
import SeasonalStepsChart from '../components/charts/SeasonalStepsChart'

// ── Moment data ────────────────────────────────────────────────────────────
// Ordered most recent → oldest (reverse chronological)
// User scrolls down to go further into the past

const MOMENTS = {
  yvonne: [
    {
      id: 'sober_experiment',
      date: 'Jul 6–20 2026',
      label: 'Alcohol-free experiment',
      type: 'pattern',
      color: '#27C48A',
      chart: 'sober_experiment',
      observation: 'Fourteen days alcohol-free. Training, sleep, and diet unchanged. HRV rose 10.7ms, a 23% increase on the 30 nights before. Deep sleep added about 9.5 minutes per night. Resting heart rate fell about 2 bpm.',
      insight: "The experiment ended. The signal didn't.",
      dataNote: 'HRV +10.7ms vs Jun 6–Jul 5 · Deep sleep +9.5min · RHR −2.2bpm · Jul 6–20',
      annotation: null,
      forwardLink: { label: 'See the full comparison →', screen: 'cardio', scrollTo: 'sober-experiment' },
    },
    {
      id: 'race',
      date: 'Jun 2026',
      label: 'Half marathon',
      type: 'milestone',
      color: '#27C48A',
      chart: 'rhr_trend',
      observation: 'HRV peaked the night before and rebounded within 5 days — faster than any previous hard effort.',
      insight: 'Years of training showed up on one morning.',
      dataNote: 'HRV 83ms night before · Full recovery day +5',
      annotation: null,
      forwardLink: { label: 'See your cardiovascular arc →', screen: 'cardio' },
    },
     {
      id: 'illness_arc',
      date: 'Feb 2026',
      label: 'Elevated wrist temperature and HRV drop',
      type: 'insight',
      color: '#c450e8',
      chart: 'illness_arc',
      observation: 'Feb 11\u201312: wrist temperature ran +1.0\u00b0 and +1.5\u00b0 above baseline and HRV was 10\u201317 ms lower. A hot class and a long run came just before. Illness is neither confirmed nor ruled out.',
      insight: "A pattern isn't an explanation.",
      dataNote: 'Wrist temp +1.0\u00b0C, +1.5\u00b0C \u00b7 HRV \u221210 to \u221217 ms \u00b7 Feb 11\u201312',
      annotation: null,
      forwardLink: { label: 'See the full data →', cardId: 'illness_arc' },
    },
    {
      id: 'tennis_era',
      date: 'Sep 2025',
      label: 'Tennis era begins',
      type: 'pattern',
      color: '#27C48A',
      chart: 'sport_hrv',
      observation: 'After back-to-back tennis on September 6–7, your HRV on Sep 8 was 79.5 ms, about 37 ms above your previous 30 nights. That is the highest tennis response on record. Only Oct 17, 2026 has come close, at +33 ms two days after.',
      insight: 'The data can see ease. It can\'t see why.',
      dataNote: 'HRV 79.5 ms on Sep 8 2025, +37 ms vs prior 30 nights · single night · Oct 17 2026: +33 ms',
      annotation: 'A life change coincided with discovering tennis.',
      forwardLink: { label: 'See sport HRV analysis →', screen: 'activity' },
    },
    {
      id: 'base_building',
      date: 'Aug–Sep 2023',
      label: 'Getting worse before getting better',
      type: 'pattern',
      color: '#0681fc',
      chart: 'rhr_trend',
      observation: 'HRV was consistently suppressed for weeks. Active calories were running 50% above your baseline. At the time it looked like accumulated fatigue.',
      insight: 'The data looked like a warning. Looking back, it was the work.',
      dataNote: 'HRV −5 to −9ms sustained · Active cal +50% · Aug–Sep 2023',
      annotation: null,
      forwardLink: null,
    },
  ],

  robert: [
    {
      id: 'structure',
      date: 'Mar 2025',
      label: 'Structure as a health variable',
      type: 'pattern',
      color: '#0681fc',
      chart: 'retirement_arc',
      observation: 'Weeks with consistent plans — golf, social commitments, scheduled activity — show measurably different recovery signals than weeks without structure.',
      insight: 'Structure isn\'t just a preference. For your body, it\'s a recovery tool.',
      dataNote: 'Structured: HRV 33ms, RHR 57.9 · Unstructured: HRV 26.6, RHR 62.0',
      annotation: null,
      forwardLink: null,
    },
    {
      id: 'portugal',
      date: 'May 2024',
      label: 'Portugal trip',
      type: 'travel',
      color: '#888780',
      chart: null,
      observation: 'Brief disruption in routine. HRV dipped during travel, recovered within 4 days of returning home.',
      insight: 'Your baseline held.',
      dataNote: 'HRV dip · Recovery day +4',
      annotation: null,
      forwardLink: null,
    },
    {
      id: 'golf_routine',
      date: 'Jan 2024',
      label: 'Golf routine established',
      type: 'pattern',
      color: '#0681fc',
      chart: null,
      observation: 'Once a consistent golf schedule began, the structure dependency pattern became visible in the data.',
      insight: 'Routine created regularity. Regularity showed up in your recovery.',
      dataNote: 'Structured weeks: HRV consistently higher',
      annotation: null,
      forwardLink: null,
    },
    {
      id: 'retirement',
      date: 'Aug 2023',
      label: 'Retirement',
      type: 'milestone',
      color: '#27C48A',
      chart: 'retirement_arc',
      observation: 'Your resting heart rate rose briefly then settled into a new, lower baseline over 5 months. Your body registered the transition before you finished processing it.',
      insight: 'The body adapts on its own timeline.',
      dataNote: 'RHR +2.2 bpm first month → −5.8 bpm new baseline',
      annotation: null,
      forwardLink: { label: 'See your cardiovascular arc →', screen: 'cardio' },
    },
  ],

  jamie: [
    {
      id: 'hikes',
      date: 'Jan 2025',
      label: 'Weekend hikes begin',
      type: 'pattern',
      color: '#27C48A',
      chart: null,
      observation: 'A consistent weekend hiking pattern emerged. Monday recovery readings improved in weeks that followed.',
      insight: 'Movement you enjoy shows up differently than movement you track.',
      dataNote: 'Monday RHR improved on hike weeks',
      annotation: null,
      forwardLink: null,
    },
    {
      id: 'project',
      date: 'Nov 2024',
      label: 'Heavy project period',
      type: 'insight',
      color: '#E8504A',
      chart: null,
      observation: 'Your tracking gaps cluster around your busiest periods. The absence is itself information — your watch wasn\'t charged when things got hard.',
      insight: 'The data can see the shape of your calendar.',
      dataNote: 'Tracking coverage dropped to 52% · Nov 2024',
      annotation: null,
      forwardLink: null,
    },
    {
      id: 'start',
      date: 'Aug 2024',
      label: 'Started tracking',
      type: 'milestone',
      color: '#0681fc',
      chart: null,
      observation: 'The first consistent data. Some gaps from the start — but the patterns began to emerge within the first month.',
      insight: 'The longer you track, the more meaningful it becomes.',
      dataNote: '8 months · 73% coverage',
      annotation: null,
      forwardLink: null,
    },
  ],

  alex: [
    {
      id: 'pattern',
      date: '2021–2025',
      label: '5 years of movement',
      type: 'insight',
      color: '#0681fc',
      chart: 'seasonal_steps',
      observation: 'October peaks and February troughs — every single year without exception. A rhythm you\'ve been living without seeing.',
      insight: 'Patterns become visible when you look at enough time.',
      dataNote: 'Oct avg: 10,200 steps · Feb avg: 5,680 steps',
      annotation: null,
      forwardLink: null,
    },
  ],
}

// ── Topics ─────────────────────────────────────────────────────────────────
// A topic is the Moment's tag and sets its color bar. People can add their own.
const BASE_TOPICS = {
  pattern:   '#27C48A',
  insight:   '#c450e8',
  milestone: '#0681fc',
  travel:    '#888780',
}
const EXTRA_COLORS = ['#E8A94A', '#E8504A', '#9B8AFF', '#2EC4C4', '#E86FB0']

// ── Fluent's readings ─────────────────────────────────────────────────────
// Interpretation is Fluent's: a tentative reading of the observation, written
// to leave room for other explanations. The person checks it against how it felt.
const INTERPRETATIONS = {
  sober_experiment: 'One reading: alcohol was holding your HRV and deep sleep down, and taking it out let both rise. Heat, travel or a lighter July could do the same, so this is a hypothesis, not a result.',
  race:             'One reading: years of training let your body recover faster from a hard effort. A good taper, sleep or weather the week before could also explain it.',
  illness_arc:      'One reading: your body was reacting to a hard day or the start of something. The data cannot tell those apart, and it cannot say which one it was.',
  tennis_era:       'One reading: your HRV rebounds more after tennis than after any other sport you do (+4.2 ms two days after, on average). Something else that changed that month could be part of why.',
  base_building:    'One reading: weeks of heavy load held HRV down, which is how hard training often looks. Illness or poor sleep would look the same on the watch.',
  structure:        'One reading: weeks with plans give your body a steadier rhythm, and recovery follows. It may also be that you feel better in the weeks you plan more.',
  portugal:         'One reading: travel disrupted your routine, and your usual range came back once the routine did. Time zones and heat can move these numbers too.',
  golf_routine:     'One reading: a regular schedule made your recovery more regular. Other changes that winter could be part of it.',
  retirement:       'One reading: your body adjusted to a new daily rhythm before you did. Changes in activity, sleep or the watch itself could add to it.',
  hikes:            'One reading: weekend hikes helped your Monday recovery. A few weeks of data is not enough to separate this from other habits.',
  project:          'One reading: gaps in your data line up with your busiest weeks. It may say more about when you wear the watch than about your body.',
  start:            'One reading: your first month of data is mostly about learning your own normal, not about change. Gaps early on make it harder to see.',
  pattern:          'One reading: your activity follows the seasons, high in the fall and low in winter. Weather and daylight are the obvious suspects, and the data does not separate them.',
}

// Verification: the person checks Fluent's reading against how it felt. Every Moment
// offers "I don't remember" and "Nothing unusual", plus answers that fit its own context
// (the illness and sober answers are the ones used in Flow 2). Multi-select, except that
// "I don't remember" and "Nothing unusual" stand alone. No model is running: replies are fixed
// and only say what Fluent would do with the answer.
const IDR = "I don't remember"
const NONE = 'Nothing unusual'
const VERIFY = {
  sober_experiment: {
    question: 'Did this match what you noticed during that period?',
    answers: ['Yes — I felt different', 'I noticed some things', 'Not really', "I wasn't paying attention to it"],
    context: ['Slept better', 'More energy', 'Felt clearer', 'Less anxious', 'Hot weather', 'Travel', 'Nothing obvious'],
    positive: ['Yes — I felt different'], negative: ['Not really'],
  },
  race: {
    question: 'How did that week feel?',
    answers: ['Felt strong', 'Recovered quickly', 'Sore for days', 'Felt flat'],
    context: ['Taper week', 'Slept well', 'Race nerves', 'Good weather', 'Travel', 'Stress'],
    positive: ['Felt strong', 'Recovered quickly'], negative: ['Sore for days', 'Felt flat'],
  },
  illness_arc: {
    question: 'Looking back at Feb 11–12, how did those days feel?',
    answers: ['Run down', 'Restless sleep', 'Warm at night', 'Body aches'],
    context: ['Late night', 'Alcohol', 'Travel', 'Felt off', 'Around sick people', 'Hard workout'],
    positive: [], negative: [],
  },
  tennis_era: {
    question: 'Did tennis feel easier on your body?',
    answers: ['Felt easier', 'More energy', 'Slept better', 'Less sore'],
    context: ['Social', 'Life change', 'Less stress', 'Outdoors', 'Playing more'],
    positive: ['Felt easier', 'More energy', 'Slept better', 'Less sore'], negative: [],
  },
  base_building: {
    question: 'How did those weeks feel?',
    answers: ['Tired', 'Heavy legs', 'Restless sleep', 'Felt fine'],
    context: ['Training block', 'Work stress', 'Heat', 'Poor sleep', 'Travel', 'Illness'],
    positive: [], negative: [],
  },
  structure: {
    question: 'Do the weeks with plans feel different?',
    answers: ['Felt steadier', 'More energy', 'Slept better', 'Restless on open days'],
    context: ['Golf', 'Social plans', 'Appointments', 'Open days', 'Weather'],
    positive: ['Felt steadier', 'More energy', 'Slept better'], negative: [],
  },
  portugal: {
    question: 'How did the trip feel in your body?',
    answers: ['Jet lag', 'Tired', 'Slept badly', 'Felt great'],
    context: ['Time zones', 'Heat', 'Walking a lot', 'Late meals', 'Wine'],
    positive: ['Felt great'], negative: [],
  },
  golf_routine: {
    question: 'Did a regular schedule feel different?',
    answers: ['Felt steadier', 'More energy', 'Slept better'],
    context: ['Golf', 'Friends', 'Early mornings', 'Walking'],
    positive: ['Felt steadier', 'More energy', 'Slept better'], negative: [],
  },
  retirement: {
    question: 'Does this match how that transition felt?',
    answers: ["Yes, that's exactly how it felt", 'It felt different than that'],
    context: ['Took time to adjust', 'Felt immediate', 'Still adjusting', 'Something else'],
    positive: ["Yes, that's exactly how it felt"], negative: ['It felt different than that'],
  },
  hikes: {
    question: 'Did Mondays feel different after hike weekends?',
    answers: ['More rested', 'More energy', 'Less stiff'],
    context: ['Weather', 'Friends', 'Longer hikes', 'Sleep'],
    positive: ['More rested', 'More energy', 'Less stiff'], negative: [],
  },
  project: {
    question: 'Does that match how those weeks went?',
    answers: ['Felt stretched', 'Skipped charging', 'Slept less'],
    context: ['Deadlines', 'Late nights', 'Travel', 'Forgot the watch'],
    positive: [], negative: [],
  },
  start: {
    question: 'How did the first month feel?',
    answers: ['Curious', 'Learning my normal', 'Hard to wear it'],
    context: ['New watch', 'Gaps in wearing it', 'Routine changed'],
    positive: [], negative: [],
  },
  pattern: {
    question: 'Does October feel like your most active time of year?',
    answers: ['Yes, that tracks', 'Not really'],
    context: ['Weather / season', 'Work schedule', 'Social life', 'Daylight hours', 'Just how it is'],
    positive: ['Yes, that tracks'], negative: ['Not really'],
  },
}
const VERIFY_DEFAULT = { question: 'Does this match how it felt?', answers: ['Matched', "Didn't match"], context: ['Travel', 'Training', 'Stress', 'Illness', 'Something else'], positive: ['Matched'], negative: ["Didn't match"] }
const NO_ANSWER_REPLY = 'Thanks. Fluent saved this with the Moment.'
function replyFor(cfg, answers, ctx) {
  let r
  if (answers.includes(IDR)) r = "That's common. Fluent saved this Moment as unrecorded and kept the reading open."
  else if (answers.includes(NONE)) r = 'Noted. Changes like this can pass without being felt. Fluent saved this with the Moment.'
  else if (answers.some(a => cfg.negative.includes(a))) r = 'Noted. Fluent will mark this reading as not matching what you noticed and will not build on it.'
  else if (answers.some(a => cfg.positive.includes(a))) r = 'Noted. Fluent will keep this reading and mark it as matching what you noticed.'
  else if (answers.length) r = 'Noted. Fluent saved this with the Moment, so it can be compared with similar readings later.'
  else r = NO_ANSWER_REPLY
  return r + (ctx?.length ? ` Context saved: ${ctx.join(', ')}.` : '')
}

function FluentReply({ text }) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    setShown(false)
    const t = setTimeout(() => setShown(true), 700)
    return () => clearTimeout(t)
  }, [text])
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 10 }}>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em', textTransform: 'uppercase', paddingTop: 7, flexShrink: 0 }}>Fluent</span>
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 12px', minHeight: 20 }}>
        {shown ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {text}
          </motion.p>
        ) : (
          <span style={{ display: 'inline-flex', gap: 4, padding: '4px 0' }}>
            {[0, 1, 2].map(i => (
              <motion.i key={i} animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', display: 'inline-block' }} />
            ))}
          </span>
        )}
        {shown && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.52)', margin: '6px 0 0' }}>Scripted reply. No model is running.</p>}
      </div>
    </div>
  )
}

// ── Small pieces ───────────────────────────────────────────────────────────
function Chip({ label, on, color, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{
        background: on ? color + '26' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${on ? color + '66' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 20, padding: '6px 14px', fontSize: 14, cursor: 'pointer',
        color: on ? color : 'var(--color-text-secondary)', transition: 'all 0.15s',
        userSelect: 'none',
      }}
    >
      {label}
    </span>
  )
}

function GhostButton({ children, onClick, primary, color, disabled }) {
  return (
    <button
      type="button" onClick={onClick} disabled={disabled}
      style={{
        background: primary ? (color || 'var(--color-accent)') : 'transparent',
        border: primary ? 'none' : '1px solid rgba(255,255,255,0.12)',
        borderRadius: 8, padding: '8px 16px', fontSize: 14, fontFamily: 'inherit',
        color: primary ? '#fff' : 'var(--color-text-secondary)',
        cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  )
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#fff',
  fontFamily: 'inherit', outline: 'none',
}

// ── Mini chart by type ─────────────────────────────────────────────────────
function MomentChart({ type }) {
  if (!type) return null
  if (type === 'rhr_trend')        return <RHRTrendChart height={140} />
  if (type === 'sport_hrv')        return <SportRecoveryBars compact />
  if (type === 'retirement_arc')   return <RetirementArcChart height={140} />
  if (type === 'seasonal_steps')   return <SeasonalStepsChart height={140} />
  if (type === 'illness_arc')      return <IllnessArcChart data={illnessArcData} height={140} compact />
  if (type === 'sober_experiment') return <SoberExperimentChart data={soberData} height={140} compact />
  return null
}

// ── Observation → Interpretation → Verification ───────────────────────────
// Observation and interpretation are Fluent's. Verification is the person's:
// did the reading match how it felt? Either answer, or skipping, is fine.
function StepRow({ label, who, state, color, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '136px 1fr', gap: 12, padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)', opacity: state === 'pending' ? 0.4 : 1 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
            border: `1.5px solid ${state === 'pending' ? 'rgba(255,255,255,0.25)' : color}`,
            background: state === 'done' ? color : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: '#0b0b0a', fontWeight: 700,
          }}>{state === 'done' ? '✓' : ''}</span>
          <span style={{ fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)' }}>{label}</span>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', margin: '3px 0 0 24px' }}>{who}</p>
      </div>
      <div>{children}</div>
    </div>
  )
}

function AnnotationFlow({ moment, color, flow, setFlow }) {
  const reading = moment.interpretation ?? INTERPRETATIONS[moment.id] ?? null
  const cfg = reading ? (VERIFY[moment.id] ?? VERIFY_DEFAULT) : { ...VERIFY_DEFAULT, answers: [], context: ['Travel', 'Training', 'Life change', 'Stress', 'Illness', 'Social', 'Work', 'Something else'] }
  const [answers, setAnswers] = useState(flow.answers ?? [])
  const [chips, setChips] = useState(flow.chips ?? [])
  const [text, setText] = useState(flow.text ?? '')
  const done = flow.step === 'done'
  const needsAnswer = !!reading
  const showContext = !needsAnswer || answers.length > 0
  const standalone = answers.includes(IDR) || answers.includes(NONE)
  const differs = answers.some(a => cfg.negative.includes(a))
  const saved = done && (flow.answers?.length > 0 || flow.chips?.length > 0 || flow.text)

  function pick(a) {
    setAnswers(prev => {
      if (a === IDR || a === NONE) return prev.includes(a) ? [] : [a]
      const rest = prev.filter(x => x !== IDR && x !== NONE)
      return rest.includes(a) ? rest.filter(x => x !== a) : [...rest, a]
    })
  }
  function save() {
    setFlow({ step: 'done', answers, chips, text: text.trim(), session: true })
  }

  return (
    <div>
      <StepRow label="Observation" who="Fluent, from your data" state="done" color={color}>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--color-text-secondary)', margin: 0 }}>{moment.observation}</p>
        {moment.dataNote && (
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', margin: '8px 0 0', lineHeight: 1.5 }}>{moment.dataNote}</p>
        )}
      </StepRow>

      <StepRow label="Interpretation" who="Fluent's reading" state="done" color={color}>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: reading ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.4)', margin: 0 }}>
          {reading ?? 'Fluent has not read this period yet. Add what was going on and it can look at the data around these dates.'}
        </p>
      </StepRow>

      <StepRow label="Verification" who="You" state={done ? 'done' : 'active'} color={color}>
        {!done ? (
          <div>
            {needsAnswer && (
              <>
                <p style={{ fontSize: 14, margin: '0 0 10px' }}>{cfg.question}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {[IDR, NONE, ...cfg.answers].map(o => (
                    <Chip key={o} label={o} color={color} on={answers.includes(o)} onClick={() => pick(o)} />
                  ))}
                </div>
              </>
            )}
            {showContext && !standalone && (
              <>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', margin: '4px 0 8px' }}>
                  {!needsAnswer ? 'What was going on?' : differs ? 'What felt different? (optional)' : 'Anything else going on around then? (optional)'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  {cfg.context.map(c => (
                    <Chip key={c} label={c} color={color} on={chips.includes(c)}
                      onClick={() => setChips(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])} />
                  ))}
                </div>
                <input value={text} onChange={e => setText(e.target.value)} placeholder="Or say it in your own words…" style={{ ...inputStyle, marginBottom: 12 }} />
              </>
            )}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              {showContext && (
                <GhostButton primary color={color} disabled={!answers.length && !chips.length && !text.trim()} onClick={save}>Save</GhostButton>
              )}
              <span onClick={() => setFlow({ step: 'done', answers: [], chips: [], text: '' })}
                style={{ fontSize: 14, color: 'rgba(255,255,255,0.62)', cursor: 'pointer' }}>Skip</span>
            </div>
          </div>
        ) : (
          <div>
            {!saved ? (
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Skipped</p>
            ) : (
              <>
                {flow.answers?.length > 0 && <p style={{ fontSize: 14, margin: '0 0 8px', color }}>{flow.answers.join(' · ')}</p>}
                {flow.chips?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: flow.text ? 8 : 0 }}>
                    {flow.chips.map(c => (
                      <span key={c} style={{ background: color + '1a', border: `1px solid ${color}40`, borderRadius: 12, padding: '3px 10px', fontSize: 13, color }}>{c}</span>
                    ))}
                  </div>
                )}
                {flow.text && <p style={{ fontSize: 14, fontStyle: 'italic', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>"{flow.text}"</p>}
              </>
            )}
            <p onClick={() => { setAnswers(flow.answers ?? []); setChips(flow.chips ?? []); setText(flow.text ?? ''); setFlow({ ...flow, step: 'verify' }) }}
              style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: '8px 0 0', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.15)' }}>Edit</p>
            {flow.session && saved && <FluentReply text={replyFor(cfg, flow.answers ?? [], flow.chips)} />}
          </div>
        )}
      </StepRow>
    </div>
  )
}

// ── Single moment card ─────────────────────────────────────────────────────
function MomentCard({ moment, color, isExpanded, onToggle, flow, setFlow, onForwardLink, delay }) {
  const subtitle = moment.subtitle ?? moment.insight
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{ marginBottom: 14 }}
    >
      <motion.div
        onClick={onToggle}
        style={{
          background: isExpanded ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
          borderStyle: 'solid',
          borderWidth: '1px 1px 1px 5px',
          borderColor: `${isExpanded ? color + '30' : 'rgba(255,255,255,0.06)'} ${isExpanded ? color + '30' : 'rgba(255,255,255,0.06)'} ${isExpanded ? color + '30' : 'rgba(255,255,255,0.06)'} ${color}`,
          borderRadius: 12,
          padding: isExpanded ? '16px 20px 18px' : '14px 20px',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 12, color, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>{moment.type}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{moment.date}</span>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3, margin: 0 }}>{moment.label}</p>
            {!isExpanded && subtitle && (
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.66)', margin: '4px 0 0', lineHeight: 1.4 }}>{subtitle}</p>
            )}
          </div>
          <motion.span animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.52)', fontSize: 13, marginTop: 2, flexShrink: 0 }}>→</motion.span>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }} onClick={e => e.stopPropagation()}
            >
              <div style={{ paddingTop: 16 }}>
                {moment.chart && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px 8px 4px', marginBottom: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <MomentChart type={moment.chart} />
                  </div>
                )}

                <AnnotationFlow moment={moment} color={color} flow={flow} setFlow={setFlow} />

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  {moment.insight ? (
                    <p style={{ fontSize: 14, color, fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>"{moment.insight}"</p>
                  ) : <span />}
                  {moment.forwardLink && (
                    <p onClick={(e) => { e.stopPropagation(); onForwardLink(moment.forwardLink) }}
                      style={{ fontSize: 14, color: 'var(--color-accent)', cursor: 'pointer', margin: 0, flexShrink: 0 }}>
                      {moment.forwardLink.label}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ── Add a moment ───────────────────────────────────────────────────────────
function AddMoment({ topics, onAddTopic, onSave, onCancel }) {
  const [topic, setTopic] = useState('pattern')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [newTag, setNewTag] = useState('')
  const [adding, setAdding] = useState(false)

  function commitTag() {
    const t = newTag.trim().toLowerCase()
    if (t) { onAddTopic(t); setTopic(t) }
    setNewTag(''); setAdding(false)
  }
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      style={{ overflow: 'hidden', marginBottom: 20 }}
    >
      <div style={{ background: 'rgba(255,255,255,0.05)', borderStyle: 'solid', borderWidth: '1px 1px 1px 5px', borderColor: `rgba(255,255,255,0.1) rgba(255,255,255,0.1) rgba(255,255,255,0.1) ${topics[topic] ?? '#888'}`, borderRadius: 12, padding: '18px 20px' }}>
        <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px' }}>Add a Moment</p>
        <p style={{ fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.66)', margin: '0 0 8px' }}>Topic</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {Object.keys(topics).map(t => <Chip key={t} label={t} color={topics[t]} on={topic === t} onClick={() => setTopic(t)} />)}
          {adding ? (
            <input autoFocus value={newTag} onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commitTag(); if (e.key === 'Escape') setAdding(false) }}
              onBlur={commitTag} placeholder="new topic" style={{ ...inputStyle, width: 120, padding: '5px 12px', borderRadius: 20, fontSize: 14 }} />
          ) : (
            <span onClick={() => setAdding(true)} style={{ border: '1px dashed rgba(255,255,255,0.25)', borderRadius: 20, padding: '6px 14px', fontSize: 14, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>+ New topic</span>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 10, marginBottom: 10 }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title, e.g. Started a new job" style={inputStyle} />
          <input value={date} onChange={e => setDate(e.target.value)} placeholder="Date, e.g. Oct 2026" style={inputStyle} />
        </div>
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="One line about it (optional)" style={{ ...inputStyle, marginBottom: 14 }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <GhostButton primary color={topics[topic]} disabled={!title.trim()}
            onClick={() => onSave({ topic, title: title.trim(), date: date.trim() || 'Undated', note: note.trim() })}>Add</GhostButton>
          <GhostButton onClick={onCancel}>Cancel</GhostButton>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main screen ────────────────────────────────────────────────────────────
export default function MomentsScreen({ persona, onNavigate, onBack, onFlow2 }) {
  const baseMoments = MOMENTS[persona] || MOMENTS.jamie
  const [topics, setTopics] = useState(BASE_TOPICS)
  const [userMoments, setUserMoments] = useState([])
  const [adding, setAdding] = useState(false)
  const moments = useMemo(() => [...userMoments, ...baseMoments], [userMoments, baseMoments])

  const [expanded, setExpanded] = useState(baseMoments[0]?.id || null)
  const [flows, setFlows] = useState({}) // momentId → { step, interp, verify, session }

  const colorOf = (m) => topics[m.type] ?? m.color
  const flowOf = (m) => flows[m.id] ?? (
    m.annotation
      ? { step: 'done', answers: [], chips: [], text: m.annotation }
      : { step: 'verify' }
  )

  function addTopic(name) {
    setTopics(prev => prev[name] ? prev : { ...prev, [name]: EXTRA_COLORS[(Object.keys(prev).length - Object.keys(BASE_TOPICS).length) % EXTRA_COLORS.length] })
  }
  function saveMoment({ topic, title, date, note }) {
    const id = `user_${Date.now()}`
    setUserMoments(prev => [{
      id, type: topic, date, label: title, subtitle: note || null, color: topics[topic],
      chart: null,
      observation: note || 'Added by you. Fluent has not looked at this period yet.',
      insight: '', dataNote: '', annotation: null, forwardLink: null,
    }, ...prev])
    setExpanded(id); setAdding(false)
  }
  function handleForwardLink(link) {
    if (link.scrollTo) {
      try { sessionStorage.setItem('fluent.scrollTo', link.scrollTo) } catch { /* storage unavailable */ }
    }
    if (link.screen) onNavigate(link.screen)
    else if (link.cardId) onFlow2?.(link.cardId)
  }

  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--color-base)',
      position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1,
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 30% 60%, rgba(6,129,252,0.07) 0%, transparent 60%)' }} />

      <div style={{ position: 'absolute', top: 32, left: 48, right: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>fluent</span>
        <span onClick={onBack} style={{ fontSize: 14, color: 'var(--color-text-secondary)', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>{persona}</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '100px 24px 120px', position: 'relative', zIndex: 1 }}>
        <PageContainer>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, marginBottom: 6 }}>Moments that shaped my health</h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, margin: 0 }}>Where data and life intersect</p>
            </div>
            <button type="button" aria-label="Add a Moment" onClick={() => setAdding(a => !a)}
              style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: adding ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 22, lineHeight: 1,
                cursor: 'pointer', fontFamily: 'inherit',
                transform: adding ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s',
              }}>+</button>
          </motion.div>

          <AnimatePresence>
            {adding && <AddMoment topics={topics} onAddTopic={addTopic} onSave={saveMoment} onCancel={() => setAdding(false)} />}
          </AnimatePresence>

          {moments.map((moment, i) => (
            <MomentCard
              key={moment.id}
              moment={moment}
              color={colorOf(moment)}
              isExpanded={expanded === moment.id}
              onToggle={() => setExpanded(prev => prev === moment.id ? null : moment.id)}
              flow={flowOf(moment)}
              setFlow={(f) => setFlows(prev => ({ ...prev, [moment.id]: f }))}
              onForwardLink={handleForwardLink}
              delay={0.05 + i * 0.05}
            />
          ))}

          {persona === 'yvonne' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginTop: 16, fontStyle: 'italic' }}>
              The data can see it. Whether it matches how you feel — that's the conversation Fluent is trying to start.
            </motion.p>
          )}
          {persona === 'alex' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: 32 }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.52)', lineHeight: 1.7 }}>
                Life context makes patterns meaningful. With a wearable and a few notes over time, Fluent can tell you not just when things changed — but why.
              </p>
            </motion.div>
          )}
        </PageContainer>
      </div>

      <FloatingNav active="moments" onNavigate={onNavigate} />
    </div>
  )
}
