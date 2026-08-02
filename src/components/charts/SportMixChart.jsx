import { ResponsiveStream } from '@nivo/stream'
import { CHART_THEME } from '../../data/chartTheme'


// Hours per sport per year
const SPORT_MIX_DATA = [
  { cycling: 280, running: 0,   tennis: 0,  strength: 40, skiing: 20, other: 60  },
  { cycling: 320, running: 30,  tennis: 0,  strength: 50, skiing: 25, other: 55  },
  { cycling: 260, running: 90,  tennis: 0,  strength: 60, skiing: 30, other: 50  },
  { cycling: 200, running: 140, tennis: 35, strength: 70, skiing: 35, other: 45  },
  { cycling: 180, running: 110, tennis: 50, strength: 75, skiing: 20, other: 40  },
]

const KEYS = ['cycling', 'running', 'tennis', 'strength', 'skiing', 'other']

const COLORS = {
  cycling:  'rgba(6,129,252,0.6)',
  running:  'rgba(100,160,255,0.6)',
  tennis:   'rgba(39,196,138,0.7)',
  strength: 'rgba(160,130,255,0.6)',
  skiing:   'rgba(232,80,74,0.5)',
  other:    'rgba(136,135,128,0.4)',
}

export default function SportMixChart({ height = 160 }) {
  return (
    <div style={{ height }}>
      <ResponsiveStream
        data={SPORT_MIX_DATA}
        keys={KEYS}
        margin={{ top: 8, right: 100, bottom: 32, left: 8 }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
          format: i => ['2022','2023','2024','2025','2026'][i] || '',
        }}
        axisLeft={null}
        curve="cardinal"
        offsetType="expand"
        colors={({ id }) => COLORS[id]}
        fillOpacity={0.85}
        borderWidth={0}
        enableGridX={false}
        enableGridY={false}
        theme={CHART_THEME}
        legends={[{
          anchor: 'right',
          direction: 'column',
          itemWidth: 88,
          itemHeight: 18,
          itemTextColor: 'rgba(255,255,255,0.3)',
          symbolSize: 8,
          symbolShape: 'circle',
          translateX: 98,
          data: KEYS.map(k => ({
            id: k, label: k,
            color: COLORS[k],
          })),
        }]}
        tooltip={({ layer }) => (
          <div style={{
            background: 'rgba(15,15,14,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, padding: '6px 10px',
            fontSize: 11, color: '#fff',
          }}>
            {layer.id}
          </div>
        )}
      />
    </div>
  )
}
