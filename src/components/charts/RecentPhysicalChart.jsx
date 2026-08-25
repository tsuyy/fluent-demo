import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = '#1A1A18'
const BLUE = '#0681fc'
const RED  = '#E8504A'

// Same heat-color convention as IllnessArcChart's wrist strip —
// rectangles, not dots, so the two charts read as one visual family.
function wristHeatColor(v) {
  if (v == null) return 'rgba(255,255,255,0.03)'
  const abs = Math.abs(v)
  if (abs < 0.3) return 'rgba(180,180,180,0.22)'
  if (abs < 0.5) return 'rgba(200,190,180,0.4)'
  if (abs < 0.8) return '#E8A23D'
  return RED
}

/**
 * RecentPhysicalChart — HRV bars + wrist temp heatmap strip. No
 * convergence markers (Mode 2/3 — nothing to mark; the absence of
 * a colored cluster in the strip IS the evidence).
 *
 * data shape: { window, daily: [{ date, hrv_dev, wrist_dev }] }
 */
export default function RecentPhysicalChart({ data, height = 140, compact = false }) {
  const [tip, setTip] = useState(null)
  const containerRef  = useRef(null)
  const [width, setWidth] = useState(480)

  const daily = data?.daily ?? []

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
  const midY  = margin.top + plotH / 2

  const maxAbs = Math.max(...daily.map(d => Math.abs(d.hrv_dev ?? 0)), 10)
  const dayW = plotW / daily.length
  const barW = Math.max(dayW * 0.55, 3)
  const stripCellW = Math.max(dayW * 0.8, 3)

  const xCenter = (i) => margin.left + dayW * i + dayW / 2
  const hasAnyWrist = daily.some(d => d.wrist_dev != null)

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
        {/* Wrist temp heatmap strip — rectangles, matching IllnessArcChart */}
        {daily.map((d, i) => (
          <rect
            key={`heat-${d.date}`}
            x={xCenter(i) - stripCellW / 2} y={0}
            width={stripCellW} height={STRIP_H}
            rx={1.5}
            fill={wristHeatColor(d.wrist_dev)}
          />
        ))}

        <line x1={margin.left} y1={midY} x2={width - margin.right} y2={midY}
          stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

        {daily.map((d, i) => {
          if (d.hrv_dev == null) return null
          const isNeg = d.hrv_dev < 0
          const h = (Math.abs(d.hrv_dev) / maxAbs) * (plotH / 2)
          return (
            <motion.rect
              key={d.date}
              initial={{ height: 0 }}
              animate={{ height: h }}
              transition={{ duration: 0.4, delay: i * 0.02 }}
              x={xCenter(i) - barW / 2}
              y={isNeg ? midY : midY - h}
              width={barW}
              fill={isNeg ? RED : BLUE}
              opacity={0.5 + (Math.abs(d.hrv_dev) / maxAbs) * 0.4}
              rx={1}
            />
          )
        })}
      </svg>

      {!compact && (
        <p style={{ fontSize: 9, color: QUIET, marginTop: 4, paddingLeft: margin.left }}>
          {hasAnyWrist ? 'strip = wrist temperature deviation' : 'no wrist temperature sensor on this device'}
        </p>
      )}

      {tip && (() => {
        const flip = tip.x > width - 130
        return (
          <div style={{
            position: 'absolute',
            left: flip ? undefined : tip.x + 8,
            right: flip ? width - tip.x + 8 : undefined,
            top: STRIP_H + STRIP_GAP + 4,
            background: SURFACE, border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '6px 10px',
            zIndex: 100, pointerEvents: 'none', minWidth: 100,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: TEXT, marginBottom: 4 }}>{tip.point.date}</p>
            <p style={{ fontSize: 10, color: tip.point.hrv_dev < 0 ? RED : BLUE, margin: 0 }}>
              HRV {tip.point.hrv_dev != null ? `${tip.point.hrv_dev > 0 ? '+' : ''}${tip.point.hrv_dev}ms` : '—'}
            </p>
            <p style={{ fontSize: 10, color: 'rgba(200,200,200,0.7)', margin: 0 }}>
              Wrist {tip.point.wrist_dev != null ? `${tip.point.wrist_dev > 0 ? '+' : ''}${tip.point.wrist_dev}°` : 'no reading'}
            </p>
          </div>
        )
      })()}
    </div>
  )
}