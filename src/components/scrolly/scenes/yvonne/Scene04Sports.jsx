import { motion } from 'framer-motion'
import PuddingScene from '../../PuddingScene'
import { Lead, Line, VerificationPrompt } from '../../primitives'

const QUIET   = 'var(--color-quiet, #888780)'
const RECOVER = 'var(--color-recovery, #27C48A)'
const STRESS  = 'var(--color-stress, #E8504A)'
const TEXT    = 'var(--color-text, rgba(255,255,255,0.92))'

const SPORTS = [
  { id: 'skiing',   label: 'Skiing',   delta: -10.4, note: '4 days to recover' },
  { id: 'cycling',  label: 'Cycling',  delta: -1.2,  note: null },
  { id: 'running',  label: 'Running',  delta: +1.8,  note: null },
  { id: 'strength', label: 'Strength', delta: +2.3,  note: null },
  { id: 'tennis',   label: 'Tennis',   delta: +5.5,  note: '+5.5ms two days after' },
]
const MAX_ABS = Math.max(...SPORTS.map(s => Math.abs(s.delta)))

// Cumulative — each step reveals its own bars PLUS everything from
// earlier steps, matching the original beat-based reveal pattern.
const STEP_REVEALS = {
  intro:  [],
  skiing: ['skiing'],
  others: ['skiing', 'cycling', 'running', 'strength'],
  tennis: ['skiing', 'cycling', 'running', 'strength', 'tennis'],
  agency: ['skiing', 'cycling', 'running', 'strength', 'tennis'],
  verify: ['skiing', 'cycling', 'running', 'strength', 'tennis'],
}

function SportBar({ sport, revealed }) {
  const isNeg = sport.delta < 0
  const color = isNeg ? STRESS : RECOVER
  const pct = (Math.abs(sport.delta) / MAX_ABS) * 100
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr auto', alignItems: 'center', gap: 16 }}>
      <span style={{ fontSize: 16, color: revealed ? TEXT : QUIET, textAlign: 'right', transition: 'color 0.3s' }}>
        {sport.label}
      </span>
      <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
        <motion.div
          animate={{ width: revealed ? `${pct}%` : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          style={{ position: 'absolute', top: 0, bottom: 0, left: isNeg ? 'auto' : 0, right: isNeg ? 0 : 'auto', background: color, borderRadius: 999 }}
        />
      </div>
      <span style={{ fontSize: 16, color: revealed ? color : 'transparent', fontVariantNumeric: 'tabular-nums', minWidth: 52, textAlign: 'right', transition: 'color 0.3s' }}>
        {sport.delta > 0 ? '+' : ''}{sport.delta}ms
      </span>
    </div>
  )
}

/**
 * Scene 4 — What Data Noticed, rebuilt on PuddingScene. HRV bar
 * chart sticky on the right (matching original layout), text scrolls
 * on the left. Bars reveal cumulatively as you scroll through — same
 * pattern the old beat system used, just driven by scroll steps
 * instead of a beat counter. Scrolling back up un-reveals correctly
 * since react-scrollama re-fires onStepEnter in both directions.
 */
export default function Scene04Sports({ story, response, onRespond }) {
  const steps = [
    { id: 'intro', content: <Lead>The data noticed something about what you do.</Lead> },
    {
      id: 'skiing',
      content: (
        <div>
          <Line>Skiing costs the most.</Line>
          <Line tone="secondary">−10.4ms the day you ski. Four days to fully recover.</Line>
        </div>
      ),
    },
    {
      id: 'others',
      content: <Line tone="secondary">Cycling, running, and strength training all land somewhere in between.</Line>,
    },
    {
      id: 'tennis',
      content: (
        <div>
          <Line>Tennis gives the most back.</Line>
          <Line tone="secondary">+5.5ms two days after. More than cycling or running.</Line>
        </div>
      ),
    },
    {
      id: 'agency',
      content: (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
          <Line>Skiing costs the most. You ski anyway.</Line>
          <Line tone="quiet" style={{ fontStyle: 'italic' }}>That's not optimization. That's agency.</Line>
        </div>
      ),
    },
    {
      id: 'verify',
      content: (
        <VerificationPrompt
          question="Did you know tennis was doing this for your recovery?"
          options={["Yes, I've noticed", 'No — this is new', 'I play for other reasons']}
          value={response}
          onChange={onRespond}
          acknowledgement={(v) =>
            v === "Yes, I've noticed" ? "Your intuition was picking up something real."
            : v === 'I play for other reasons' ? "The data noticed something you weren't tracking. Both things are true."
            : "Now you have a name for something you've been feeling."
          }
        />
      ),
    },
  ]

  return (
    <PuddingScene
      label="What the data noticed"
      visualSide="right"
      visualFlex={50}
      textFlex={50}
      steps={steps}
      renderVisual={(activeStepId) => {
        const revealedIds = new Set(STEP_REVEALS[activeStepId] ?? [])
        return (
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '28px 24px', display: 'grid', gap: 18, width: '100%', maxWidth: 420,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: QUIET, letterSpacing: '0.05em' }}>HRV DELTA AFTER ACTIVITY</span>
              <span style={{ fontSize: 11, color: QUIET }}>ms</span>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              {SPORTS.map(sport => (
                <SportBar key={sport.id} sport={sport} revealed={revealedIds.has(sport.id)} />
              ))}
            </div>
            <p style={{ fontSize: 11, color: QUIET, marginTop: 4, lineHeight: 1.5 }}>
              Based on {story?.tennis?.sessions ?? 22} tennis sessions since 2025.
              Compared against your personal HRV baseline.
            </p>
          </div>
        )
      }}
    />
  )
}