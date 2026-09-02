import { useIsNarrow } from '../scrolly/useIsNarrow'

const QUIET = 'var(--color-quiet, #888780)'
const GOOD  = '#27C48A'
const BAD   = '#E8504A'

/**
 * CurrentSnapshotCards — small metric row shown before the five
 * felt-state buttons on SomethingDifferentScreen.
 *
 * Framing: "+16% above your 90-day avg" rather than just a raw delta
 * ("+8.0ms") — the percentage-vs-baseline framing tells you whether
 * a number is actually notable without needing to already know what
 * a normal HRV/RHR/etc value looks like for this person. Falls back
 * to computing the percentage from value+deviation if a real
 * deviation_pct/pct isn't provided (Jamie/Robert's synthetic data).
 *
 * Renders however many metrics are passed — no hardcoded "always 4."
 */
export default function CurrentSnapshotCards({ metrics }) {
  const narrow = useIsNarrow()
  if (!metrics?.length) return null

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: narrow ? '1fr 1fr' : `repeat(${Math.min(metrics.length, 4)}, 1fr)`,
      gap: 10,
      marginBottom: 28,
    }}>
      {metrics.map(m => {
        const value = m.value_7d ?? m.value
        const isGood = m.is_good ?? m.isGood
        const baseline = m.baseline_90d ?? m.baseline

        // Prefer a real deviation_pct/pct if given; otherwise derive
        // it from value/deviation (baseline = value - deviation).
        let pct = m.deviation_pct ?? m.pct
        if (pct == null && baseline) {
          pct = ((value - baseline) / baseline) * 100
        } else if (pct == null && m.deviation != null && baseline == null) {
          // No baseline given either (older synthetic entries) — can't
          // derive a percentage, fall back to just the raw delta below.
          pct = null
        }

        const direction = m.direction ?? (m.deviation > 0 ? 'up' : m.deviation < 0 ? 'down' : 'flat')
        const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→'
        const pctLabel = pct != null
          ? `${pct > 0 ? '+' : ''}${pct.toFixed(0)}% 90-day avg`
          : (m.display_dev ?? m.displayDev)

        return (
          <div key={m.label} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '12px 14px',
          }}>
            <p style={{ fontSize: 10, color: QUIET, marginBottom: 6, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
              {m.label}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 20, fontWeight: 700 }}>{value}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{m.unit}</span>
            </div>
            <p style={{ fontSize: 11, color: isGood ? GOOD : BAD, margin: 0, lineHeight: 1.4 }}>
              {arrow} {pctLabel}
            </p>
          </div>
        )
      })}
    </div>
  )
}