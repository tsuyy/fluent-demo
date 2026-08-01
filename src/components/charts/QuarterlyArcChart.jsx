import { ResponsiveLine } from '@nivo/line'

// Real data from Yvonne's quarterly.json
const QUARTERLY_DATA = [
  { quarter: '2022 Q1', rhr: 62.8, hrv: 36.2 },
  { quarter: '2022 Q2', rhr: 62.1, hrv: 37.8 },
  { quarter: '2022 Q3', rhr: 63.4, hrv: 35.1 },
  { quarter: '2022 Q4', rhr: 65.8, hrv: 33.4 },
  { quarter: '2023 Q1', rhr: 64.2, hrv: 36.8 },
  { quarter: '2023 Q2', rhr: 61.8, hrv: 38.2 },
  { quarter: '2023 Q3', rhr: 60.4, hrv: 38.9 },
  { quarter: '2023 Q4', rhr: 62.1, hrv: 37.4 },
  { quarter: '2024 Q1', rhr: 63.8, hrv: 38.1 },
  { quarter: '2024 Q2', rhr: 61.2, hrv: 39.8 },
  { quarter: '2024 Q3', rhr: 60.8, hrv: 40.2 },
  { quarter: '2024 Q4', rhr: 59.4, hrv: 41.8 },
  { quarter: '2025 Q1', rhr: 60.2, hrv: 42.4 },
  { quarter: '2025 Q2', rhr: 58.8, hrv: 44.1 },
  { quarter: '2025 Q3', rhr: 57.9, hrv: 46.8 },
  { quarter: '2025 Q4', rhr: 58.4, hrv: 45.2 },
  { quarter: '2026 Q1', rhr: 57.2, hrv: 46.4 },
  { quarter: '2026 Q2', rhr: 55.8, hrv: 52.5 },
]

const ANNOTATIONS = [
  { quarter: '2022 Q4', label: 'Personal low' },
  { quarter: '2024 Q1', label: 'Running begins' },
  { quarter: '2026 Q2', label: 'Race day' },
]

export default function QuarterlyArcChart({ height = 320 }) {
  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={[
          {
            id: 'RHR',
            color: '#E8504A',
            data: QUARTERLY_DATA.map(d => ({
              x: d.quarter, y: d.rhr
            })),
          },
          {
            id: 'HRV',
            color: '#27C48A',
            data: QUARTERLY_DATA.map(d => ({
              x: d.quarter, y: d.hrv
            })),
          },
        ]}
        margin={{ top: 20, right: 24, bottom: 60, left: 40 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 30, max: 70, stacked: false }}
        curve="cardinal"
        colors={['#E8504A', '#27C48A']}
        lineWidth={2}
        pointSize={4}
        pointColor="#0F0F0E"
        pointBorderWidth={1.5}
        pointBorderColor={{ from: 'serieColor' }}
        enableGridX={false}
        enableGridY={true}
        gridYValues={[35, 45, 55, 65]}
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
          tickValues: [35, 45, 55, 65],
        }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
          tickRotation: -35,
          tickValues: QUARTERLY_DATA
            .filter((_, i) => i % 3 === 0)
            .map(d => d.quarter),
        }}
        theme={{
          axis: {
            ticks: {
              text: { fill: 'rgba(255,255,255,0.35)', fontSize: 9 },
            },
          },
          grid: {
            line: { stroke: 'rgba(255,255,255,0.05)' },
          },
          background: 'transparent',
        }}
        markers={ANNOTATIONS.map(a => ({
          axis: 'x',
          value: a.quarter,
          lineStyle: {
            stroke: 'rgba(255,255,255,0.15)',
            strokeWidth: 1,
            strokeDasharray: '3 3',
          },
          legend: a.label,
          legendPosition: 'top',
          textStyle: {
            fill: 'rgba(255,255,255,0.35)',
            fontSize: 9,
          },
        }))}
        tooltip={({ point }) => (
          <div style={{
            background: 'rgba(15,15,14,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, padding: '8px 12px',
            fontSize: 12, color: '#fff',
          }}>
            <strong>{point.data.x}</strong>
            <br />
            <span style={{ color: point.serieColor }}>
              {point.serieId}: {point.data.y}
              {point.serieId === 'RHR' ? ' bpm' : ' ms'}
            </span>
          </div>
        )}
        legends={[{
          anchor: 'bottom-right',
          direction: 'row',
          itemWidth: 60,
          itemHeight: 20,
          itemTextColor: 'rgba(255,255,255,0.4)',
          symbolSize: 8,
          symbolShape: 'circle',
        }]}
        animate
        motionConfig="gentle"
      />
    </div>
  )
}