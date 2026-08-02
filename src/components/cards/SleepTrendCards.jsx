import { motion } from 'framer-motion'

const TREND_DATA = {
  yvonne: [
    { stage: 'Deep Sleep',  current: 59, prev: 47, unit: 'min', dir: 'up',   note: 'Physical repair — improving' },
    { stage: 'REM Sleep',   current: 91, prev: 79, unit: 'min', dir: 'up',   note: 'Cognitive recovery — improving' },
    { stage: 'Awake Time',  current: 31, prev: 43, unit: 'min', dir: 'down', note: 'Sleep continuity — improving' },
    { stage: 'Efficiency',  current: 92, prev: 87, unit: '%',   dir: 'up',   note: 'Time in bed well used' },
  ],
  jamie: [
    { stage: 'Deep Sleep',  current: 49, prev: 44, unit: 'min', dir: 'up',   note: 'Gradually improving' },
    { stage: 'REM Sleep',   current: 78, prev: 74, unit: 'min', dir: 'up',   note: 'Stable' },
    { stage: 'Awake Time',  current: 32, prev: 38, unit: 'min', dir: 'down', note: 'Improving' },
    { stage: 'Efficiency',  current: 88, prev: 85, unit: '%',   dir: 'up',   note: 'Above 85% threshold' },
  ],
  robert: [
    { stage: 'Deep Sleep',  current: 53, prev: 48, unit: 'min', dir: 'up',   note: 'Better since retirement' },
    { stage: 'REM Sleep',   current: 71, prev: 68, unit: 'min', dir: 'up',   note: 'Consistent' },
    { stage: 'Awake Time',  current: 26, prev: 42, unit: 'min', dir: 'down', note: 'Significantly improved' },
    { stage: 'Efficiency',  current: 88, prev: 82, unit: '%',   dir: 'up',   note: 'Retirement improved sleep' },
  ],
}

export default function SleepTrendCards({ persona = 'yvonne' }) {
  const data = TREND_DATA[persona] || TREND_DATA.yvonne

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
    }}>
      {data.map((item, i) => {
        const improved = item.dir === 'up'
          ? item.current > item.prev
          : item.current < item.prev
        const arrow = item.dir === 'up' ? '↑' : '↓'
        const diff = Math.abs(item.current - item.prev)

        return (
          <motion.div
            key={item.stage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 10, padding: '14px 12px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              {item.stage}
            </p>
            <p style={{
              fontSize: 22, fontWeight: 700,
              lineHeight: 1, marginBottom: 4,
            }}>
              {item.current}
              <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 2 }}>
                {item.unit}
              </span>
            </p>
            <p style={{
              fontSize: 11,
              color: improved ? '#27C48A' : '#E8504A',
              marginBottom: 4,
            }}>
              {arrow} {diff}{item.unit} vs last quarter
            </p>
            <p style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.25)',
              lineHeight: 1.4,
            }}>
              {item.note}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}