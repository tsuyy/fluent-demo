import { ResponsiveLine } from '@nivo/line'

// 8 weeks of daily RHR data with realistic gaps
// null = no reading (watch not worn)
const EIGHT_WEEKS_HRV = [
  { x: 'W1 Mon', y: 41.2 }, { x: 'W1 Tue', y: 38.4 },
  { x: 'W1 Wed', y: 37.8 }, { x: 'W1 Thu', y: 36.9 },
  { x: 'W1 Fri', y: 36.2 }, { x: 'W1 Sat', y: null  },
  { x: 'W1 Sun', y: null  },
  { x: 'W2 Mon', y: 42.1 }, { x: 'W2 Tue', y: 37.2 },
  { x: 'W2 Wed', y: 36.8 }, { x: 'W2 Thu', y: 35.9 },
  { x: 'W2 Fri', y: 37.4 }, { x: 'W2 Sat', y: 33.2 },
  { x: 'W2 Sun', y: 34.8 },
  { x: 'W3 Mon', y: 40.8 }, { x: 'W3 Tue', y: 37.6 },
  { x: 'W3 Wed', y: null  }, { x: 'W3 Thu', y: null  },
  { x: 'W3 Fri', y: 36.4 }, { x: 'W3 Sat', y: 32.8 },
  { x: 'W3 Sun', y: 33.9 },
  { x: 'W4 Mon', y: 41.4 }, { x: 'W4 Tue', y: 38.1 },
  { x: 'W4 Wed', y: 37.2 }, { x: 'W4 Thu', y: 35.8 },
  { x: 'W4 Fri', y: 36.8 }, { x: 'W4 Sat', y: null  },
  { x: 'W4 Sun', y: 34.2 },
  { x: 'W5 Mon', y: 40.4 }, { x: 'W5 Tue', y: 36.9 },
  { x: 'W5 Wed', y: 37.4 }, { x: 'W5 Thu', y: 35.2 },
  { x: 'W5 Fri', y: 36.1 }, { x: 'W5 Sat', y: 32.1 },
  { x: 'W5 Sun', y: null  },
  { x: 'W6 Mon', y: 41.8 }, { x: 'W6 Tue', y: null  },
  { x: 'W6 Wed', y: null  }, { x: 'W6 Thu', y: null  },
  { x: 'W6 Fri', y: 36.6 }, { x: 'W6 Sat', y: 31.8 },
  { x: 'W6 Sun', y: 33.4 },
  { x: 'W7 Mon', y: 40.9 }, { x: 'W7 Tue', y: 37.8 },
  { x: 'W7 Wed', y: 37.1 }, { x: 'W7 Thu', y: 35.6 },
  { x: 'W7 Fri', y: 36.2 }, { x: 'W7 Sat', y: 32.4 },
  { x: 'W7 Sun', y: 33.8 },
  { x: 'W8 Mon', y: 41.6 }, { x: 'W8 Tue', y: 37.4 },
  { x: 'W8 Wed', y: 36.9 }, { x: 'W8 Thu', y: 35.4 },
  { x: 'W8 Fri', y: 36.8 }, { x: 'W8 Sat', y: null  },
  { x: 'W8 Sun', y: 33.6 },
]

const EIGHT_WEEKS = [
  // Week 1
  { x: 'W1 Mon', y: 68.2 }, { x: 'W1 Tue', y: 70.4 },
  { x: 'W1 Wed', y: 69.1 }, { x: 'W1 Thu', y: 71.8 },
  { x: 'W1 Fri', y: 70.2 }, { x: 'W1 Sat', y: null },
  { x: 'W1 Sun', y: null },
  // Week 2
  { x: 'W2 Mon', y: 67.8 }, { x: 'W2 Tue', y: 70.1 },
  { x: 'W2 Wed', y: 70.8 }, { x: 'W2 Thu', y: 71.2 },
  { x: 'W2 Fri', y: 69.8 }, { x: 'W2 Sat', y: 74.8 },
  { x: 'W2 Sun', y: 72.9 },
  // Week 3
  { x: 'W3 Mon', y: 68.4 }, { x: 'W3 Tue', y: 69.9 },
  { x: 'W3 Wed', y: null  }, { x: 'W3 Thu', y: null  },
  { x: 'W3 Fri', y: 70.6 }, { x: 'W3 Sat', y: 75.2 },
  { x: 'W3 Sun', y: 73.1 },
  // Week 4
  { x: 'W4 Mon', y: 67.4 }, { x: 'W4 Tue', y: 70.8 },
  { x: 'W4 Wed', y: 69.4 }, { x: 'W4 Thu', y: 72.1 },
  { x: 'W4 Fri', y: 71.2 }, { x: 'W4 Sat', y: null  },
  { x: 'W4 Sun', y: 72.4 },
  // Week 5
  { x: 'W5 Mon', y: 68.8 }, { x: 'W5 Tue', y: 71.2 },
  { x: 'W5 Wed', y: 70.2 }, { x: 'W5 Thu', y: 71.9 },
  { x: 'W5 Fri', y: 70.8 }, { x: 'W5 Sat', y: 74.4 },
  { x: 'W5 Sun', y: null  },
  // Week 6
  { x: 'W6 Mon', y: 67.9 }, { x: 'W6 Tue', y: null  },
  { x: 'W6 Wed', y: null  }, { x: 'W6 Thu', y: null  },
  { x: 'W6 Fri', y: 70.4 }, { x: 'W6 Sat', y: 75.8 },
  { x: 'W6 Sun', y: 73.6 },
  // Week 7
  { x: 'W7 Mon', y: 68.1 }, { x: 'W7 Tue', y: 70.6 },
  { x: 'W7 Wed', y: 69.8 }, { x: 'W7 Thu', y: 71.4 },
  { x: 'W7 Fri', y: 70.9 }, { x: 'W7 Sat', y: 74.9 },
  { x: 'W7 Sun', y: 73.2 },
  // Week 8
  { x: 'W8 Mon', y: 67.6 }, { x: 'W8 Tue', y: 70.2 },
  { x: 'W8 Wed', y: 69.6 }, { x: 'W8 Thu', y: 71.8 },
  { x: 'W8 Fri', y: 70.5 }, { x: 'W8 Sat', y: null  },
  { x: 'W8 Sun', y: 72.8 },
]

// Split into segments at gaps so line breaks naturally
function buildSegments(data) {
  const segments = []
  let current = []

  data.forEach(pt => {
    if (pt.y === null) {
      if (current.length > 0) {
        segments.push([...current])
        current = []
      }
    } else {
      current.push(pt)
    }
  })
  if (current.length > 0) segments.push(current)
  return segments
}

// X-axis ticks — only show Mon labels and S for Saturday
function getTickLabel(value) {
  if (value.includes('Mon')) return 'M'
  if (value.includes('Sat')) return 'S'
  return ''
}

// Week divider positions
const WEEK_DIVIDERS = [
  'W1 Sun', 'W2 Sun', 'W3 Sun', 'W4 Sun',
  'W5 Sun', 'W6 Sun', 'W7 Sun',
]
export default function WeeklyRhythmFullChart({ height = 200, metric = 'RHR' }) {
  const rawData = metric === 'RHR' ? EIGHT_WEEKS : EIGHT_WEEKS_HRV
  const segments = buildSegments(rawData)
  const allXValues = rawData.map(d => d.x)
    // Update yScale based on metric:
  const yScale = metric === 'RHR'
    ? { type: 'linear', min: 64, max: 78 }
    : { type: 'linear', min: 28, max: 46 }

  // Update baseline marker:
  const baselineValue = metric === 'RHR' ? 70.5 : 37.2

  // Update line color:
  const lineColor = metric === 'RHR' ? '#E8504A' : '#0681fc'

  // Build nivo line series — one per segment so gaps show as breaks
  const lineData = segments.map((seg, i) => ({
    id: `segment-${i}`,
    color: '#E8504A',
    data: seg,
  }))

  return (
    <div style={{ height, position: 'relative' }}>
      {/* Gap legend */}
      <div style={{
        position: 'absolute', top: 4, right: 8,
        display: 'flex', alignItems: 'center', gap: 6,
        zIndex: 2,
      }}>
        <div style={{
          width: 16, height: 1,
          borderTop: '1px dashed rgba(255,255,255,0.2)',
        }} />
        <span style={{
          fontSize: 9,
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.03em',
        }}>
          data gap
        </span>
      </div>

      <ResponsiveLine
        data={segments.map((seg, i) => ({
                id: `segment-${i}`,
                color: lineColor,
                data: seg,
                }))}
        yScale={yScale}
        colors={[lineColor]}        
        margin={{ top: 16, right: 12, bottom: 32, left: 32 }}
        xScale={{ type: 'point', domain: allXValues }}
        curve="cardinal"
        lineWidth={1.5}
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
        pointSize={5}
        pointColor="#0F0F0E"
        pointBorderColor={{ from: 'serieColor' }}
        pointSymbol={({ x, y, size, datum }) => {
        const isMon = datum.x?.includes('Mon')
        const isSat = datum.x?.includes('Sat')
        const fill   = isMon ? '#27C48A' : isSat ? '#E8834A' : '#0F0F0E'
        const stroke = isMon ? '#27C48A' : isSat ? '#E8834A' : '#E8504A'
        const r      = (isMon || isSat) ? (size / 2) + 1 : size / 2
        return (
            <g>
            <circle r={r} fill={fill} stroke={stroke} strokeWidth={1.5} />
            </g>
        )
        }}
        enableGridX={false}
        enableGridY={false}
        axisLeft={{
          tickSize: 0,
          tickPadding: 6,
          tickValues: [66, 70, 74, 78],
        }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 6,
          format: getTickLabel,
          tickValues: EIGHT_WEEKS
            .filter(d => d.x.includes('Mon') || d.x.includes('Sat'))
            .map(d => d.x),
        }}
        theme={{
          axis: {
            ticks: {
              text: { fill: 'rgba(255,255,255,0.3)', fontSize: 9 },
            },
          },
          background: 'transparent',
        }}
        markers={[
          {
            axis: 'y',
            value: baselineValue,
            lineStyle: {
              stroke: 'rgba(255,255,255,0.15)',
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
          // Week dividers — subtle vertical lines
          ...WEEK_DIVIDERS.map(x => ({
            axis: 'x',
            value: x,
            lineStyle: { stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 },
          })),
        ]}
        tooltip={({ point }) => (
          <div style={{
            background: 'rgba(15,15,14,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, padding: '6px 10px',
            fontSize: 11, color: '#fff',
          }}>
            {point.data.xFormatted}: {point.data.y} bpm
          </div>
        )}
        animate={false}
      />
    </div>
  )
}
