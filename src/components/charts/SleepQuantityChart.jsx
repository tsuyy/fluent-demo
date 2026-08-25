import { useMemo } from 'react'
import { ResponsiveLine } from '@nivo/line'
import { CHART_THEME, tooltipStyle } from './chartTheme'

export default function SleepQuantityChart({ data, height = 160 }) {
  if (!data?.quantity?.weekly_trend?.length) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>No data</span></div>

  const lineData = useMemo(() => [{
    id: 'Sleep',
    color: '#0681fc',
    data: (data?.quantity?.weekly_trend ?? []).map(d => ({
      x: d.week,
      y: d.hours,
    })),
  }], [data])

  const mean = data?.quantity?.mean_hr ?? 7.1

  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={lineData}
        margin={{ top: 8, right: 16, bottom: 32, left: 36 }}
        xScale={{ type: 'time', format: '%Y-%m-%d', precision: 'day' }}
        yScale={{ type: 'linear', min: 4, max: 10 }}
        axisBottom={{
          format: '%b %Y',
          tickValues: 5,  // fixed count — safer than interval strings on short ranges
          tickSize: 0,
          tickPadding: 8,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 6,
          tickValues: [5, 6, 7, 8, 9],
          format: v => `${v}h`,
        }}
        curve="cardinal"
        lineWidth={2}
        colors={['#0681fc']}
        pointSize={0}
        enableGridX={false}
        enableArea
        areaOpacity={0.06}
        theme={CHART_THEME}
        useMesh
        markers={[{
          axis: 'y',
          value: mean,
          lineStyle: {
            stroke: 'rgba(255,255,255,0.2)',
            strokeWidth: 1,
            strokeDasharray: '4 4',
          },
          legend: `${mean}hr avg`,
          legendPosition: 'bottom-right',
          textStyle: { fill: 'rgba(255,255,255,0.3)', fontSize: 9 },
        }]}
        tooltip={({ point }) => (
          <div style={tooltipStyle}>
            {point.data.xFormatted}<br />
            <span style={{ color: '#0681fc' }}>{point.data.y}hr avg</span>
          </div>
        )}
      />
    </div>
  )
}