import { motion } from 'framer-motion'
import { Scene, Beat, useScene } from '../../Scene'
import { useIsNarrow } from '../../useIsNarrow'
import { Lead, Line, CountUp, PulseDot, ScrollCue } from '../../primitives'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'

// Vertical stat row — number and label on the same line
function StatRow({ display, label, value, countAt, beat, reduced, narrow }) {
  const counts = typeof value === 'number' && countAt != null && !reduced
  return (
    <div style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: narrow ? 10 : 14,
    }}>
      <span style={{
        fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
        fontSize: narrow ? 32 : 42,
        fontWeight: 500,
        letterSpacing: '-0.04em',
        lineHeight: 1.1,
        color: TEXT,
        fontVariantNumeric: 'tabular-nums',
        minWidth: narrow ? 160 : 220,
      }}>
        {counts
          ? <CountUp from={0} to={value} active={beat >= countAt} duration={2000} />
          : display}
      </span>
      <span style={{
        fontSize: narrow ? 13 : 15,
        color: QUIET,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </div>
  )
}

export default function Scene01Opening({ beat, isActive, story }) {
  const narrow  = useIsNarrow()
  const { reduced } = useScene()

  return (
    <Scene layout="text" beat={beat} isActive={isActive} label="The beginning" align="left" maxWidth={680}>

      {/* Date — large, prominent, first thing */}
      <Beat at={0}>
        <p style={{
          fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
          fontSize: narrow ? 28 : 38,
          fontWeight: 400,
          letterSpacing: '-0.02em',
          color: TEXT,
          margin: 0,
        }}>You started tracking on<br />
          {story.startDate}
        </p>
      </Beat>

      {/* Heartbeat dot */}
      <Beat at={0} delay={0.5} style={{ padding: '4px 0' }}>
        <PulseDot size={12} />
      </Beat>

      {/* Stats — stacked vertically, 400ms stagger */}
      <Beat at={1}>
        <div style={{ display: 'grid', gap: narrow ? 14 : 18 }}>
          <StatRow
            display={story.heartbeats.toLocaleString()}
            value={story.heartbeats}
            countAt={1}
            label="heartbeats recorded"
            beat={beat} reduced={reduced} narrow={narrow}
          />
          <Beat at={2}>
            <StatRow
              display={story.workouts.toLocaleString()}
              label="workouts logged"
              beat={beat} reduced={reduced} narrow={narrow}
            />
          </Beat>
          <Beat at={3}>
            <StatRow
              display={story.sleepHours}
              label="hr of sleep data"
              beat={beat} reduced={reduced} narrow={narrow}
            />
          </Beat>
        </div>
      </Beat>

      {/* Closing line */}
      <Beat at={4} style={{ paddingTop: narrow ? 8 : 16 }}>
        <Line tone="secondary" style={{ fontSize: narrow ? 17 : 20 }}>
          Here's what Fluent sees.
        </Line>
      </Beat>

      <ScrollCue visible={isActive && beat < 1} />
    </Scene>
  )
}