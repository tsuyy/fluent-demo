import { useState, useRef, useCallback } from 'react'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = '#1A1A18'
const DEEP_COLOR  = '#0681fc'
const REM_COLOR   = '#27C48A'
const AWAKE_COLOR = 'rgba(255,255,255,0.4)'

const BASELINE = { deep: 48.8, rem: 80.0, awake: 35.9 }

const ANNOTATIONS = [
  { month: '2025-11', label: 'Lowest deep sleep', note: '31.6min', position: 'below' },
  { month: '2026-06', label: 'Peak REM', note: '90.8min', position: 'above' },
  { month: '2026-08', label: 'Best deep sleep', note: '63.9min', position: 'above' },
]

/**
 * SleepMonthlyChart — deep + REM + awake monthly averages, baseline
 * dashed references for all three, annotations for the three-act arc.
 *
 * `hideAnnotations` (was `hideChrome`) hides the on-chart annotation
 * callouts and stat-style chrome — used in the scrollytelling context
 * since the scrolling prose already narrates those moments. The
 * color-key legend is now ALWAYS shown regardless, since nothing else
 * on screen identifies which line is which color.
 *
 * data shape: { months: [{ month, deep, rem, awake, total, hrv, rhr, n }] }
 */
export default function SleepMonthlyChart({ data, height = 320, highlightLine = null, hideAnnotations = false }) {
  const [tip, setTip] = useState(null)
  const containerRef = useRef(null)
  const [width, setWidth] = useState(600)

  const months = data?.months ?? []

  const measureRef = useCallback((node) => {
    containerRef.current = node
    if (node) setWidth(node.getBoundingClientRect().width)
  }, [])

  if (!months.length) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 12, color: QUIET }}>Needs sleep_monthly.json's months array</span>
      </div>
    )
  }

  const margin = { top: 46, right: 20, bottom: 40, left: 20 }
  const plotW = width - margin.left - margin.right
  const plotH = height - margin.top - margin.bottom

  const n = months.length
  const xStep = plotW / (n - 1)
  const xFor = (i) => margin.left + xStep * i

  const allVals = months.flatMap(m => [m.deep, m.rem, m.awake])
  const yMin = Math.min(...allVals, BASELINE.deep, BASELINE.awake) - 5
  const yMax = Math.max(...allVals, BASELINE.rem) + 5
  const yFor = (v) => margin.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH

  const linePath = (key) => months.map((m, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(m[key])}`).join(' ')
  const deepPath  = linePath('deep')
  const remPath   = linePath('rem')
  const awakePath = linePath('awake')

  const monthLabel = (m) => {
    const [y, mo] = m.split('-')
    return new Date(Number(y), Number(mo) - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const idx = Math.round((e.clientX - rect.left - margin.left) / xStep)
    if (idx < 0 || idx >= n) { setTip(null); return }
    setTip({ idx, x: xFor(idx), point: months[idx] })
  }, [xStep, margin.left, n])

  const lineStyle = (lineKey) => ({
    strokeWidth: highlightLine === lineKey ? 3 : 2,
    opacity: highlightLine && highlightLine !== lineKey ? 0.15 : 1,
  })

  return (
    <div ref={measureRef} style={{ width: '100%', position: 'relative' }}>
      <svg
        width="100%" height={height} viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove} onMouseLeave={() => setTip(null)}
        style={{ cursor: 'crosshair', overflow: 'visible' }}
      >
        {!hideAnnotations && ANNOTATIONS.map(a => {
          const idx = months.findIndex(m => m.month === a.month)
          if (idx < 0) return null
          const x = xFor(idx)
          const labelY = a.position === 'above' ? margin.top - 22 : height - margin.bottom + 30
          return (
            <g key={a.month}>
              <line x1={x} y1={margin.top} x2={x} y2={height - margin.bottom}
                stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="3 3" />
              <text x={x} y={labelY} textAnchor="middle" fill={TEXT} fontSize={11} fontWeight={600}>{a.label}</text>
              <text x={x} y={labelY + 13} textAnchor="middle" fill={QUIET} fontSize={9}>{a.note}</text>
            </g>
          )
        })}

        <line x1={margin.left} y1={yFor(BASELINE.deep)} x2={width - margin.right} y2={yFor(BASELINE.deep)}
          stroke={`${DEEP_COLOR}44`} strokeWidth={1} strokeDasharray="4 4" />
        <line x1={margin.left} y1={yFor(BASELINE.rem)} x2={width - margin.right} y2={yFor(BASELINE.rem)}
          stroke={`${REM_COLOR}44`} strokeWidth={1} strokeDasharray="4 4" />
        <line x1={margin.left} y1={yFor(BASELINE.awake)} x2={width - margin.right} y2={yFor(BASELINE.awake)}
          stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="4 4" />

        <path d={deepPath} fill="none" stroke={DEEP_COLOR} {...lineStyle('deep')} />
        <path d={remPath} fill="none" stroke={REM_COLOR} {...lineStyle('rem')} />
        <path d={awakePath} fill="none" stroke={AWAKE_COLOR} strokeDasharray="2 3" {...lineStyle('awake')} />

        {tip && (
          <line x1={tip.x} y1={margin.top} x2={tip.x} y2={height - margin.bottom}
            stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
        )}

        {months.map((m, i) => (
          i % 2 === 0 && (
            <text key={m.month} x={xFor(i)} y={height - margin.bottom + 16} textAnchor="middle" fill={QUIET} fontSize={9}>
              {monthLabel(m.month)}
            </text>
          )
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
            <p style={{ fontSize: 11, fontWeight: 600, color: TEXT, marginBottom: 4 }}>{monthLabel(tip.point.month)}</p>
            <p style={{ fontSize: 10, color: DEEP_COLOR, margin: 0 }}>Deep {tip.point.deep}min</p>
            <p style={{ fontSize: 10, color: REM_COLOR, margin: '2px 0' }}>REM {tip.point.rem}min</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Awake {tip.point.awake}min</p>
          </div>
        )
      })()}

      <div style={{ display: 'flex', gap: 14, marginTop: 8, justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 10, height: 2, background: DEEP_COLOR }} />
          <span style={{ fontSize: 10, color: QUIET }}>Deep sleep</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 10, height: 2, background: REM_COLOR }} />
          <span style={{ fontSize: 10, color: QUIET }}>REM sleep</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 10, height: 2, background: AWAKE_COLOR, borderTop: `1px dashed ${AWAKE_COLOR}` }} />
          <span style={{ fontSize: 10, color: QUIET }}>Awake</span>
        </div>
      </div>
    </div>
  )
}