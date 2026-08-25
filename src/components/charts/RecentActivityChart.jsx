import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = '#1A1A18'
const BAR_COLOR = 'rgba(6,129,252,0.55)'

/**
 * RecentActivityChart — active_cal bars vs personal baseline, with a
 * thin HRV-deviation strip above each bar (blue = above baseline,
 * red = below, opacity scaling with magnitude).
 *
 * `compact` only hides the caption/legend text below the chart —
 * hover and tooltips stay on regardless, since these charts are read
 * inside an expanded panel (not a tappable thumbnail), and without
 * visible axis labels, hover is how you figure out what's shown.
 *
 * data shape: { window, daily: [{ date, hrv_dev, active_cal }], baseline_active_cal }
 */
export default function RecentActivityChart({ data, height = 140, compact = false }) {
  const [tip, setTip] = useState(null)
  const containerRef  = useRef(null)
  const [width, setWidth] = useState(480)

  const daily    = data?.daily ?? []
  const baseline = data?.baseline_active_cal

  const measureRef = useCallback((node) => {
    containerRef.current = node
    if (node) setWidth(node.getBoundingClientRect().width)
  }, [])

  if (!daily.length) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 12, color: QUIET }}>No data</span>
      </div>
    )
  }

  const STRIP_H = compact ? 8 : 10
  const STRIP_GAP = 6
  const margin = { top: STRIP_H + STRIP_GAP + 4, right: 8, bottom: compact ? 4 : 20, left: 8 }
  const plotW = width - margin.left - margin.right
  const plotH = height - margin.top - margin.bottom

  const maxCal = Math.max(...daily.map(d => d.active_cal ?? 0), baseline ?? 0) * 1.1
  const dayW = plotW / daily.length
  const barW = Math.max(dayW * 0.6, 3)

  const xCenter = (i) => margin.left + dayW * i + dayW / 2
  const baselineY = margin.top + plotH - ((baseline ?? 0) / maxCal) * plotH

  function hrvStripColor(v) {
    if (v == null) return 'rgba(255,255,255,0.04)'
    const isNeg = v < 0
    const abs = Math.min(Math.abs(v), 10) / 10
    return isNeg
      ? `rgba(232,80,74,${0.25 + abs * 0.6})`
      : `rgba(6,129,252,${0.25 + abs * 0.6})`
  }

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const idx = Math.floor((mx - margin.left) / dayW)
    if (idx < 0 || idx >= daily.length) { setTip(null); return }
    setTip({ idx, x: xCenter(idx), point: daily[idx] })
  }, [daily, dayW, margin.left])

  return (
    <div ref={measureRef} style={{ width: '100%', position: 'relative' }}>
      <svg
        width="100%" height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTip(null)}
        style={{ cursor: 'crosshair', overflow: 'visible' }}
      >
        {daily.map((d, i) => (
          <rect
            key={`strip-${d.date}`}
            x={xCenter(i) - barW / 2} y={0}
            width={barW} height={STRIP_H}
            rx={1.5}
            fill={hrvStripColor(d.hrv_dev)}
          />
        ))}

        {baseline != null && (
          <line
            x1={margin.left} y1={baselineY} x2={width - margin.right} y2={baselineY}
            stroke="rgba(255,255,255,0.25)" strokeWidth={1} strokeDasharray="4 4"
          />
        )}

        {daily.map((d, i) => {
          if (d.active_cal == null) return null
          const h = (d.active_cal / maxCal) * plotH
          return (
            <motion.rect
              key={d.date}
              initial={{ height: 0 }}
              animate={{ height: h }}
              transition={{ duration: 0.4, delay: i * 0.02 }}
              x={xCenter(i) - barW / 2}
              y={margin.top + plotH - h}
              width={barW}
              fill={BAR_COLOR}
              rx={1.5}
            />
          )
        })}
      </svg>

      {!compact && baseline != null && (
        <p style={{ fontSize: 9, color: QUIET, marginTop: 4, paddingLeft: margin.left }}>
          dashed = {baseline} cal/day personal baseline
        </p>
      )}

      {tip && (() => {
        const flip = tip.x > width - 140
        return (
          <div style={{
            position: 'absolute',
            left: flip ? undefined : tip.x + 8,
            right: flip ? width - tip.x + 8 : undefined,
            top: 4,
            background: SURFACE, border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '6px 10px',
            zIndex: 100, pointerEvents: 'none', minWidth: 110,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: TEXT, marginBottom: 4 }}>{tip.point.date}</p>
            <p style={{ fontSize: 10, color: 'rgba(6,129,252,0.9)', margin: 0 }}>
              {tip.point.active_cal != null ? `${tip.point.active_cal} cal` : 'no data'}
            </p>
            <p style={{ fontSize: 10, color: tip.point.hrv_dev < 0 ? '#E8504A' : '#0681fc', margin: 0 }}>
              HRV {tip.point.hrv_dev != null ? `${tip.point.hrv_dev > 0 ? '+' : ''}${tip.point.hrv_dev}ms` : '—'}
            </p>
          </div>
        )
      })()}
    </div>
  )
}