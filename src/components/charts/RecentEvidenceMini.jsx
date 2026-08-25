import { motion } from 'framer-motion'

const QUIET = 'var(--color-quiet, #888780)'

/**
 * Placeholder evidence chart — used wherever the spec calls for a
 * "current, last 14 days" chart and no such export exists yet.
 *
 * This renders honestly as "chart pending real data" rather than
 * fabricating plausible-looking recent biometric numbers. For a
 * project whose whole premise is real personal data, a placeholder
 * is more honest than a well-drawn guess.
 *
 * Swap this out once the corresponding data file exists — see the
 * `needsExport` prop for what file/shape is missing.
 */
export default function RecentEvidenceMini({ needsExport, height = 70 }) {
  return (
    <div style={{
      height, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 4,
      background: 'rgba(255,255,255,0.02)',
      border: '1px dashed rgba(255,255,255,0.1)',
      borderRadius: 8,
    }}>
      <span style={{ fontSize: 11, color: QUIET }}>Chart pending</span>
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)' }}>needs: {needsExport}</span>
    </div>
  )
}