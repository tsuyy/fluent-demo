import { useState, useRef, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = '#1A1A18'
const BLUE = '#0681fc'
const GREY = 'rgba(255,255,255,0.22)'

/**
 * CyclingAdaptationChart — scatter of individual rides, speed vs date.
 * `in_zone` rides (the same 140-155bpm band used for the year-over-
 * year comparison) render in blue; everything else greys out —
 * showing the full ride history honestly while still making clear
 * which points the "same effort, more speed" claim is actually
 * built from.
 *
 * data shape (cycling_long_rides.json): { sessions: [{ date, year,
 *   hr_avg, speed_mph, distance, duration, ride_type }] }
 *
 * NOTE: this reads cycling_long_rides.json, NOT cycling_efficiency.json
 * (which only has yearly aggregates — year_summary/zone_controlled —
 * no individual rides). in_zone is computed here from hr_avg against
 * the 140-155bpm band since the real export doesn't include that
 * field directly.
 */
export default function CyclingAdaptationChart({ data, height = 200, compact = false }) {
  const [tip, setTip] = useState(null)
  const containerRef  = useRef(null)
  const [width, setWidth] = useState(320)

  // Reads cycling_long_rides.json's `sessions` array — NOT
  // cycling_efficiency.json, which only has yearly aggregates
  // (year_summary/zone_controlled), no individual rides.
  const HR_ZONE_MIN = 140, HR_ZONE_MAX = 155
  const rawSessions = data?.sessions ?? []
  const rides = rawSessions.map(s => ({
    ...s,
    // in_zone doesn't exist in this file — derive it from hr_avg
    // against the documented 140-155bpm zone-controlled band.
    in_zone: s.hr_avg >= HR_ZONE_MIN && s.hr_avg <= HR_ZONE_MAX,
  }))

  const measureRef = useCallback((node) => {
    containerRef.current = node
    if (node) setWidth(node.getBoundingClientRect().width)
  }, [])

  const margin = { top: 24, right: 12, bottom: compact ? 24 : 32, left: 32 }
  const plotW = width - margin.left - margin.right
  const plotH = height - margin.top - margin.bottom

  const { xScale, yScale, regression } = useMemo(() => {
    if (!rides.length) return { xScale: null, yScale: null, regression: null }
    const dates = rides.map(r => new Date(r.date).getTime())
    const speeds = rides.map(r => r.speed_mph)
    const minDate = Math.min(...dates), maxDate = Math.max(...dates)
    const minSpeed = Math.min(...speeds) - 1, maxSpeed = Math.max(...speeds) + 1

    const xScale = (d) => margin.left + ((new Date(d).getTime() - minDate) / (maxDate - minDate)) * plotW
    const yScale = (s) => margin.top + plotH - ((s - minSpeed) / (maxSpeed - minSpeed)) * plotH

    // Regression on in_zone rides only — that's the actual comparison
    const zoned = rides.filter(r => r.in_zone)
    let regression = null
    if (zoned.length > 1) {
      const zDates = zoned.map(r => new Date(r.date).getTime())
      const zSpeeds = zoned.map(r => r.speed_mph)
      const xs = zDates.map(d => (d - minDate) / (maxDate - minDate))
      const n = xs.length
      const xMean = xs.reduce((a, b) => a + b, 0) / n
      const yMean = zSpeeds.reduce((a, b) => a + b, 0) / n
      const num = xs.reduce((sum, x, i) => sum + (x - xMean) * (zSpeeds[i] - yMean), 0)
      const den = xs.reduce((sum, x) => sum + (x - xMean) ** 2, 0)
      const slope = den !== 0 ? num / den : 0
      const intercept = yMean - slope * xMean
      regression = {
        x1: margin.left, y1: yScale(intercept),
        x2: margin.left + plotW, y2: yScale(intercept + slope),
      }
    }
    return { xScale, yScale, regression }
  }, [rides, plotW, plotH, margin.left, margin.top])

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || !xScale) return
    const rect = containerRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    let closest = null, minDist = Infinity
    rides.forEach(r => {
      const dx = Math.abs(xScale(r.date) - mx)
      if (dx < minDist) { minDist = dx; closest = r }
    })
    if (closest && minDist < 15) setTip(closest)
    else setTip(null)
  }, [rides, xScale])

  if (!rides.length) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 12, color: QUIET }}>Needs cycling_long_rides.json's sessions array</span>
      </div>
    )
  }

  const zonedRides = rides.filter(r => r.in_zone)
  const first = zonedRides[0], last = zonedRides[zonedRides.length - 1]
  const pctChange = first && last ? Math.round(((last.speed_mph - first.speed_mph) / first.speed_mph) * 100) : null

  return (
    <div style={{ width: '100%' }}>
      {!compact && pctChange != null && (
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 600, color: BLUE }}>+{pctChange}%</span>
          <span style={{ fontSize: 12, color: QUIET, marginLeft: 6 }}>faster at the same heart rate</span>
        </div>
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
            <line x1={regression.x1} y1={regression.y1} x2={regression.x2} y2={regression.y2}
              stroke="rgba(6,129,252,0.35)" strokeWidth={1.5} strokeDasharray="4 4" />
          )}
          {rides.map((r, i) => (
            <motion.circle
              key={r.date + i}
              initial={{ opacity: 0 }}
              animate={{ opacity: r.in_zone ? 0.85 : 0.35 }}
              transition={{ duration: 0.3, delay: i * 0.008 }}
              cx={xScale(r.date)} cy={yScale(r.speed_mph)}
              r={r.in_zone ? 3.5 : 2.5}
              fill={r.in_zone ? BLUE : GREY}
            />
          ))}
        </svg>

        {tip && (
          <div style={{
            position: 'absolute', top: 4, right: 4,
            background: SURFACE, border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '8px 12px',
            zIndex: 100, pointerEvents: 'none', minWidth: 130,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: TEXT, marginBottom: 4 }}>{tip.date}</p>
            <p style={{ fontSize: 10, color: tip.in_zone ? BLUE : GREY, margin: 0 }}>
              {tip.speed_mph} mph at HR {tip.hr_avg}
            </p>
            <p style={{ fontSize: 9, color: QUIET, margin: '4px 0 0' }}>
              {tip.distance}mi · {tip.duration}min {tip.in_zone ? '· zone-controlled' : ''}
            </p>
          </div>
        )}
      </div>

      {!compact && (
        <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: BLUE }} />
            <span style={{ fontSize: 10, color: QUIET }}>Zone-controlled (HR 140–155)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREY }} />
            <span style={{ fontSize: 10, color: QUIET }}>Other rides</span>
          </div>
        </div>
      )}
    </div>
  )
}