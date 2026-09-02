import { useState, useRef, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'

const QUIET  = 'var(--color-quiet, #888780)'
const TEXT   = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = '#1A1A18'

function getHR(s) {
  // Real export uses hr_avg (confirmed from cycling_efficiency.json's
  // sample) — reading s.hr alone left every point undefined, which
  // silently fell through to the grey default regardless of real HR.
  return s.hr_avg ?? s.hr
}

function hrColor(hr) {
  if (hr <= 137) return '#27C48A'   // most adapted
  if (hr <= 143) return '#0681fc'
  return 'rgba(255,255,255,0.35)'   // earlier / higher effort
}

/**
 * Zone2ProgressChart — scatter of individual Zone 2 running sessions,
 * pace vs date, dot size by distance, color by HR band.
 *
 * IMPORTANT: this needs the real 23-session array from
 * zone2_running.json's `sessions` field — I only have the yearly
 * aggregates (2024/2025/2026 averages) from this spec, not the
 * individual session dates/paces/distances/HR. Rather than fabricate
 * 23 plausible-looking points and present them as real personal data,
 * this component requires `data` (the real sessions array) as a prop
 * and shows an honest "no data" state without it. The two specific
 * sessions called out by name in the spec (earliest 2024, latest
 * Jul 31 2026) are still annotated correctly once real data loads,
 * since those two data points were given explicitly.
 */
export default function Zone2ProgressChart({ data, height = 200, compact = false }) {
  const [tip, setTip] = useState(null)
  const containerRef  = useRef(null)
  const [width, setWidth] = useState(320)

  const sessions = data?.sessions ?? []

  const measureRef = useCallback((node) => {
    containerRef.current = node
    if (node) setWidth(node.getBoundingClientRect().width)
  }, [])

  const margin = { top: 24, right: 12, bottom: compact ? 24 : 32, left: 32 }
  const plotW = width - margin.left - margin.right
  const plotH = height - margin.top - margin.bottom

  const { xScale, yScale, regression } = useMemo(() => {
    if (!sessions.length) return { xScale: null, yScale: null, regression: null }

    const dates = sessions.map(s => new Date(s.date).getTime())
    const paces = sessions.map(s => s.pace)
    const minDate = Math.min(...dates), maxDate = Math.max(...dates)
    const minPace = Math.min(...paces) - 0.5, maxPace = Math.max(...paces) + 0.5

    const xScale = (d) => margin.left + ((new Date(d).getTime() - minDate) / (maxDate - minDate)) * plotW
    // inverted: lower pace (faster) = higher on chart
    const yScale = (p) => margin.top + ((p - minPace) / (maxPace - minPace)) * plotH

    // simple linear regression on (dateIndex, pace)
    const n = sessions.length
    const xs = dates.map(d => (d - minDate) / (maxDate - minDate))
    const ys = paces
    const xMean = xs.reduce((a, b) => a + b, 0) / n
    const yMean = ys.reduce((a, b) => a + b, 0) / n
    const num = xs.reduce((sum, x, i) => sum + (x - xMean) * (ys[i] - yMean), 0)
    const den = xs.reduce((sum, x) => sum + (x - xMean) ** 2, 0)
    const slope = den !== 0 ? num / den : 0
    const intercept = yMean - slope * xMean

    return {
      xScale, yScale,
      regression: {
        x1: margin.left, y1: yScale(intercept),
        x2: margin.left + plotW, y2: yScale(intercept + slope),
      },
    }
  }, [sessions, plotW, plotH, margin.left, margin.top])

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || !xScale) return
    const rect = containerRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    let closest = null, minDist = Infinity
    sessions.forEach(s => {
      const dx = Math.abs(xScale(s.date) - mx)
      if (dx < minDist) { minDist = dx; closest = s }
    })
    if (closest && minDist < 20) setTip(closest)
    else setTip(null)
  }, [sessions, xScale])

  if (!sessions.length) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 12, color: QUIET }}>
          Needs zone2_running.json's sessions array
        </span>
      </div>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      {!compact && (
        <p style={{ fontSize: 13, fontWeight: 500, color: TEXT, marginBottom: 8 }}>
          Same heart rate. Longer and faster.
        </p>
      )}

      <div ref={measureRef} style={{ width: '100%', position: 'relative' }}>
        <svg
          width="100%" height={height}
          viewBox={`0 0 ${width} ${height}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTip(null)}
          style={{ cursor: 'crosshair', overflow: 'visible' }}
        >
          {regression && (
            <line
              x1={regression.x1} y1={regression.y1} x2={regression.x2} y2={regression.y2}
              stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} strokeDasharray="4 4"
            />
          )}

          {sessions.map((s, i) => {
            const r = 3 + Math.min(s.distance / 8, 1) * 5
            const cx = xScale(s.date)
            const cy = yScale(s.pace)
            return (
              <motion.circle
                key={s.date + i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                cx={cx} cy={cy} r={r}
                fill={hrColor(getHR(s))}
              />
            )
          })}
        </svg>

        {tip && (() => {
          const tipX = xScale ? xScale(tip.date) : 0
          const tipY = yScale ? yScale(tip.pace) : 0
          const flip = tipX > width - 140
          return (
            <div style={{
              position: 'absolute',
              left: flip ? undefined : tipX + 10,
              right: flip ? width - tipX + 10 : undefined,
              top: Math.max(tipY - 10, 0),
              background: SURFACE, border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, padding: '8px 12px',
              zIndex: 100, pointerEvents: 'none', minWidth: 130,
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: TEXT, marginBottom: 4 }}>{tip.date}</p>
              <p style={{ fontSize: 10, color: hrColor(getHR(tip)), margin: 0 }}>{tip.distance}mi · HR {getHR(tip)}</p>
              <p style={{ fontSize: 10, color: QUIET, margin: '2px 0 0' }}>{tip.pace} min/mi</p>
            </div>
          )
        })()}
      </div>

      {!compact && (
        <div style={{ display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
          {[['HR 130–137', '#27C48A'], ['HR 138–143', '#0681fc'], ['HR 144–148', 'rgba(255,255,255,0.35)']].map(([label, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ fontSize: 10, color: QUIET }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}