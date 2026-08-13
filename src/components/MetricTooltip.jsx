import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Metric definitions ────────────────────────────────────────────────────
// Each entry has:
//   label       — short display name
//   unit        — measurement unit
//   what        — one sentence: what this signal is
//   why         — one sentence: why it matters
//   caveat      — epistemic note: what it can't tell you / how to read it carefully
//   range       — optional: typical personal range context
const METRICS = {
  hrv: {
    label: 'HRV',
    unit: 'milliseconds (ms)',
    what: 'Heart Rate Variability — the variation in time between consecutive heartbeats, measured overnight.',
    why: 'Higher HRV generally reflects a more adaptable, regulated nervous system. It tends to rise with recovery and fall under stress, illness, or high training load.',
    caveat: 'HRV is personal — your 38ms may be healthier than someone else\'s 55ms. Fluent compares you to your own baseline, not a population range. A single night means almost nothing; a week-long trend means more.',
  },
  rhr: {
    label: 'RHR',
    unit: 'beats per minute (bpm)',
    what: 'Resting Heart Rate — the rate your heart settles into when nothing is being asked of it, read from your overnight data.',
    why: 'A lower resting rate typically reflects greater cardiovascular efficiency. It tends to fall as fitness improves and rise with illness, stress, alcohol, or disrupted sleep.',
    caveat: 'RHR moves for many reasons — a falling trend over months is meaningful; a single elevated night usually isn\'t. Fluent tracks the arc, not the spike.',
  },
  deep_sleep: {
    label: 'Deep Sleep',
    unit: 'minutes / % of total sleep',
    what: 'The slowest-wave stage of sleep — also called N3 or slow-wave sleep — when your body does most of its physical repair.',
    why: 'Deep sleep is when growth hormone is released, tissue repairs, and your immune system consolidates. More deep sleep generally means better physical recovery.',
    caveat: 'Deep sleep naturally decreases with age and varies night to night. Your tracker estimates sleep stages from movement and heart rate — it\'s a reasonable proxy, not a clinical measurement.',
  },
  rem: {
    label: 'REM Sleep',
    unit: 'minutes / % of total sleep',
    what: 'Rapid Eye Movement sleep — the stage most associated with dreaming, memory consolidation, and emotional processing.',
    why: 'REM sleep is linked to learning, emotional regulation, and cognitive performance. Consistent REM across nights is generally more meaningful than any single night\'s count.',
    caveat: 'Tracker-estimated REM is less accurate than deep sleep estimation. Use it as a relative indicator across your own data rather than a precise figure.',
  },
  vo2max: {
    label: 'VO₂ Max',
    unit: 'ml/kg/min',
    what: 'An estimate of your maximum oxygen uptake — how efficiently your body uses oxygen during intense exercise.',
    why: 'VO₂ Max is one of the stronger predictors of long-term cardiovascular health in research literature. Rising VO₂ Max typically reflects improving aerobic fitness.',
    caveat: 'Wearable VO₂ Max estimates are calculated from heart rate and pace data — they\'re directionally useful but not clinically precise. Treat trends as signal; treat exact numbers as approximate.',
  },
  respiratory_rate: {
    label: 'Respiratory Rate',
    unit: 'breaths per minute',
    what: 'How many times you breathe per minute while asleep — measured passively by your wearable overnight.',
    why: 'Respiratory rate is stable when you\'re healthy and tends to rise with illness, high stress, or alcohol. It\'s one of the earliest signals of oncoming sickness.',
    caveat: 'Small fluctuations are normal. A sustained elevation across several nights is more meaningful than a single high reading.',
  },
  spo2: {
    label: 'SpO₂',
    unit: '% blood oxygen saturation',
    what: 'An estimate of how much oxygen your red blood cells are carrying, measured by your wearable\'s optical sensor.',
    why: 'Most healthy adults maintain SpO₂ above 95% during sleep. Sustained dips can indicate disrupted breathing or altitude effects.',
    caveat: 'Consumer wearable SpO₂ readings are estimates, not medical-grade measurements. Occasional dips are common and often artefactual. If you see consistent low readings alongside symptoms, that\'s worth discussing with a doctor — Fluent can\'t interpret this clinically.',
  },
}

const SURFACE   = 'var(--color-surface, #1A1A18)'
const ACCENT    = 'var(--color-accent, #0681fc)'
const TEXT      = 'var(--color-text, rgba(255,255,255,0.92))'
const SECONDARY = 'var(--color-text-secondary, rgba(255,255,255,0.62))'
const QUIET     = 'var(--color-quiet, #888780)'
const HAIRLINE  = 'rgba(255,255,255,0.1)'

/**
 * MetricTooltip
 *
 * Inline expandable explainer — drop it anywhere next to a metric label.
 *
 * Usage:
 *   import MetricTooltip from '../components/MetricTooltip'
 *   <MetricTooltip metric="hrv" />
 *   <MetricTooltip metric="rhr" marker="①" />
 *
 * Props:
 *   metric   — key from METRICS above (required)
 *   marker   — optional symbol shown before the label (default: '?')
 *   inline   — if true, renders as an inline span rather than a block div
 *   maxWidth — max width of the expanded panel (default: 440)
 */
export default function MetricTooltip({ metric, marker = '?', inline = false, maxWidth = 440 }) {
  const [open, setOpen] = useState(false)
  const def = METRICS[metric]

  if (!def) return null

  const Wrapper = inline ? 'span' : 'div'

  return (
    <Wrapper style={{ display: inline ? 'inline-flex' : 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-label={`What is ${def.label}?`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'transparent',
          border: 'none',
          padding: '2px 0',
          margin: 0,
          cursor: 'pointer',
          fontFamily: 'inherit',
          textAlign: 'left',
        }}
      >
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: ACCENT,
          background: 'rgba(6,129,252,0.12)',
          border: `1px solid rgba(6,129,252,0.25)`,
          borderRadius: 4,
          padding: '1px 6px',
          letterSpacing: '0.04em',
          lineHeight: 1.6,
          userSelect: 'none',
        }}>
          {marker !== '?' ? marker : def.label}
        </span>
        {marker !== '?' && (
          <span style={{ fontSize: 13, color: SECONDARY, borderBottom: `1px solid ${HAIRLINE}` }}>
            What is {def.label}?
          </span>
        )}
      </button>

      {/* Expanded panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: 8,
              padding: 16,
              borderRadius: 10,
              background: SURFACE,
              border: `1px solid ${HAIRLINE}`,
              maxWidth,
              display: 'grid',
              gap: 10,
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{def.label}</span>
                <span style={{ fontSize: 11, color: QUIET }}>{def.unit}</span>
              </div>

              {/* What */}
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: SECONDARY }}>
                {def.what}
              </p>

              {/* Why it matters */}
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: SECONDARY }}>
                {def.why}
              </p>

              {/* Epistemic caveat — visually quieter */}
              <p style={{
                margin: 0,
                fontSize: 12,
                lineHeight: 1.6,
                color: QUIET,
                borderTop: `1px solid ${HAIRLINE}`,
                paddingTop: 10,
                fontStyle: 'italic',
              }}>
                {def.caveat}
              </p>

              {/* Close */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  alignSelf: 'flex-start',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  fontSize: 12,
                  color: QUIET,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                close ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Wrapper>
  )
}

// Named export so other files can reference the definitions without
// importing the whole component (e.g. for Flow2's InfoNote content).
export { METRICS }