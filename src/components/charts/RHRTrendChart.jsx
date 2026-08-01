import { ResponsiveLine } from '@nivo/line'

export default function RHRTrendChart({ height = 140, showShift = true }) {
  // Last 8 weeks of daily RHR — simulated from quarterly averages
  const recentData = [
    { x: 'Jun 1',  y: 59.8 },
    { x: 'Jun 8',  y: 58.4 },
    { x: 'Jun 15', y: 59.1 },
    { x: 'Jun 22', y: 57.3 },
    { x: 'Jun 29', y: 54.1 },
    { x: 'Jul 6',  y: 55.2 },
    { x: 'Jul 13', y: 54.8 },
    { x: 'Jul 20', y: 52.0 },
  ]

  const baseline = 59.0

  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={[{
          id: 'RHR',
          color: '#0681fc',
          data: recentData,
        }]}
        margin={{ top: 8, right: 12, bottom: 24, left: 32 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 48, max: 64 }}
        curve="cardinal"
        colors={['#0681fc']}
        lineWidth={2}
        pointSize={4}
        pointColor="#0F0F0E"
        pointBorderWidth={1.5}
        pointBorderColor="#0681fc"
        enableGridX={false}
        enableGridY={false}
        axisLeft={{
          tickSize: 0,
          tickPadding: 6,
          tickValues: [52, 56, 60, 64],
        }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 6,
          tickRotation: -20,
        }}
        theme={{
          axis: {
            ticks: {
              text: { fill: 'rgba(255,255,255,0.35)', fontSize: 9 },
            },
          },
          background: 'transparent',
        }}
        markers={[
          {
            axis: 'x',
            value: 'Jun 22',
            lineStyle: {
              stroke: 'rgba(255,255,255,0.08)',  // was 0.15
              strokeWidth: 1,
              strokeDasharray: '2 4',
            },
            axis: 'y',
            value: baseline,
            lineStyle: {
              stroke: 'rgba(255,255,255,0.2)',
              strokeWidth: 1,
              strokeDasharray: '4 4',
            },
            legend: 'typical',
            legendPosition: 'bottom-right',
            textStyle: {
              fill: 'rgba(255,255,255,0.25)',
              fontSize: 9,
            },
          },
          showShift && {
            axis: 'x',
            value: 'Jun 22',
            lineStyle: {
              stroke: 'rgba(255,255,255,0.15)',
              strokeWidth: 1,
            },
          },
        ].filter(Boolean)}
        animate
        motionConfig="gentle"
      />
    </div>
  )
}
