import { motion } from 'framer-motion'
import { Scene, Beat, useScene } from '../../Scene'
import { useIsNarrow } from '../../useIsNarrow'
import { Lead, Line, VerificationPrompt } from '../../primitives'

const QUIET  = 'var(--color-quiet, #888780)'
const ACCENT = 'var(--color-accent, #0681fc)'
const RECOVER = 'var(--color-recovery, #27C48A)'

// ── Sleep stage colour palette ────────────────────────────────────────────
const STAGE_COLORS = {
  deep:  '#0681fc',
  rem:   '#27C48A',
  light: 'rgba(255,255,255,0.2)',
  awake: 'rgba(255,255,255,0.08)',
}

// ── Representative nightly sleep architecture bars ────────────────────────
// Each entry is one "typical night" — stages in order: awake, light, REM, deep.
// Heights are proportional to minutes; total ≈ 480 (8h).
const NIGHTS = [
  { awake: 18, light: 162, rem: 108, deep: 72 },
  { awake: 12, light: 150, rem: 120, deep: 90 },
  { awake: 22, light: 168, rem: 102, deep: 66 },
  { awake: 8,  light: 144, rem: 126, deep: 96 },
  { awake: 14, light: 156, rem: 114, deep: 84 },
  { awake: 20, light: 160, rem: 108, deep: 76 },
  { awake: 10, light: 148, rem: 118, deep: 88 },
]

function SleepArchBar({ night, index, revealed, narrow }) {
  const { reduced } = useScene()
  const total = night.awake + night.light + night.rem + night.deep
  const stages = [
    { key: 'awake', pct: night.awake / total * 100 },
    { key: 'light', pct: night.light / total * 100 },
    { key: 'rem',   pct: night.rem   / total * 100 },
    { key: 'deep',  pct: night.deep  / total * 100 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: revealed ? 1 : 0, scaleY: revealed ? 1 : 0 }}
      transition={{ duration: reduced ? 0 : 0.5, delay: index * 0.06, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column-reverse', // deep at bottom, awake at top
        height: narrow ? 120 : 160,
        width: narrow ? 28 : 36,
        borderRadius: 4,
        overflow: 'hidden',
        transformOrigin: 'bottom',
      }}
    >
      {stages.map(s => (
        <div
          key={s.key}
          style={{
            height: `${s.pct}%`,
            background: STAGE_COLORS[s.key],
            flexShrink: 0,
          }}
        />
      ))}
    </motion.div>
  )
}

// ── QQRT stat card ────────────────────────────────────────────────────────
function QQRTCard({ label, value, trend, color, revealed }) {
  const { reduced } = useScene()
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 12 }}
      transition={{ duration: reduced ? 0 : 0.5 }}
      style={{
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        display: 'grid',
        gap: 6,
      }}
    >
      <span style={{ fontSize: 11, color: QUIET, letterSpacing: '0.04em' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 500, color, letterSpacing: '-0.03em' }}>{value}</span>
        <span style={{ fontSize: 12, color: QUIET }}>{trend}</span>
      </div>
    </motion.div>
  )
}

// ── Days of week rhythm bar (simplified) ─────────────────────────────────
const DAY_HRV = [
  { day: 'Mon', value: 46.2 },
  { day: 'Tue', value: 43.1 },
  { day: 'Wed', value: 41.8 },
  { day: 'Thu', value: 42.5 },
  { day: 'Fri', value: 40.3 },
  { day: 'Sat', value: 38.9 },
  { day: 'Sun', value: 42.1 },
]
const MAX_HRV = Math.max(...DAY_HRV.map(d => d.value))

function WeekRhythmMini({ revealed, narrow }) {
  const { reduced } = useScene()
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: narrow ? 6 : 8, height: narrow ? 56 : 72 }}>
      {DAY_HRV.map((d, i) => {
        const pct = d.value / MAX_HRV * 100
        const isBest  = d.day === 'Mon'
        const isWorst = d.day === 'Sat'
        return (
          <div key={d.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: revealed ? `${pct}%` : 0 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: i * 0.05, ease: 'easeOut' }}
              style={{
                width: '100%',
                background: isBest ? RECOVER : isWorst ? 'rgba(232,80,74,0.6)' : 'rgba(255,255,255,0.15)',
                borderRadius: '3px 3px 0 0',
                minHeight: 2,
              }}
            />
            <span style={{ fontSize: 10, color: isBest || isWorst ? 'rgba(255,255,255,0.6)' : QUIET }}>{d.day}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── Scene 5 ───────────────────────────────────────────────────────────────
// Beat sequence:
//   0 — "Your sleep has been changing quietly…"
//   1 — sleep architecture bars appear
//   2 — QQRT cards appear
//   3 — "Your deep sleep has been gradually increasing"
//   4 — weekly rhythm bars appear
//   5 — "Your Mondays…Saturdays…" copy
//   6 — verification

export default function Scene05Sleep({ beat, isActive, response, onRespond }) {
  const narrow = useIsNarrow()

  return (
    <Scene
      layout="wide"
      beat={beat}
      isActive={isActive}
      label="How you slept"
      maxWidth={1000}
    >
      <Beat at={0}>
        <Lead style={{ textAlign: 'left' }}>
          Your sleep has been changing quietly in the background.
        </Lead>
      </Beat>

      {/* Sleep architecture bars */}
      <Beat at={1}>
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'flex', gap: narrow ? 6 : 10, alignItems: 'flex-end' }}>
            {NIGHTS.map((night, i) => (
              <SleepArchBar key={i} night={night} index={i} revealed={beat >= 1} narrow={narrow} />
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[['Deep', STAGE_COLORS.deep], ['REM', STAGE_COLORS.rem], ['Light', STAGE_COLORS.light], ['Awake', 'rgba(255,255,255,0.3)']].map(([label, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                <span style={{ fontSize: 11, color: QUIET }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Beat>

      {/* QQRT cards */}
      <Beat at={2}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: 12,
        }}>
          <QQRTCard label="DEEP SLEEP"  value="+26%"       trend="since Dec 2025" color={ACCENT}  revealed={beat >= 2} />
          <QQRTCard label="REM SLEEP"   value="consistent" trend="steady"          color={RECOVER} revealed={beat >= 2} />
          <QQRTCard label="AWAKE TIME"  value="↓"          trend="improving"       color={RECOVER} revealed={beat >= 2} />
          <QQRTCard label="EFFICIENCY"  value="87%"        trend="avg"             color="rgba(255,255,255,0.8)" revealed={beat >= 2} />
        </div>
      </Beat>

      <Beat at={3}>
        <div style={{ display: 'grid', gap: 6 }}>
          <Line style={{ textAlign: 'left' }}>Your deep sleep has been gradually increasing.</Line>
          <Line tone="secondary" style={{ textAlign: 'left' }}>This is when your body repairs.</Line>
        </div>
      </Beat>

      {/* Weekly rhythm mini chart */}
      <Beat at={4}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 10,
          padding: narrow ? '14px 16px' : '18px 20px',
        }}>
          <p style={{ fontSize: 11, color: QUIET, letterSpacing: '0.05em', marginBottom: 12 }}>
            MORNING HRV BY DAY OF WEEK
          </p>
          <WeekRhythmMini revealed={beat >= 4} narrow={narrow} />
        </div>
      </Beat>

      <Beat at={5}>
        <div style={{ display: 'grid', gap: 6 }}>
          <Line style={{ textAlign: 'left' }}>Your Mondays are your best recovery days.</Line>
          <Line style={{ textAlign: 'left' }}>Your Saturdays are your hardest.</Line>
          <Line tone="secondary" style={{ textAlign: 'left', fontStyle: 'italic' }}>
            Your body found this rhythm. You probably didn't plan it.
          </Line>
        </div>
      </Beat>

      <Beat at={6}>
        <VerificationPrompt
          question="Does Monday feel different from Saturday?"
          options={['Yes, noticeably', 'Not really', 'Skip']}
          value={response}
          onChange={onRespond}
          acknowledgement="Your nervous system tracks these rhythms whether you do or not."
        />
      </Beat>
    </Scene>
  )
}