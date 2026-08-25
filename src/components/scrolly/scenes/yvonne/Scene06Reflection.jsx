import { motion } from 'framer-motion'
import { Scene, Beat, useScene } from '../../Scene'
import { useIsNarrow } from '../../useIsNarrow'

const TEXT      = 'var(--color-text, rgba(255,255,255,0.92))'
const SECONDARY = 'var(--color-text-secondary, rgba(255,255,255,0.62))'
const QUIET     = 'var(--color-quiet, #888780)'

// Each insight has its own beat so pauses between them come from
// the scroll track length, not timeouts.
// Beat 0 — opening line
// Beat 1 — insight 1 (recovery)
// Beat 2 — insight 2 (cardiovascular arc)
// Beat 3 — insight 3 (cost vs value)
// Beat 4 — closing line (data can't decide)

function Insight({ children, beat: beatAt, tone = 'primary' }) {
  const { beat, reduced } = useScene()
  const color = tone === 'secondary' ? SECONDARY : tone === 'quiet' ? QUIET : TEXT

  return (
    <motion.p
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      animate={{ opacity: beat >= beatAt ? 1 : 0, y: beat >= beatAt ? 0 : 12 }}
      transition={{ duration: reduced ? 0 : 0.8, ease: [0.22, 0.61, 0.36, 1] }}
      style={{
        margin: 0,
        fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
        fontSize: 'clamp(17px, 2vw, 24px)',
        fontWeight: 400,
        lineHeight: 1.55,
        letterSpacing: '-0.01em',
        color,
        maxWidth: 640,
      }}
    >
      {children}
    </motion.p>
  )
}

export default function Scene06Reflection({ beat, isActive }) {
  const narrow = useIsNarrow()

  return (
    <Scene
      layout="text"
      beat={beat}
      isActive={isActive}
      label="What stands out"
      align="left"
      maxWidth={680}
    >
      <Beat at={0}>
        <p style={{
          fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
          fontSize: 'clamp(20px, 2.5vw, 30px)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: TEXT,
          margin: 0,
        }}>
          After four years, a few things are hard to ignore.
        </p>
      </Beat>

      <Beat at={1}>
        <Insight beat={1}>
          You recover differently from different kinds of activity.
          Tennis gives back. Skiing costs.{' '}
          <span style={{ color: SECONDARY }}>You do both anyway.</span>
        </Insight>
      </Beat>

      <Beat at={2}>
        <Insight beat={2}>
          Your cardiovascular trajectory has changed in ways that aren't obvious day to day.{' '}
          <span style={{ color: SECONDARY }}>
            You had to look at four years to see it.
          </span>
        </Insight>
      </Beat>

      <Beat at={3}>
        <Insight beat={3}>
          Some of the things that cost your body the most are also the ones you value most.
        </Insight>
      </Beat>

      <Beat at={4}>
        <Insight beat={4} tone="secondary">
          The data can show the tradeoffs. It can't decide which ones are worth making.
        </Insight>
      </Beat>
    </Scene>
  )
}