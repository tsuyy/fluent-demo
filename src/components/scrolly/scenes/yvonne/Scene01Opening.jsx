import { Scene, Beat, useScene } from '../../Scene'
import { useIsNarrow } from '../../useIsNarrow'
import { Lead, Line, CountUp, PulseDot, ScrollCue } from '../../primitives'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT = 'var(--color-text, rgba(255,255,255,0.92))'

/* One stat = a figure and the thing it counts. */
function Stat({ display, label, value, countAt }) {
  const { beat, reduced } = useScene()
  const narrow = useIsNarrow()
  const counts = typeof value === 'number' && countAt != null && !reduced

  return (
    <div style={{ display: 'grid', gap: 2, justifyItems: 'center' }}>
      <span
        style={{
          fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
          fontSize: narrow ? 36 : 48,
          fontWeight: 500,
          letterSpacing: '-0.04em',
          lineHeight: 1.05,
          color: TEXT,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {counts ? <CountUp from={0} to={value} active={beat >= countAt} /> : display}
      </span>
      <span style={{ fontSize: narrow ? 13 : 14, color: QUIET, letterSpacing: '0.01em' }}>
        {label}
      </span>
    </div>
  )
}

export default function Scene01Opening({ beat, isActive, story }) {
  const narrow = useIsNarrow()

  return (
    <Scene layout="text" beat={beat} isActive={isActive} label="The beginning">
      <Beat at={0}>
        <Lead>On {story.startDate} you started tracking your health.</Lead>
      </Beat>

      <Beat at={0} delay={0.35} style={{ padding: '10px 0 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PulseDot size={14} />
        </div>
      </Beat>

      <div
        style={{
          display: 'flex',
          flexDirection: narrow ? 'column' : 'row',
          gap: narrow ? 22 : 56,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: narrow ? 6 : 12,
        }}
      >
        <Beat at={1}>
          <Stat
            value={story.heartbeats}
            display={story.heartbeats.toLocaleString()}
            countAt={1}
            label="heartbeats recorded"
          />
        </Beat>

        <Beat at={2}>
          <Stat
            display={story.workouts.toLocaleString()}
            label={`workouts — ${story.sportsWord} different sports`}
          />
        </Beat>

        <Beat at={3}>
          <Stat display={story.sleepYears} label="years of sleep data" />
        </Beat>
      </div>

      <Beat at={4} style={{ paddingTop: narrow ? 10 : 20 }}>
        <Line tone="secondary" style={{ fontSize: narrow ? 17 : 20 }}>
          Here's what Fluent sees.
        </Line>
      </Beat>

      <ScrollCue visible={isActive && beat < 1} />
    </Scene>
  )
}