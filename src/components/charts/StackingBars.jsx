import { motion } from 'framer-motion'
import { useIsNarrow } from '../scrolly/useIsNarrow'
import data from '../../data/yvonne/stacking.json'

const QUIET   = 'var(--color-quiet, #A3A29A)'
const RECOVER = 'var(--color-recovery, #27C48A)'
const STRESS  = 'var(--color-stress, #E8504A)'
const TEXT    = 'var(--color-text, rgba(255,255,255,0.92))'
const fmt = (v) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1)}`

/**
 * StackingBars — next-morning HRV change by how many active days came in a row.
 * Computed by health_insights/export_stacking.py. Same bar language as the
 * sport recovery bars (shared zero line, red below, green above).
 */
export default function StackingBars() {
  const narrow = useIsNarrow()
  const rows = data.streaks ?? []
  if (!rows.length) return null
  const max = Math.max(...rows.map((r) => Math.abs(r.next_day)), 1)

  const rest = rows[0]
  const stacked = rows.filter((r) => /^[345]/.test(r.label))
  const nTot = stacked.reduce((a, r) => a + r.n, 0)
  const stackedAvg = nTot ? stacked.reduce((a, r) => a + r.next_day * r.n, 0) / nTot : 0
  const diff = stackedAvg - rest.next_day
  const lead = diff >= -1
    ? 'No sign that stacking days costs you.'
    : 'Stacking days does cost you.'
  const takeaway = `${lead} After 3 or more active days in a row, the next morning's HRV averages ${fmt(stackedAvg)} ms, against ${fmt(rest.next_day)} ms after a rest day.`
  const g = data.rest
  const restLine = g
    ? `Days off: HRV runs ${fmt(g.short_gap.hrv)} ms after 1–3 days off and ${fmt(g.long_gap.hrv)} ms after 4 or more (${g.long_gap.n} days).`
    : null

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'grid', gap: 10 }}>
        {rows.map((r, i) => {
          const neg = r.next_day < 0
          const pct = (Math.abs(r.next_day) / max) * 50
          return (
            <div key={r.label} style={{ display: 'grid', gridTemplateColumns: narrow ? 'minmax(0,1fr) auto' : '96px 1fr 110px', alignItems: narrow ? 'start' : 'center', columnGap: 12, rowGap: 6 }}>
              <span style={{ fontSize: 15, color: TEXT, textAlign: narrow ? 'left' : 'right', ...(narrow ? { gridRow: 2, gridColumn: 1 } : {}) }}>{r.label}</span>
              <div style={{ position: 'relative', height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 999, ...(narrow ? { gridRow: 1, gridColumn: '1 / -1' } : {}) }}>
                <div style={{ position: 'absolute', left: '50%', top: -3, bottom: -3, width: 1, background: 'rgba(255,255,255,0.3)' }} />
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, delay: 0.04 * i, ease: [0.22, 0.61, 0.36, 1] }}
                  style={{
                    position: 'absolute', top: 0, bottom: 0, borderRadius: 999,
                    background: neg ? STRESS : RECOVER,
                    ...(neg ? { right: '50%' } : { left: '50%' }),
                  }} />
              </div>
              <span style={{ fontSize: 14, lineHeight: 1.25, ...(narrow ? { gridRow: 2, gridColumn: 2, textAlign: 'right' } : {}) }}>
                <span style={{ color: neg ? STRESS : RECOVER, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{fmt(r.next_day)} ms</span>
                <span style={{ display: 'block', fontSize: 12, color: QUIET }}>{r.n} days</span>
              </span>
            </div>
          )
        })}
      </div>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>"{takeaway}"</p>
      {restLine && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>{restLine}</p>}
      <p style={{ fontSize: 12, color: QUIET, lineHeight: 1.5, margin: 0 }}>{data.note}</p>
    </div>
  )
}
