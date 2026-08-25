import { useMemo } from 'react'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { CHART_THEME, tooltipStyle } from './chartTheme'

function formatHour(v) {
  const h = v >= 24 ? v - 24 : v
  const ampm = v >= 24 ? 'am' : 'pm'
  const hDisp = Number.isInteger(h) ? h : Math.floor(h)
  return `${hDisp}${ampm}`
}

export default function SleepRegularityChart({ data, height = 160 }) {
  if (!data?.regularity?.scatter?.length) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>No data</span></div>

  const scatter = data?.regularity?.scatter ?? []
  const avgBedtime = data?.regularity?.avg_bedtime ?? 22.59

  const scatterData = useMemo(() => [{
    id: 'Bedtime',
    data: scatter.map(d => ({
      x: d.date,
      y: d.bedtime,
      label: d.bedtime_label,
    })),
  }], [scatter])

  return (
    <div style={{ height }}>
      <ResponsiveScatterPlot
        data={scatterData}
        margin={{ top: 8, right: 16, bottom: 32, left: 44 }}
        xScale={{ type: 'time', format: '%Y-%m-%d', precision: 'day' }}
        yScale={{ type: 'linear', min: 20, max: 28, reverse: false }}
        axisBottom={{
          format: '%b %Y',
          tickValues: 5,  // fixed count — safer than interval strings on short ranges
          tickSize: 0,
          tickPadding: 8,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 6,
          tickValues: [20, 21, 22, 23, 24, 25, 26],
          format: formatHour,
        }}
        nodeSize={3}
        colors={['rgba(6,129,252,0.4)']}
        theme={CHART_THEME}
        markers={[{
          axis: 'y',
          value: avgBedtime,
          lineStyle: {
            stroke: 'rgba(255,255,255,0.2)',
            strokeWidth: 1,
            strokeDasharray: '4 4',
          },
          legend: `${formatHour(avgBedtime)} avg`,
          legendPosition: 'bottom-right',
          textStyle: { fill: 'rgba(255,255,255,0.3)', fontSize: 9 },
        }]}
        tooltip={({ node }) => (
          <div style={tooltipStyle}>
            {String(node.data.x)}<br />
            <span style={{ color: '#0681fc' }}>
              Bedtime: {node.data.formattedX || node.data.label || formatHour(node.data.y)}
            </span>
          </div>
        )}
        animate={false}
      />
    </div>
  )
}