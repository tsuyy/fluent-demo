import { motion, AnimatePresence } from 'framer-motion'
import { Scene, Beat, useScene } from '../../Scene'
import { useIsNarrow } from '../../useIsNarrow'

const TEXT      = 'var(--color-text, rgba(255,255,255,0.92))'
const SECONDARY = 'var(--color-text-secondary, rgba(255,255,255,0.62))'
const QUIET     = 'var(--color-quiet, #888780)'
const ACCENT    = 'var(--color-accent, #0681fc)'

export default function Scene08Closing({ beat, isActive, onComplete, onRestart }) {
  const narrow      = useIsNarrow()
  const { reduced } = useScene()

  return (
    <Scene
      layout="text"
      beat={beat}
      isActive={isActive}
      label="What's yours"
      align="left"
      maxWidth={620}
    >
      {/* Main copy — largest type, slowest reveal */}
      <Beat at={0}>
        <p style={{
          fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
          fontSize: narrow ? 18 : 'clamp(18px, 2.2vw, 28px)',
          fontWeight: 400,
          lineHeight: 1.75,
          letterSpacing: '-0.015em',
          color: TEXT,
          margin: 0,
        }}>
          Four years of data can't tell you what kind of life you should live.
        </p>
      </Beat>

      <Beat at={1}>
        <p style={{
          fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
          fontSize: narrow ? 17 : 'clamp(17px, 2vw, 25px)',
          fontWeight: 400,
          lineHeight: 1.75,
          letterSpacing: '-0.01em',
          color: SECONDARY,
          margin: 0,
        }}>
          But it can help you notice what's changing.
          It can show you what your body responds to.
          It can give you context you may not have noticed day to day.
          And sometimes, seeing the pattern is enough to ask a better question.
        </p>
      </Beat>

      {/* Coda — smaller, slower */}
      <Beat at={2} delay={0.6}>
        <p style={{
          fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
          fontSize: narrow ? 14 : 16,
          fontWeight: 400,
          lineHeight: 1.7,
          color: QUIET,
          fontStyle: 'italic',
          margin: 0,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 20,
          maxWidth: 480,
        }}>
          The data is yours. The story is still being written.
        </p>
      </Beat>

      {/* CTAs — very gentle appearance at beat 3 */}
      <Beat at={3} delay={0.8}>
        <div style={{
          display: 'flex',
          flexDirection: narrow ? 'column' : 'row',
          gap: 16,
          alignItems: narrow ? 'flex-start' : 'center',
          paddingTop: 8,
        }}>
          {/* Primary CTA */}
          <motion.button
            whileHover={{ opacity: 0.85 }}
            onClick={onComplete}
            style={{
              background: 'transparent',
              border: `1px solid ${ACCENT}`,
              borderRadius: 8,
              padding: '11px 22px',
              color: ACCENT,
              fontSize: 14,
              fontFamily: 'inherit',
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}
          >
            Explore your data →
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            whileHover={{ opacity: 0.7 }}
            onClick={onRestart}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '11px 0',
              color: QUIET,
              fontSize: 13,
              fontFamily: 'inherit',
              cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}
          >
            Start over ↺
          </motion.button>
        </div>
      </Beat>
    </Scene>
  )
}