import { useState } from 'react'
import { motion } from 'framer-motion'
import { Scene, Beat, useScene } from '../../Scene'
import { useIsNarrow } from '../../useIsNarrow'
import { Lead, Line, VerificationPrompt } from '../../primitives'
import SportSleepChart from '../../../charts/SportSleepChart'
import SleepHRVChart from '../../../charts/SleepHRVChart'
import MetricTooltip from '../../../MetricTooltip'

const QUIET   = 'var(--color-quiet, #888780)'
const ACCENT  = 'var(--color-accent, #0681fc)'
const RECOVER = 'var(--color-recovery, #27C48A)'
const SURFACE = '#1A1A18'

const STAGE_COLORS = {
  deep:  '#0681fc',
  rem:   '#27C48A',
  light: 'rgba(255,255,255,0.2)',
  awake: 'rgba(255,255,255,0.08)',
}

const NIGHTS = [
  { day: 'Mon', awake: 18, light: 162, rem: 108, deep: 72  },
  { day: 'Tue', awake: 12, light: 150, rem: 120, deep: 90  },
  { day: 'Wed', awake: 22, light: 168, rem: 102, deep: 66  },
  { day: 'Thu', awake: 8,  light: 144, rem: 126, deep: 96  },
  { day: 'Fri', awake: 14, light: 156, rem: 114, deep: 84  },
  { day: 'Sat', awake: 20, light: 160, rem: 108, deep: 76  },
  { day: 'Sun', awake: 10, light: 148, rem: 118, deep: 88  },
]

// Derived insights from the data
const bestDeepDay  = NIGHTS.reduce((a, b) => b.deep  > a.deep  ? b : a).day  // Thu
const bestRemDay   = NIGHTS.reduce((a, b) => b.rem   > a.rem   ? b : a).day  // Thu
const worstDeepDay = NIGHTS.reduce((a, b) => b.deep  < a.deep  ? b : a).day  // Wed

function SleepArchBar({ night, index, revealed, narrow }) {
  const [tip, setTip] = useState(false)
  const { reduced } = useScene()
  const total  = night.awake + night.light + night.rem + night.deep
  const stages = [
    { key: 'awake', label: 'Awake', pct: night.awake / total * 100, mins: night.awake },
    { key: 'light', label: 'Light', pct: night.light / total * 100, mins: night.light },
    { key: 'rem',   label: 'REM',   pct: night.rem   / total * 100, mins: night.rem   },
    { key: 'deep',  label: 'Deep',  pct: night.deep  / total * 100, mins: night.deep  },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative', flex: 1 }}>
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: revealed ? 1 : 0, scaleY: revealed ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.5, delay: index * 0.06, ease: 'easeOut' }}
        onMouseEnter={() => setTip(true)}
        onMouseLeave={() => setTip(false)}
        style={{
          display: 'flex', flexDirection: 'column-reverse',
          height: narrow ? 90 : 130,
          width: '100%', maxWidth: narrow ? 28 : 38,
          borderRadius: 4, overflow: 'hidden',
          transformOrigin: 'bottom', cursor: 'default',
        }}
      >
        {stages.map(s => (
          <div key={s.key} style={{ height: `${s.pct}%`, background: STAGE_COLORS[s.key], flexShrink: 0 }} />
        ))}
      </motion.div>
      <span style={{ fontSize: 9, color: QUIET }}>{night.day}</span>
      {tip && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
          transform: 'translateX(-50%)',
          background: SURFACE, border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, padding: '8px 12px',
          zIndex: 100, pointerEvents: 'none', whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>{night.day}</p>
          {[...stages].reverse().map(s => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <div style={{ width: 7, height: 7, borderRadius: 1, background: STAGE_COLORS[s.key], flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: QUIET, minWidth: 36 }}>{s.label}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{s.mins} min</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// QQRT expanded copy per spec
const QQRT = [
  {
    label: 'QUANTITY', metric: 'deep_sleep', value: '7.1 hr', trend: 'consistent',
    color: 'rgba(255,255,255,0.85)',
    detail: 'Your avg sleep this quarter. Consistent with your personal pattern — and within the recommended range.',
  },
  {
    label: 'QUALITY', metric: null, value: '92%', trend: '↑ strong',
    color: RECOVER,
    detail: 'Time asleep ÷ time in bed. 85%+ is considered strong. Yours is consistently above threshold.',
  },
  {
    label: 'REGULARITY', metric: null, value: '±34m', trend: '↓ improving',
    color: ACCENT,
    detail: 'Bedtime varies by about 34 minutes across the week — weekends typically later. Regularity is the most impactful sleep lever per sleep research.',
  },
  {
    label: 'TIMING', metric: null, value: '6:30am', trend: 'stable',
    color: 'rgba(255,255,255,0.85)',
    detail: "Your body tends to wake around 6:30–7am based on when your overnight HRV readings shift. Consistent across your data.",
  },
]

function QQRTCard({ item, revealed }) {
  const [expanded, setExpanded] = useState(false)
  const { reduced } = useScene()
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 8 }}
      transition={{ duration: reduced ? 0 : 0.4 }}
      onClick={() => setExpanded(v => !v)}
      style={{
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${expanded ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 10, display: 'grid', gap: 6, cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ fontSize: 9, color: QUIET, letterSpacing: '0.06em' }}>{item.label}</span>
        {item.metric && <MetricTooltip metric={item.metric} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 20, fontWeight: 500, color: item.color, letterSpacing: '-0.03em' }}>{item.value}</span>
        <span style={{ fontSize: 11, color: QUIET }}>{item.trend}</span>
      </div>
      {expanded && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ fontSize: 11, color: QUIET, lineHeight: 1.6, margin: 0, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 8 }}
        >
          {item.detail}
        </motion.p>
      )}
    </motion.div>
  )
}

const DAY_HRV = [
  { day: 'Mon', value: 46.2, best: true  },
  { day: 'Tue', value: 43.1 },
  { day: 'Wed', value: 41.8 },
  { day: 'Thu', value: 42.5 },
  { day: 'Fri', value: 40.3 },
  { day: 'Sat', value: 38.9, worst: true },
  { day: 'Sun', value: 42.1 },
]
const MAX_HRV = Math.max(...DAY_HRV.map(d => d.value))
const BAR_MAX_H = 72

function WeekRhythmChart({ revealed }) {
  const [tip, setTip] = useState(null)
  const { reduced } = useScene()
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: BAR_MAX_H + 24 }}>
        {DAY_HRV.map((d, i) => {
          const barH = Math.round((d.value / MAX_HRV) * BAR_MAX_H)
          return (
            <div
              key={d.day}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1, position: 'relative', cursor: 'default' }}
              onMouseEnter={() => setTip(d)}
              onMouseLeave={() => setTip(null)}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: revealed ? barH : 0 }}
                transition={{ duration: reduced ? 0 : 0.5, delay: i * 0.06, ease: 'easeOut' }}
                style={{
                  width: '100%',
                  background: d.best ? RECOVER : d.worst ? 'rgba(232,80,74,0.7)' : 'rgba(255,255,255,0.18)',
                  borderRadius: '3px 3px 0 0',
                }}
              />
              <span style={{ fontSize: 10, color: d.best || d.worst ? 'rgba(255,255,255,0.65)' : QUIET }}>{d.day}</span>
              {tip === d && (
                <div style={{
                  position: 'absolute', bottom: '100%', left: '50%',
                  transform: 'translateX(-50%)',
                  background: SURFACE, border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 6, padding: '5px 10px',
                  zIndex: 100, pointerEvents: 'none', whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)', marginBottom: 4,
                }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>{d.day}: {d.value}ms HRV</span>
                  {d.best  && <div style={{ fontSize: 10, color: RECOVER, marginTop: 2 }}>↑ best recovery day</div>}
                  {d.worst && <div style={{ fontSize: 10, color: '#E8504A', marginTop: 2 }}>↓ hardest recovery day</div>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Beat map:
// 0 opening
// 1 arch bars + QQRT
// 2 deep sleep copy (moved below QQRT)
// 3 sport radar
// 4 sleep×HRV
// 5 weekly HRV (two-col: chart left, copy right)
// 6 verification

export default function Scene05Sleep({ beat, isActive, response, onRespond }) {
  const narrow = useIsNarrow()

  return (
    <Scene layout="wide" beat={beat} isActive={isActive} label="How you slept" maxWidth={1000}>

      <Beat at={0}>
        <Lead style={{ textAlign: 'left' }}>Your sleep isn't just a number.</Lead>
        <Line tone="secondary" style={{ textAlign: 'left', marginTop: 8 }}>
          It changes the way the rest of your data behaves.
        </Line>
      </Beat>

      {/* Beat 1 — arch bars LEFT, QQRT RIGHT */}
      <Beat at={1}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : '1fr 1fr',
          gap: narrow ? 20 : 32, alignItems: 'start',
        }}>
          {/* Left: arch bars */}
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', gap: narrow ? 4 : 6, alignItems: 'flex-end' }}>
              {NIGHTS.map((night, i) => (
                <SleepArchBar key={night.day} night={night} index={i} revealed={beat >= 1} narrow={narrow} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {[['Deep', STAGE_COLORS.deep], ['REM', STAGE_COLORS.rem], ['Light', STAGE_COLORS.light], ['Awake', 'rgba(255,255,255,0.35)']].map(([label, color]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                  <span style={{ fontSize: 11, color: QUIET }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: QQRT — clickable to expand */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {QQRT.map(item => <QQRTCard key={item.label} item={item} revealed={beat >= 1} />)}
          </div>
        </div>
      </Beat>

      {/* Beat 2 — deep sleep copy, moved below QQRT */}
      <Beat at={2}>
        <div style={{ display: 'grid', gap: 6 }}>
          <Line style={{ textAlign: 'left' }}>Your deep sleep has been gradually increasing.</Line>
          <Line tone="secondary" style={{ textAlign: 'left' }}>This is when your body repairs.</Line>
          <p style={{ fontSize: 13, color: QUIET, lineHeight: 1.7, fontStyle: 'italic', margin: '8px 0 0', maxWidth: 560 }}>
            Sleep data is directional guidance — not a score to optimize. A late night for something worth it is not a health failure. It's a life decision the data can see but can't judge.
          </p>
        </div>
      </Beat>

      {/* Beat 3 — radar LEFT, copy RIGHT */}
      <Beat at={3}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : '1fr 1fr',
          gap: narrow ? 20 : 32, alignItems: 'center',
        }}>
          <SportSleepChart size={narrow ? 200 : 250} />
          <div style={{ display: 'grid', gap: 10 }}>
            <Line style={{ textAlign: 'left', fontWeight: 500 }}>
              What you do during the day shows up in how you sleep at night.
            </Line>
            <Line tone="secondary" style={{ textAlign: 'left', fontSize: 13 }}>
              Tennis nights: deep sleep 60 min — 25% above your baseline.
            </Line>
            <Line tone="secondary" style={{ textAlign: 'left', fontSize: 13 }}>
              Skiing nights: deep sleep 38 min — 21% below.
            </Line>
            <Line tone="quiet" style={{ textAlign: 'left', fontSize: 12, fontStyle: 'italic' }}>
              The same sports that affect your recovery also affect your sleep architecture.
            </Line>
          </div>
        </div>
      </Beat>

    </Scene>
  )
}