import { Scene, Beat } from '../../Scene'
import { useIsNarrow } from '../../useIsNarrow'

const TEXT      = 'var(--color-text, rgba(255,255,255,0.92))'
const SECONDARY = 'var(--color-text-secondary, rgba(255,255,255,0.62))'
const QUIET     = 'var(--color-quiet, #888780)'

export default function Scene07CannotSee({ beat, isActive }) {
  const narrow = useIsNarrow()

  return (
    <Scene
      layout="text"
      beat={beat}
      isActive={isActive}
      label="What the data can't see"
      align="left"
      maxWidth={620}
    >
      <Beat at={0}>
        <p style={{
          fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
          fontSize: 'clamp(16px, 1.8vw, 22px)',
          fontWeight: 400,
          lineHeight: 1.75,
          letterSpacing: '-0.01em',
          color: TEXT,
          margin: 0,
        }}>
          The data captures a lot.
        </p>
      </Beat>

      <Beat at={1}>
        <p style={{
          fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
          fontSize: 'clamp(16px, 1.8vw, 22px)',
          fontWeight: 400,
          lineHeight: 1.75,
          letterSpacing: '-0.01em',
          color: SECONDARY,
          margin: 0,
        }}>
          It doesn't capture what it felt like to finish 13.1 miles.
          Or why you kept going back to skiing despite what it costs.
          Or what was happening in your life during the periods where everything in the data shifted at once.
        </p>
      </Beat>

      <Beat at={2}>
        <p style={{
          fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
          fontSize: 'clamp(15px, 1.6vw, 19px)',
          fontWeight: 400,
          lineHeight: 1.75,
          color: QUIET,
          margin: 0,
          fontStyle: 'italic',
        }}>
          The sensor is always on. The meaning is always yours.
        </p>
      </Beat>
    </Scene>
  )
}