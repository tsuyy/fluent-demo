import { ResponsiveBar } from '@nivo/bar'
import { CHART_THEME } from '../../data/chartTheme'


const MONTHLY_STEPS = [
  { month: 'Jan', steps: 6300, highlight: false },
  { month: 'Feb', steps: 5700, highlight: 'low'  },
  { month: 'Mar', steps: 7400, highlight: false },
  { month: 'Apr', steps: 8100, highlight: false },
  { month: 'May', steps: 8600, highlight: false },
  { month: 'Jun', steps: 8900, highlight: false },
  { month: 'Jul', steps: 8500, highlight: false },
  { month: 'Aug', steps: 8300, highlight: false },
  { month: 'Sep', steps: 9100, highlight: false },
  { month: 'Oct', steps: 10400, highlight: 'high' },
  { month: 'Nov', steps: 8600, highlight: false },
  { month: 'Dec', steps: 7300, highlight: false },
]

export default function SeasonalStepsChart({ height = 160 }) {
  return (
    <div style={{ height }}>
      <ResponsiveBar
        data={MONTHLY_STEPS}
        keys={['steps']}
        indexBy="month"
        margin={{ top: 8, right: 8, bottom: 32, left: 44 }}
        padding={0.3}
        colors={({ data }) => {
          if (data.highlight === 'high') return '#0681fc'
          if (data.highlight === 'low')  return '#888780'
          return 'rgba(255,255,255,0.2)'
        }}
        borderRadius={2}
        theme={CHART_THEME}
        axisLeft={{
          tickSize: 0,
          tickPadding: 6,
          tickValues: [4000, 6000, 8000, 10000],
          format: v => `${(v/1000).toFixed(0)}k`,
        }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 6,
        }}
        enableLabel={false}
        enableGridX={false}
        gridYValues={[4000, 6000, 8000, 10000]}
        tooltip={({ data, value }) => (
          <div style={{
            background: 'rgba(15,15,14,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, padding: '6px 10px',
            fontSize: 11, color: '#fff',
          }}>
            {data.month}: {value.toLocaleString()} steps/day
            {data.highlight === 'high' && (
              <span style={{ color: '#0681fc', marginLeft: 6 }}>← most active</span>
            )}
            {data.highlight === 'low' && (
              <span style={{ color: '#888780', marginLeft: 6 }}>← quietest</span>
            )}
          </div>
        )}
        animate
        motionConfig="gentle"
      />
    </div>
  )
}