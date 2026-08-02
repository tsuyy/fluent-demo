import { motion } from 'framer-motion'

const QQRT_DATA = {
  yvonne: {
    quantity:   { value: '7.1 hr', label: 'avg/night', direction: '→', note: 'consistent' },
    quality:    { value: '92%',    label: 'efficiency', direction: '↑', note: 'strong'     },
    regularity: { value: '±34m',   label: 'bedtime variance', direction: '↓', note: 'improving' },
    timing:     { value: '6:30am', label: 'avg wake time', direction: '→', note: 'stable'  },
  },
  jamie: {
    quantity:   { value: '7.1 hr', label: 'avg/night', direction: '→', note: 'consistent' },
    quality:    { value: '88%',    label: 'efficiency', direction: '→', note: 'good'       },
    regularity: { value: '±48m',   label: 'bedtime variance', direction: '→', note: 'variable' },
    timing:     { value: '7:00am', label: 'avg wake time', direction: '→', note: 'stable'  },
  },
  robert: {
    quantity:   { value: '7.0 hr', label: 'avg/night', direction: '↑', note: 'improved since retirement' },
    quality:    { value: '88%',    label: 'efficiency', direction: '→', note: 'good'       },
    regularity: { value: '±28m',   label: 'bedtime variance', direction: '→', note: 'stable'    },
    timing:     { value: '6:45am', label: 'avg wake time', direction: '→', note: 'stable'  },
  },
}

const PILLARS = [
  { key: 'quantity',   label: 'Quantity',   desc: 'How much'   },
  { key: 'quality',    label: 'Quality',    desc: 'How well'   },
  { key: 'regularity', label: 'Regularity', desc: 'How consistent' },
  { key: 'timing',     label: 'Timing',     desc: 'When'       },
]

const DIR_COLOR = {
  '↑': '#27C48A',
  '↓': '#27C48A',  // down is good for variance
  '→': 'rgba(255,255,255,0.4)',
}

export default function QQRTCard({ persona = 'yvonne' }) {
  const data = QQRT_DATA[persona] || QQRT_DATA.yvonne

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
    }}>
      {PILLARS.map((pillar, i) => {
        const d = data[pillar.key]
        return (
          <motion.div
            key={pillar.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 10,
              padding: '14px 12px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              {pillar.label}
            </p>
            <p style={{
              fontSize: 20, fontWeight: 700,
              lineHeight: 1, marginBottom: 4,
            }}>
              {d.value}
              <span style={{
                fontSize: 14,
                color: DIR_COLOR[d.direction],
                marginLeft: 4,
              }}>
                {d.direction}
              </span>
            </p>
            <p style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.3)',
              lineHeight: 1.4,
            }}>
              {d.label}
            </p>
            <p style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.25)',
              marginTop: 4,
            }}>
              {d.note}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}
