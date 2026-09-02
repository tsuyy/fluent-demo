import { useMemo } from 'react'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { CHART_THEME, tooltipStyle } from './chartTheme'

export default function SleepEfficiencyChart({ data, height = 160 }) {
  if (!data?.quality?.nightly?.length) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>No data</span></div>

  const nightly = data?.quality?.nightly ?? []

  const scatterData = useMemo(() => [
    {
      id: 'Good (≥85%)',
      data: nightly
        .filter(d => d.efficiency >= 85)
        .map(d => ({ x: d.date, y: d.efficiency })),
    },
    {
      id: 'Low (<85%)',
      data: nightly
        .filter(d => d.efficiency < 85)
        .map(d => ({ x: d.date, y: d.efficiency })),
    },
  ], [nightly])

  return (
    <div style={{ height }}>
      <ResponsiveScatterPlot
        data={scatterData}
        margin={{ top: 8, right: 16, bottom: 46, left: 36 }}
        xScale={{ type: 'time', format: '%Y-%m-%d', precision: 'day' }}
        yScale={{ type: 'linear', min: 60, max: 100 }}
        axisBottom={{
          format: '%b %Y',
          tickValues: 5,  // fixed count — safer than interval strings on short ranges
          tickSize: 0,
          tickPadding: 8,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 6,
          tickValues: [65, 75, 85, 95],
          format: v => `${v}%`,
        }}
        nodeSize={4}
        colors={({ serieId }) =>
          serieId === 'Good (≥85%)' ? '#27C48A' : '#E8504A'
        }
        theme={CHART_THEME}
        markers={[{
          axis: 'y',
          value: 85,
          lineStyle: {
            stroke: 'rgba(255,255,255,0.2)',
            strokeWidth: 1,
            strokeDasharray: '4 4',
          },
          legend: '85% threshold',
          legendPosition: 'bottom-right',
          textStyle: { fill: 'rgba(255,255,255,0.3)', fontSize: 9 },
        }]}
        legends={[{
          anchor: 'bottom',
          direction: 'row',
          itemWidth: 90,
          itemHeight: 16,
          itemTextColor: 'rgba(255,255,255,0.3)',
          symbolSize: 6,
          symbolShape: 'circle',
          translateY: 40,
          justify: false,
        }]}
        tooltip={({ node }) => (
          <div style={tooltipStyle}>
            {String(node.data.x)}<br />
            <span style={{ color: node.color }}>{node.data.y}% efficiency</span>
          </div>
        )}
        animate={false}
      />
    </div>
  )
}