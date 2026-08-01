import { ResponsiveLine } from '@nivo/line'

const RETIREMENT_DATA = [
  { x: 'Jun 23',  y: 63.2 },
  { x: 'Jul 23',  y: 62.8 },
  { x: 'Aug 23',  y: 65.4 }, // retirement month — rises
  { x: 'Sep 23',  y: 66.1 }, // adjustment peak
  { x: 'Oct 23',  y: 64.8 },
  { x: 'Nov 23',  y: 63.1 },
  { x: 'Dec 23',  y: 62.4 },
  { x: 'Jan 24',  y: 61.2 }, // golf routine begins
  { x: 'Feb 24',  y: 60.8 },
  { x: 'Mar 24',  y: 60.1 },
  { x: 'Apr 24',  y: 59.6 },
  { x: 'May 24',  y: 59.2 },
  { x: 'Jun 24',  y: 58.9 },
  { x: 'Jul 24',  y: 58.4 },
  { x: 'Aug 24',  y: 58.1 },
  { x: 'Sep 24',  y: 57.8 },
]

export default function RetirementArcChart({ height = 160 }) {
  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={[{
          id: 'RHR',
          color: '#27C48A',
          data: RETIREMENT_DATA,
        }]}
        margin={{ top: 16, right: 16, bottom: 32, left: 36 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 55, max: 69 }}
        curve="cardinal"
        colors={['#27C48A']}
        lineWidth={2}
        pointSize={3}
        pointColor="#0F0F0E"
        pointBorderWidth={1.5}
        pointBorderColor="#27C48A"
        enableGridX={false}
        enableGridY={false}
        axisLeft={{
          tickSize: 0,
          tickPadding: 6,
          tickValues: [58, 62, 66],
        }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 6,
          tickValues: ['Jun 23', 'Sep 23', 'Jan 24', 'May 24', 'Sep 24'],
        }}
        theme={{
          axis: {
            ticks: {
              text: { fill: 'rgba(255,255,255,0.3)', fontSize: 9 },
            },
          },
          background: 'transparent',
        }}
        useMesh={true}
        enableCrosshair={true}
        crosshairType="x"
        // For line charts, tooltip receives { point } not { node }:
        tooltip={({ point }) => (
        <div style={{
            background: 'rgba(15,15,14,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, padding: '6px 10px',
            fontSize: 11, color: '#fff',
        }}>
            <strong>{point.data.xFormatted}</strong>
            <br />
            <span style={{ color: point.serieColor }}>
            {point.data.yFormatted} {point.serieId === 'RHR' ? 'bpm' : 'ms'}
            </span>
        </div>
        )}
        markers={[
          {
            axis: 'x',
            value: 'Aug 23',
            lineStyle: {
              stroke: 'rgba(255,255,255,0.2)',
              strokeWidth: 1,
              strokeDasharray: '3 3',
            },
            legend: 'retired',
            legendPosition: 'top',
            textStyle: {
              fill: 'rgba(255,255,255,0.3)',
              fontSize: 9,
            },
          },
          {
            axis: 'y',
            value: 63.0,
            lineStyle: {
              stroke: 'rgba(255,255,255,0.12)',
              strokeWidth: 1,
              strokeDasharray: '4 4',
            },
            legend: 'before',
            legendPosition: 'bottom-right',
            textStyle: {
              fill: 'rgba(255,255,255,0.2)',
              fontSize: 9,
            },
          },
        ]}
        animate
        motionConfig="gentle"
      />
    </div>
  )
}