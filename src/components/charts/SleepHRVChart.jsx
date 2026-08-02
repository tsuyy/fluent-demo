import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { CHART_THEME } from '../../data/chartTheme'


// Each night: sleep efficiency % (x) vs next-morning HRV (y)
// Mismatch nights: sleep looks fine (high efficiency) but HRV low
const SLEEP_HRV_DATA = [
  // Quadrant labels: 
  // Top-right = Restorative (high efficiency + high HRV)
  // Bottom-right = Less restorative than it looks (high efficiency + low HRV) ← mismatch
  // Top-left = More resilient than it looks
  // Bottom-left = Recovery needed
  {
    id: 'Normal nights',
    color: 'rgba(255,255,255,0.4)',
    data: [
      { x: 88, y: 41.2 },
      { x: 91, y: 42.8 },
      { x: 86, y: 38.4 },
      { x: 90, y: 40.1 },
      { x: 87, y: 39.8 },
      { x: 92, y: 43.2 },
      { x: 85, y: 37.9 },
      { x: 89, y: 41.8 },
      { x: 88, y: 40.4 },
      { x: 93, y: 44.1 },
      { x: 84, y: 36.8 },
      { x: 90, y: 42.0 },
    ],
  },
  {
    id: 'Mismatch nights',
    color: '#E8504A',
    data: [
      // Sleep looked fine — HRV says otherwise
      { x: 89, y: 29.8, label: 'Feb 13' },
      { x: 87, y: 31.2, label: 'Feb 14' },
      { x: 91, y: 30.4, label: 'Nov 8'  },
      { x: 88, y: 28.9, label: 'Dec 2'  },
    ],
  },
]

const BASELINE_EFFICIENCY = 87
const BASELINE_HRV = 37.2

export default function SleepHRVChart({ height = 180 }) {
  return (
    <div style={{ height, position: 'relative' }}>

      {/* Quadrant labels */}
      <div style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', zIndex: 1,
        // Adjust for chart margins
        left: 44, right: 12, top: 8, bottom: 36,
      }}>
        {/* Top right — Restorative */}
        <span style={{
          position: 'absolute', top: 4, right: 4,
          fontSize: 9, color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.03em',
        }}>
          Restorative
        </span>
        {/* Bottom right — Less restorative */}
        <span style={{
          position: 'absolute', bottom: 4, right: 4,
          fontSize: 9, color: 'rgba(232,80,74,0.4)',
          letterSpacing: '0.03em',
        }}>
          Less restorative than it looks
        </span>
        {/* Top left */}
        <span style={{
          position: 'absolute', top: 4, left: 4,
          fontSize: 9, color: 'rgba(255,255,255,0.15)',
          letterSpacing: '0.03em',
        }}>
          More resilient
        </span>
      </div>

      <ResponsiveScatterPlot
        data={SLEEP_HRV_DATA}
        margin={{ top: 8, right: 12, bottom: 36, left: 44 }}
        xScale={{ type: 'linear', min: 78, max: 98 }}
        yScale={{ type: 'linear', min: 24, max: 48 }}
        nodeSize={7}
        colors={({ serieId }) =>
          serieId === 'Mismatch nights'
            ? '#E8504A'
            : 'rgba(255,255,255,0.3)'
        }
        theme={CHART_THEME}
        axisLeft={{
          tickSize: 0,
          tickPadding: 6,
          tickValues: [28, 34, 40, 46],
          legend: 'Next-day HRV (ms)',
          legendPosition: 'middle',
          legendOffset: -38,
          legendTextStyle: {
            fill: 'rgba(255,255,255,0.2)',
            fontSize: 9,
          },
        }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 6,
          tickValues: [80, 85, 90, 95],
          legend: 'Sleep efficiency %',
          legendPosition: 'middle',
          legendOffset: 28,
          legendTextStyle: {
            fill: 'rgba(255,255,255,0.2)',
            fontSize: 9,
          },
        }}
        markers={[
          {
            axis: 'x',
            value: BASELINE_EFFICIENCY,
            lineStyle: {
              stroke: 'rgba(255,255,255,0.12)',
              strokeWidth: 1,
            },
          },
          {
            axis: 'y',
            value: BASELINE_HRV,
            lineStyle: {
              stroke: 'rgba(255,255,255,0.12)',
              strokeWidth: 1,
            },
          },
        ]}
        tooltip={({ node }) => (
          <div style={{
            background: 'rgba(15,15,14,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, padding: '6px 10px',
            fontSize: 11, color: '#fff',
          }}>
            {node.serieId === 'Mismatch nights' && (
              <div style={{ color: '#E8504A', marginBottom: 2 }}>
                ← mismatch
              </div>
            )}
            Sleep: {node.data.x}% · HRV: {node.data.y}ms
          </div>
        )}
        legends={[{
          anchor: 'bottom-right',
          direction: 'column',
          itemWidth: 120,
          itemHeight: 14,
          itemTextColor: 'rgba(255,255,255,0.3)',
          symbolSize: 6,
          symbolShape: 'circle',
          translateY: -4,
        }]}
        animate={false}
      />
    </div>
  )
}