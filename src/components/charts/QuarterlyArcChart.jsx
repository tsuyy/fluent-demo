import { useState, useRef, useCallback } from 'react'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = '#1A1A18'
const RHR_COLOR  = '#E8504A'
const HRV_COLOR  = '#27C48A'
const RESP_COLOR = 'rgba(255,255,255,0.4)'

// ⚠ Same placeholder caveat as before for RHR/HRV middle quarters.
// Resp rate is even more placeholder — I only know the two endpoints
// (~20-22 start, 15.4 end, drop occurring around 2025Q3) with NO real
// per-quarter numbers in between. This interpolates smoothly between
// those two known points purely so the line has something to draw —
// treat every value except 2022Q1 and 2026Q3 as a rough guess, not
// real data. Swap in the real quarterly_arc.json the moment you have
// actual per-quarter resp figures.
const PLACEHOLDER_DATA = [
  { quarter: '2022Q1', rhr: 62.7, hrv: 39.2, resp: 21.5 },
  { quarter: '2022Q2', rhr: 62.1, hrv: 37.8, resp: 21.3 },
  { quarter: '2022Q3', rhr: 63.4, hrv: 35.1, resp: 21.0 },
  { quarter: '2022Q4', rhr: 66.8, hrv: 33.4, resp: 20.8 }, // locked — worst quarter
  { quarter: '2023Q1', rhr: 64.2, hrv: 36.8, resp: 20.5 },
  { quarter: '2023Q2', rhr: 61.8, hrv: 38.2, resp: 20.2 },
  { quarter: '2023Q3', rhr: 60.4, hrv: 38.9, resp: 19.9 },
  { quarter: '2023Q4', rhr: 62.1, hrv: 37.4, resp: 19.6 },
  { quarter: '2024Q1', rhr: 63.8, hrv: 38.1, resp: 19.2 },
  { quarter: '2024Q2', rhr: 61.2, hrv: 39.8, resp: 18.8 },
  { quarter: '2024Q3', rhr: 60.8, hrv: 40.2, resp: 18.4 },
  { quarter: '2024Q4', rhr: 59.4, hrv: 41.8, resp: 18.0 },
  { quarter: '2025Q1', rhr: 60.2, hrv: 42.4, resp: 17.6 },
  { quarter: '2025Q2', rhr: 58.8, hrv: 44.1, resp: 17.1 },
  { quarter: '2025Q3', rhr: 57.9, hrv: 46.8, resp: 16.5 }, // locked start of resp drop
  { quarter: '2025Q4', rhr: 58.4, hrv: 45.2, resp: 16.1 },
  { quarter: '2026Q1', rhr: 57.2, hrv: 46.4, resp: 15.8 },
  { quarter: '2026Q2', rhr: 55.8, hrv: 48.0, resp: 15.6 },
  { quarter: '2026Q3', rhr: 57.6, hrv: 51.9, resp: 15.4 }, // locked — best quarter + resp endpoint
]

const ANNOTATIONS = [
  { quarter: '2022Q4', label: 'Low point',    note: 'RHR 66.8 · HRV 33.4', position: 'below' },
  { quarter: '2025Q3', label: 'HRV climbs',   note: 'Tennis era + pilates begin', position: 'above' },
  { quarter: '2026Q3', label: 'Best quarter', note: 'RHR 57.6 · HRV 51.9', position: 'above' },
]

export default function QuarterlyArcChart({ height = 280, data: rawData = PLACEHOLDER_DATA }) {
  // Real export likely wraps the array in a named key (matching every
  // other file this round — sports/rides/sessions/buckets are all
  // nested, not bare arrays). Try the likely key name, fall back to
  // treating the prop as a bare array if it already is one.
  const data = Array.isArray(rawData) ? rawData : (rawData?.quarters ?? PLACEHOLDER_DATA)

  const [tip, setTip] = useState(null)
  const containerRef = useRef(null)
  const [width, setWidth] = useState(700)

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 12, color: QUIET }}>
          Couldn't find a quarters array — check quarterly_arc.json's actual top-level key name
        </span>
      </div>
    )
  }

  const measureRef = useCallback((node) => {
    containerRef.current = node
    if (node) setWidth(node.getBoundingClientRect().width)
  }, [])

  const margin = { top: 46, right: 44, bottom: 44, left: 40 }
  const plotW = width - margin.left - margin.right
  const plotH = height - margin.top - margin.bottom

  const n = data.length
  const xStep = plotW / (n - 1)
  const xFor = (i) => margin.left + xStep * i

  const leftMin = Math.min(...data.map(d => Math.min(d.rhr, d.hrv))) - 4
  const leftMax = Math.max(...data.map(d => Math.max(d.rhr, d.hrv))) + 4
  const yLeft = (v) => margin.top + plotH - ((v - leftMin) / (leftMax - leftMin)) * plotH

  const respVals = data.map(d => d.resp).filter(v => v != null)
  const rightMin = respVals.length ? Math.min(...respVals) - 2 : 0
  const rightMax = respVals.length ? Math.max(...respVals) + 2 : 30
  const yRight = (v) => margin.top + plotH - ((v - rightMin) / (rightMax - rightMin)) * plotH

  const linePath = (key, yFn) => data
    .map((d, i) => (d[key] != null ? `${i === 0 || data[i - 1]?.[key] == null ? 'M' : 'L'} ${xFor(i)} ${yFn(d[key])}` : null))
    .filter(Boolean)
    .join(' ')

  const rhrPath  = linePath('rhr', yLeft)
  const hrvPath  = linePath('hrv', yLeft)
  const respPath = linePath('resp', yRight)

  const tickEvery = n > 12 ? 3 : 1
  const tickIndices = data.map((_, i) => i).filter(i => i % tickEvery === 0)

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const idx = Math.round((mx - margin.left) / xStep)
    if (idx < 0 || idx >= n) { setTip(null); return }
    setTip({ idx, x: xFor(idx), point: data[idx] })
  }, [xStep, margin.left, n])

  return (
    <div ref={measureRef} style={{ width: '100%', position: 'relative' }}>
      <svg
        width="100%" height={height} viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTip(null)}
        style={{ cursor: 'crosshair', overflow: 'visible' }}
      >
        {ANNOTATIONS.map(a => {
          const idx = data.findIndex(d => d.quarter === a.quarter)
          if (idx < 0) return null
          const x = xFor(idx)
          const labelY = a.position === 'above' ? margin.top - 22 : height - margin.bottom + 30
          return (
            <g key={a.quarter}>
              <line x1={x} y1={margin.top} x2={x} y2={height - margin.bottom}
                stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="3 3" />
              <text x={x} y={labelY} textAnchor="middle" fill={TEXT} fontSize={11} fontWeight={600}>{a.label}</text>
              <text x={x} y={labelY + 13} textAnchor="middle" fill={QUIET} fontSize={9}>{a.note}</text>
            </g>
          )
        })}

        <path d={rhrPath} fill="none" stroke={RHR_COLOR} strokeWidth={2} />
        <path d={hrvPath} fill="none" stroke={HRV_COLOR} strokeWidth={2} />
        {respPath && <path d={respPath} fill="none" stroke={RESP_COLOR} strokeWidth={1.5} strokeDasharray="2 3" />}

        {tip && (
          <line x1={tip.x} y1={margin.top} x2={tip.x} y2={height - margin.bottom}
            stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
        )}

        {tickIndices.map(i => (
          <text key={i} x={xFor(i)} y={height - margin.bottom + 16} textAnchor="middle" fill={QUIET} fontSize={9}>
            {data[i].quarter}
          </text>
        ))}
      </svg>

      {tip && (() => {
        const flip = tip.x > width - 140
        return (
          <div style={{
            position: 'absolute',
            left: flip ? undefined : tip.x + 10,
            right: flip ? width - tip.x + 10 : undefined,
            top: margin.top,
            background: SURFACE, border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '8px 12px',
            zIndex: 100, pointerEvents: 'none', minWidth: 120,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: TEXT, marginBottom: 4 }}>{tip.point.quarter}</p>
            <p style={{ fontSize: 10, color: RHR_COLOR, margin: 0 }}>RHR {tip.point.rhr} bpm</p>
            <p style={{ fontSize: 10, color: HRV_COLOR, margin: '2px 0' }}>HRV {tip.point.hrv} ms</p>
            {tip.point.resp != null && <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Resp {tip.point.resp} br/min</p>}
          </div>
        )
      })()}

      <div style={{ display: 'flex', gap: 14, marginTop: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Legend color={RHR_COLOR} label="RHR" />
        <Legend color={HRV_COLOR} label="HRV" />
        <Legend color={RESP_COLOR} label="Breathing rate" dashed />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 16 }}>
        <StatCallout value="−5.1 bpm" label="RHR since 2022" />
        <StatCallout value="+12.7 ms" label="HRV since 2022" />
        <StatCallout value="−5 br/min" label="Breathing rate since 2022" />
      </div>
    </div>
  )
}

function Legend({ color, label, dashed }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 10, height: dashed ? 0 : 2, borderTop: dashed ? `1.5px dashed ${color}` : 'none', background: dashed ? 'transparent' : color }} />
      <span style={{ fontSize: 10, color: QUIET }}>{label}</span>
    </div>
  )
}

function StatCallout({ value, label }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
      <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{value}</p>
      <p style={{ fontSize: 10, color: QUIET }}>{label}</p>
    </div>
  )
}