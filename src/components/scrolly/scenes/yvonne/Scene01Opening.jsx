import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useIsNarrow } from '../../Scene'
import { Lead, Line, BigNumber } from '../../primitives'

/**
 * Live-incrementing heartbeat counter — ticks up roughly once a
 * second, cosmetically, for as long as this component is mounted.
 */
function LiveHeartbeatCounter({ startValue }) {
  const [count, setCount] = useState(startValue)
  useEffect(() => {
    const interval = setInterval(() => setCount(c => c + 1), 850)
    return () => clearInterval(interval)
  }, [])
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{count.toLocaleString()}</span>
}

/**
 * Scene 1 — Opening. Both columns now share the same structural
 * rhythm (Lead caption above, big content below) so their content
 * lines up left-to-right instead of the previous mismatched order
 * (caption-then-date on the left, number-then-caption on the right).
 * Combined with PuddingScene's text-step height fix, this should
 * read as genuinely parallel rather than just visually close.
 *
 * Scene-navigation button grid removed — redundant with
 * SceneIndicator, which already does the same job.
 */
export default function Scene01Opening({ story }) {
  const narrow = useIsNarrow()

  const stats = [
    { label: 'heartbeats recorded', node: <LiveHeartbeatCounter startValue={story.heartbeats} /> },
    { label: 'workouts logged', node: story.workouts.toLocaleString() },
    { label: 'hr of sleep data', node: story.sleepHours },
  ]

  return (
    <div style={{ display: narrow ? 'block' : 'flex', width: '100%' }}>
      <div style={{
        flex: narrow ? undefined : '0 0 45%',
        position: narrow ? 'static' : 'sticky', top: 0,
        height: narrow ? 'auto' : '100vh',
        display: 'flex', alignItems: 'center',
        padding: narrow ? '40px 32px' : '0 32px',
      }}>
        <div>
          <Lead>You started tracking on</Lead>
          <div style={{ marginTop: 16 }}>
            <BigNumber>{story.startDate}</BigNumber>
          </div>
        </div>
      </div>

      <div style={{ flex: narrow ? undefined : '0 0 55%', padding: '0 32px' }}>
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
          >
            <div>
              <div style={{ marginTop: 16 }}>
                <BigNumber>{stat.node}</BigNumber>
              </div>
                <Lead>{stat.label}</Lead>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}