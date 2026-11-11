import { useState } from 'react'
import { motion } from 'framer-motion'
import { useIsNarrow } from '../scrolly/useIsNarrow'
import data from '../../data/yvonne/sport_recovery.json'

const QUIET   = 'var(--color-quiet, #A3A29A)'
const RECOVER = 'var(--color-recovery, #27C48A)'
const STRESS  = 'var(--color-stress, #E8504A)'
const TEXT    = 'var(--color-text, rgba(255,255,255,0.92))'

const when = (d) => (d === 0 ? 'day of' : d === 1 ? 'next day' : `${d} days after`)
const fmt  = (v) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1)}`

const VIEWS = [
  { id: 'peak', label: 'Biggest swing' },
  { id: '0', label: 'Day of' },
  { id: '1', label: '+1 day' },
  { id: '2', label: '+2 days' },
  { id: '3', label: '+3 days' },
]

/**
 * SportRecoveryBars — average HRV change from the 30-night baseline after each
 * sport. Chips switch between the day it moves furthest and each single day
 * (day of, +1, +2, +3). Rows keep one order so bars animate in place.
 * `compact` drops chips and the footnote (used inside Moments cards).
 */
export default function SportRecoveryBars({ compact = false }) {
  const narrow = useIsNarrow()
  const [view, setView] = useState('peak')
  const sports = data.sports ?? []
  if (!sports.length) return null

  const val = (s) => (view === 'peak' ? s.peak : s.offsets?.[view]?.mean ?? null)
  const day = (s) => (view === 'peak' ? s.peak_day : Number(view))
  const shown = sports.filter((s) => val(s) != null)
  const max = Math.max(...sports.flatMap((s) => [0, 1, 2, 3].map((k) => Math.abs(s.offsets?.[String(k)]?.mean ?? 0))), 1)

  const lo = shown.reduce((a, b) => (val(b) < val(a) ? b : a))
  const hi = shown.reduce((a, b) => (val(b) > val(a) ? b : a))
  const day3 = lo.offsets?.['3']?.mean
  const takeaway = view === 'peak'
    ? `${lo.label} costs the most: ${fmt(lo.peak)} ms ${when(lo.peak_day)}` +
      (day3 != null ? `, back to ${fmt(day3)} by day 3` : '') +
      `. ${hi.label} gives the most back: ${fmt(hi.peak)} ms ${when(hi.peak_day)}.`
    : `${view === '0' ? 'On the day itself' : view === '1' ? 'The next day' : `${view} days after`}, ${lo.label} is lowest (${fmt(val(lo))} ms) and ${hi.label} highest (${fmt(val(hi))} ms).`

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {!compact && (
        <div role="group" aria-label="When to measure" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {VIEWS.map((v) => {
            const on = v.id === view
            return (
              <button key={v.id} type="button" onClick={() => setView(v.id)} aria-pressed={on}
                style={{
                  background: on ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: `1px solid ${on ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
                  color: on ? '#fff' : 'rgba(255,255,255,0.7)',
                  borderRadius: 999, padding: '5px 13px', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
                }}>
                {v.label}
              </button>
            )
          })}
        </div>
      )}

      <div style={{ display: 'grid', gap: compact ? 8 : 12 }}>
        {sports.map((s, i) => {
          const v = val(s)
          const d = day(s)
          const neg = (v ?? 0) < 0
          const pct = v == null ? 0 : (Math.abs(v) / max) * 50
          const traj = [0, 1, 2, 3].map((k) => (s.offsets?.[String(k)] ? fmt(s.offsets[String(k)].mean) : '–')).join('  ·  ')
          return (
            <div key={s.id}
              title={`${s.label} (${s.sessions} days with a session)\nDay of · +1 · +2 · +3:  ${traj} ms`}
              style={{ display: 'grid', gridTemplateColumns: narrow ? 'minmax(0,1fr) auto' : '84px 1fr 120px', alignItems: narrow ? 'start' : 'center', columnGap: 12, rowGap: 6 }}>
              <span style={{ fontSize: 15, color: TEXT, textAlign: narrow ? 'left' : 'right', ...(narrow ? { gridRow: 2, gridColumn: 1 } : {}) }}>{s.label}</span>
              <div style={{ position: 'relative', height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 999, ...(narrow ? { gridRow: 1, gridColumn: '1 / -1' } : {}) }}>
                <div style={{ position: 'absolute', left: '50%', top: -3, bottom: -3, width: 1, background: 'rgba(255,255,255,0.3)' }} />
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.45, delay: view === 'peak' ? 0.05 * i : 0, ease: [0.22, 0.61, 0.36, 1] }}
                  style={{
                    position: 'absolute', top: 0, bottom: 0, borderRadius: 999,
                    background: neg ? STRESS : RECOVER,
                    ...(neg ? { right: '50%' } : { left: '50%' }),
                  }} />
              </div>
              <span style={{ fontSize: 14, lineHeight: 1.25, ...(narrow ? { gridRow: 2, gridColumn: 2, textAlign: 'right' } : {}) }}>
                <span style={{ color: neg ? STRESS : RECOVER, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                  {v == null ? '–' : `${fmt(v)} ms`}
                </span>
                <span style={{ display: 'block', fontSize: 12, color: QUIET }}>
                  {view === 'peak' ? `${when(d)} · ` : ''}{s.sessions} days
                </span>
              </span>
            </div>
          )
        })}
      </div>

      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
        "{takeaway}"
      </p>
      {!compact && (
        <p style={{ fontSize: 12, color: QUIET, lineHeight: 1.5, margin: 0 }}>
          {data.note} Hover a row for its full day-of to day +3 sequence.
        </p>
      )}
    </div>
  )
}
