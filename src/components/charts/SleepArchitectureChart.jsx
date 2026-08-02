import { ResponsiveBar } from '@nivo/bar'
import { CHART_THEME } from '../../data/chartTheme'

// 7 nights of sleep architecture
// null nights = gaps (Jamie's inconsistent tracking)
const generateSleepData = (persona) => {
  if (persona === 'jamie') {
    return [
      { night: 'Mon', deep: 52, rem: 78,  core: 280, awake: 28 },
      { night: 'Tue', deep: 48, rem: 72,  core: 262, awake: 35 },
      { night: 'Wed', deep: 55, rem: 82,  core: 285, awake: 22 },
      { night: 'Thu', deep: 44, rem: 75,  core: 278, awake: 41 },
      { night: 'Fri', deep: 50, rem: 80,  core: 268, awake: 30 },
      { night: 'Sat', deep: 0,  rem: 0,   core: 0,   awake: 0,  gap: true },
      { night: 'Sun', deep: 46, rem: 84,  core: 271, awake: 38 },
    ]
  }
  if (persona === 'robert') {
    return [
      { night: 'Mon', deep: 54, rem: 71,  core: 288, awake: 24 },
      { night: 'Tue', deep: 51, rem: 69,  core: 285, awake: 28 },
      { night: 'Wed', deep: 55, rem: 73,  core: 291, awake: 22 },
      { night: 'Thu', deep: 52, rem: 70,  core: 284, awake: 26 },
      { night: 'Fri', deep: 48, rem: 68,  core: 280, awake: 32 },
      { night: 'Sat', deep: 50, rem: 72,  core: 286, awake: 28 },
      { night: 'Sun', deep: 53, rem: 74,  core: 290, awake: 24 },
    ]
  }
  // Yvonne — richest
  return [
    { night: 'Mon', deep: 72, rem: 102, core: 283, awake: 12 },
    { night: 'Tue', deep: 58, rem: 86,  core: 278, awake: 38 },
    { night: 'Wed', deep: 64, rem: 94,  core: 281, awake: 23 },
    { night: 'Thu', deep: 55, rem: 91,  core: 285, awake: 18 },
    { night: 'Fri', deep: 45, rem: 87,  core: 291, awake: 46 },
    { night: 'Sat', deep: 42, rem: 78,  core: 276, awake: 62 },
    { night: 'Sun', deep: 68, rem: 98,  core: 282, awake: 16 },
  ]
}

export default function SleepArchitectureChart({ persona = 'yvonne', height = 200 }) {
  const data = generateSleepData(persona)
  const hasGap = data.some(d => d.gap)

  return (
    <div style={{ height }}>
      <ResponsiveBar
        data={data.filter(d => !d.gap)}
        keys={['deep', 'rem', 'core', 'awake']}
        indexBy="night"
        groupMode="stacked"
        margin={{ top: 8, right: 80, bottom: 28, left: 8 }}
        padding={0.25}
        colors={[
          '#1a3a5c',      // deep — dark blue
          '#27C48A',      // rem — teal
          '#0681fc',      // core — blue
          '#E8834A',      // awake — amber
        ]}
        borderRadius={2}
        theme={CHART_THEME}
        axisLeft={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
        }}
        enableLabel={false}
        enableGridY={false}
        legends={[{
          dataFrom: 'keys',
          anchor: 'right',
          direction: 'column',
          itemWidth: 70,
          itemHeight: 18,
          itemTextColor: 'rgba(255,255,255,0.3)',
          symbolSize: 8,
          symbolShape: 'square',
          translateX: 78,
          data: [
            { id: 'deep',  label: 'Deep',  color: '#1a3a5c'  },
            { id: 'rem',   label: 'REM',   color: '#27C48A'  },
            { id: 'core',  label: 'Core',  color: '#0681fc'  },
            { id: 'awake', label: 'Awake', color: '#E8834A'  },
          ],
        }]}
        tooltip={({ id, value, indexValue }) => (
          <div style={{
            background: 'rgba(15,15,14,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, padding: '6px 10px',
            fontSize: 11, color: '#fff',
          }}>
            <strong>{indexValue}</strong> · {id}
            <br />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>
              {value} min
            </span>
          </div>
        )}
        animate
        motionConfig="gentle"
      />
      {hasGap && (
        <p style={{
          fontSize: 10,
          color: 'rgba(255,255,255,0.2)',
          marginTop: 4, textAlign: 'center',
        }}>
          Saturday reading missing — tracker not worn
        </p>
      )}
    </div>
  )
}
