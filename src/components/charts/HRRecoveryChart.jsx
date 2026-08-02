import { ResponsiveBar } from '@nivo/bar'
import { CHART_THEME } from '../../data/chartTheme'


const HR_RECOVERY_DATA = [
  { sport: 'Strength', hrr1: 31.3, hrr2: 36.1 },
  { sport: 'Running',  hrr1: 29.1, hrr2: 42.9 },
  { sport: 'Tennis',   hrr1: 28.5, hrr2: 31.4 },
  { sport: 'Cycling',  hrr1: 24.8, hrr2: 30.6 },
  { sport: 'Skiing',   hrr1: 20.1, hrr2: 26.8 },
]

export default function HRRecoveryChart({ height = 200 }) {
  return (
    <div style={{ height }}>
      <ResponsiveBar
        data={HR_RECOVERY_DATA}
        keys={['hrr1', 'hrr2']}
        indexBy="sport"
        groupMode="grouped"
        margin={{ top: 8, right: 80, bottom: 36, left: 40 }}
        padding={0.3}
        innerPadding={3}
        colors={['rgba(39,196,138,0.7)', 'rgba(39,196,138,0.35)']}
        borderRadius={2}
        theme={CHART_THEME}
        axisLeft={{
          tickSize: 0,
          tickPadding: 6,
          tickValues: [0, 10, 20, 30, 40],
          legend: 'bpm drop',
          legendPosition: 'middle',
          legendOffset: -32,
        }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 6,
        }}
        enableLabel={false}
        enableGridX={false}
        gridYValues={[0, 10, 20, 30, 40]}
        legends={[{
          dataFrom: 'keys',
          anchor: 'right',
          direction: 'column',
          itemWidth: 70,
          itemHeight: 18,
          itemTextColor: 'rgba(255,255,255,0.3)',
          symbolSize: 8,
          symbolShape: 'circle',
          translateX: 78,
          data: [
            { id: 'hrr1', label: '60 sec', color: 'rgba(39,196,138,0.7)' },
            { id: 'hrr2', label: '90 sec', color: 'rgba(39,196,138,0.35)' },
          ],
        }]}
        tooltip={({ id, value, indexValue }) => (
          <div style={{
            background: 'rgba(15,15,14,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, padding: '6px 10px',
            fontSize: 11, color: '#fff',
          }}>
            <strong>{indexValue}</strong> · {id === 'hrr1' ? '60s' : '90s'}
            <br />
            <span style={{ color: '#27C48A' }}>
              −{value} bpm
            </span>
          </div>
        )}
        animate
        motionConfig="gentle"
      />
    </div>
  )
}