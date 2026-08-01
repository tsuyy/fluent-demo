import { ResponsiveBar } from '@nivo/bar'

const SPORT_DATA = [
  { sport: 'Tennis',   'Day of': -0.2, 'Day +1': 4.2,  'Day +2': 5.2,  'Day +3': 3.1  },
  { sport: 'Cycling',  'Day of': -1.0, 'Day +1': 0.5,  'Day +2': 1.2,  'Day +3': 1.0  },
  { sport: 'Running',  'Day of': -0.3, 'Day +1': 0.5,  'Day +2': 1.4,  'Day +3': 0.2  },
  { sport: 'Strength', 'Day of': -0.1, 'Day +1': 1.0,  'Day +2': -0.2, 'Day +3': 0.0  },
  { sport: 'HIIT',     'Day of': -3.8, 'Day +1': 0.6,  'Day +2': 2.4,  'Day +3': 3.0  },
  { sport: 'Skiing',   'Day of': -10.4,'Day +1': -6.2, 'Day +2': -3.8, 'Day +3': -0.8 },
]

const KEY_COLORS = {
  'Day of': 'rgba(255,255,255,0.4)',
  'Day +1': 'rgba(255,255,255,0.6)',
  'Day +2': 'rgba(255,255,255,0.8)',
  'Day +3': 'rgba(255,255,255,0.55)',
}

export default function SportHRVChart({ height = 320 }) {
  return (
    <div style={{ height }}>
      <ResponsiveBar
        data={SPORT_DATA}
        keys={['Day of', 'Day +1', 'Day +2', 'Day +3']}
        indexBy="sport"
        groupMode="grouped"
        margin={{ top: 12, right: 2, bottom: 36, left: 40 }}
        padding={0.2}
        minValue={-12}  
        maxValue={7} 
        innerPadding={1}
        colors={({ id, data }) => {
        // Tennis = green tones, Skiing = red tones, others = neutral
            if (data.sport === 'Tennis') return 'rgba(39,196,138,0.7)'
            if (data.sport === 'Skiing') return 'rgba(232,80,74,0.7)'
            return 'rgba(255,255,255,0.3)'
        }}        
        borderRadius={2}
        theme={{
          axis: {
            ticks: {
              text: { fill: 'rgba(255,255,255,0.4)', fontSize: 10 },
            },
            legend: {
              text: { fill: 'rgba(255,255,255,0.25)', fontSize: 9 },
            },
          },
          grid: {
            line: { stroke: 'rgba(255,255,255,0.05)' },
          },
          background: 'transparent',
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
          tickValues: [-10, -5, 0, 5],
          legend: 'HRV deviation (ms)',
          legendPosition: 'middle',
          legendOffset: -38,
        }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
        }}
        enableLabel={false}
        enableGridX={false}
        gridYValues={[-10, -5, 0, 5]}
        yScale={{ type: 'linear', min: -12, max: 7 }}
        markers={[{
          axis: 'y',
          value: 0,
          lineStyle: {
            stroke: 'rgba(255,255,255,0.25)',
            strokeWidth: 1,
          },
        }]}
        tooltip={({ id, value, indexValue }) => (
          <div style={{
            background: 'rgba(15,15,14,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, padding: '8px 12px',
            fontSize: 12, color: '#fff',
          }}>
            <strong>{indexValue}</strong> · {id}
            <br />
            <span style={{ color: value >= 0 ? '#27C48A' : '#E8504A' }}>
              {value > 0 ? '+' : ''}{value}ms
            </span>
          </div>
        )}
        animate
        motionConfig="gentle"
      />
    </div>
  )
}
