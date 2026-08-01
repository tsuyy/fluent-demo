import { ResponsiveLine } from '@nivo/line'

const JAMIE_WEEKLY = [
  { x: 'Mon', y: 68.2 },
  { x: 'Tue', y: 70.1 },
  { x: 'Wed', y: 69.8 },
  { x: 'Thu', y: 71.2 },
  { x: 'Fri', y: 70.5 },
  { x: 'Sat', y: 74.1 },
  { x: 'Sun', y: 72.6 },
]

export default function WeeklyRhythmChart() {
  return (
    <div style={{ height: 140 }}>
      <ResponsiveLine
        data={[{
          id: 'RHR',
          color: '#E8504A',
          data: JAMIE_WEEKLY,
        }]}
        margin={{ top: 8, right: 8, bottom: 24, left: 28 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 65, max: 77 }}
        curve="cardinal"
        colors={['#E8504A']}
        lineWidth={2}
        pointSize={8}
        pointColor="#0F0F0E"
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}

        pointSymbol={({ x, y, size, color, borderWidth, borderColor, datum }) => {
        const isMonday  = datum.x === 'Mon'
        const isSaturday = datum.x === 'Sat'
        const fill = isMonday ? '#27C48A' : isSaturday ? '#E8834A' : '#0F0F0E'
        const stroke = isMonday ? '#27C48A' : isSaturday ? '#E8834A' : '#E8504A'
        const r = (isMonday || isSaturday) ? size / 2 + 1 : size / 2

        return (
            <g>
            <circle
                r={r}
                fill={fill}
                stroke={stroke}
                strokeWidth={borderWidth}
            />
            </g>
        )
        }}
        pointBorderWidth={2}
        pointBorderColor="#E8504A"
        enableGridX={false}
        enableGridY={false}
        axisLeft={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
          tickRotation: 0,
        }}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: 'rgba(255,255,255,0.4)',
                fontSize: 11,
              },
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
        animate={true}
        motionConfig="gentle"
        markers={[{
            axis: 'y',
            value: 70.5,  // her weekly average — should appear as a mid-line
            lineStyle: {
                stroke: 'rgba(255,255,255,0.25)',
                strokeWidth: 1,
                strokeDasharray: '4 4',
            },
            legend: 'typical',
            legendPosition: 'bottom-right',
            legendOrientation: 'horizontal',
            textStyle: {
                fill: 'rgba(255,255,255,0.3)',
                fontSize: 10,
            },
        }]}
      />
    </div>
  )
}