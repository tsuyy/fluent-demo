import { motion } from 'framer-motion'
import robert from '../../data/robert/robert_data.json'

const QUIET = 'var(--color-quiet, #A3A29A)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'
const BLUE  = '#0681fc'
const GREY  = 'rgba(255,255,255,0.4)'

const fmtInt = (n) => n.toLocaleString('en-US')

/**
 * StructureCompareBars — Robert's structured weeks (golf, plans) vs
 * unstructured weeks (open calendar), three measures side by side.
 * Source: robert_data.json → structureDependency.
 */
export default function StructureCompareBars() {
  const s = robert.structureDependency?.structured
  const u = robert.structureDependency?.unstructured
  if (!s || !u) return null

  const rows = [
    { key: 'steps', label: 'Steps per day', s: s.steps, u: u.steps, fmt: fmtInt, diff: `${s.steps - u.steps >= 0 ? '+' : '−'}${fmtInt(Math.abs(s.steps - u.steps))} steps` },
    { key: 'hrv', label: 'HRV', s: s.hrv, u: u.hrv, fmt: (v) => `${v} ms`, diff: `${s.hrv - u.hrv >= 0 ? '+' : '−'}${Math.abs(s.hrv - u.hrv).toFixed(1)} ms` },
    { key: 'rhr', label: 'Resting heart rate', s: s.rhr, u: u.rhr, fmt: (v) => `${v} bpm`, diff: `${s.rhr - u.rhr >= 0 ? '+' : '−'}${Math.abs(s.rhr - u.rhr).toFixed(1)} bpm` },
  ]

  const takeaway =
    `Weeks with plans (golf, social commitments) average ${fmtInt(s.steps - u.steps)} more steps a day, ` +
    `${(s.hrv - u.hrv).toFixed(1)} ms higher HRV and a resting heart rate ${(u.rhr - s.rhr).toFixed(1)} bpm lower than weeks with an open calendar.`

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 14, height: 10, borderRadius: 2, background: BLUE }} />
          <span style={{ fontSize: 13, color: QUIET }}>{s.label} ({s.n} weeks)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 14, height: 10, borderRadius: 2, background: GREY }} />
          <span style={{ fontSize: 13, color: QUIET }}>{u.label} ({u.n} weeks)</span>
        </div>
      </div>

      {rows.map((r, i) => {
        const max = Math.max(r.s, r.u)
        return (
          <div key={r.key} style={{ display: 'grid', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 15, color: TEXT }}>{r.label}</span>
              <span style={{ fontSize: 13, color: QUIET }}>structured vs unstructured: {r.diff}</span>
            </div>
            {[['s', BLUE, r.s], ['u', GREY, r.u]].map(([k, col, v], j) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 84px', alignItems: 'center', gap: 12 }}>
                <div style={{ height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 999, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${(v / max) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.1 * i + 0.05 * j, ease: [0.22, 0.61, 0.36, 1] }}
                    style={{ height: '100%', background: col, borderRadius: 999 }} />
                </div>
                <span style={{ fontSize: 14, color: TEXT, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{r.fmt(v)}</span>
              </div>
            ))}
          </div>
        )
      })}

      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>"{takeaway}"</p>
      <p style={{ fontSize: 12, color: QUIET, lineHeight: 1.5, margin: 0 }}>
        Bars start at zero, so small differences look small; read the numbers. Weeks aren't assigned at random: Robert may plan more when he already feels well, so this shows a link, not a cause.
      </p>
    </div>
  )
}
