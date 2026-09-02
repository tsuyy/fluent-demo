import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = '#1A1A18'
const BLUE = '#0681fc'
const MUTED = 'rgba(255,255,255,0.2)'
const RED = '#E8504A'

/**
 * SleepRegularityChart — bedtime histogram. Every 30-min bucket gets
 * a rotated time label below its bar (no sparse/every-Nth filtering —
 * that's what left labels looking absent before). The tallest bar
 * gets a "27%" callout above it; per-bar counts live in the tooltip
 * only, not as always-visible text (that was cluttering the chart
 * in an earlier pass).
 *
 * data shape: { buckets: [{ label, hour, count, pct, is_anchor, is_late }] }
 */
export default function SleepRegularityChart({ data, height = 180, compact = false }) {
  const [tip, setTip] = useState(null)
  const containerRef  = useRef(null)
  const [width, setWidth] = useState(320)

  const buckets = data?.buckets ?? []

  const measureRef = useCallback((node) => {
    containerRef.current = node
    if (node) setWidth(node.getBoundingClientRect().width)
  }, [])

  if (!buckets.length) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 12, color: QUIET }}>Needs sleep_times.json's buckets array</span>
      </div>
    )
  }

  const margin = { top: 26, right: 8, bottom: compact ? 20 : 32, left: 8 }
  const plotW = width - margin.left - margin.right
  const plotH = height - margin.top - margin.bottom

  const maxCount = Math.max(...buckets.map(b => b.count))
  const n = buckets.length
  const barW = (plotW / n) * 0.72
  const gapW = plotW / n

  const xCenter = (i) => margin.left + gapW * i + gapW / 2
  const barColor = (b) => b.is_anchor ? BLUE : b.is_late ? RED : MUTED
  const barOpacity = (b) => b.is_anchor ? 0.7 : b.is_late ? 0.5 : 1

  const tallest = buckets.reduce((max, b) => b.count > max.count ? b : max, buckets[0])
  const tallestIdx = buckets.indexOf(tallest)
  const tallestPct = Math.round((tallest.count / buckets.reduce((s, b) => s + b.count, 0)) * 100)

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const idx = Math.floor((e.clientX - rect.left - margin.left) / gapW)
    if (idx < 0 || idx >= n) { setTip(null); return }
    setTip(buckets[idx])
  }, [buckets, gapW, margin.left, n])

  return (
    <div ref={measureRef} style={{ width: '100%', position: 'relative' }}>
      <svg
        width="100%" height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTip(null)}
        style={{ cursor: 'crosshair', overflow: 'visible' }}
      >
        {/* Annotation above tallest bar */}
        <text x={xCenter(tallestIdx)} y={margin.top - 8} textAnchor="middle" fill={BLUE} fontSize={11} fontWeight={600}>
          {tallestPct}%
        </text>

        {/* Bars */}
        {buckets.map((b, i) => {
          const h = (b.count / maxCount) * plotH
          return (
            <motion.rect
              key={b.label}
              initial={{ height: 0 }}
              animate={{ height: h }}
              transition={{ duration: 0.35, delay: i * 0.02 }}
              x={xCenter(i) - barW / 2}
              y={margin.top + plotH - h}
              width={barW} height={h}
              fill={barColor(b)}
              opacity={barOpacity(b)}
              rx={2}
            />
          )
        })}

        {/* Time labels — on-the-hour buckets only (half-hour labels
             were cluttering a 14-bucket axis), AM/PM shown only when
             the period actually changes from the previous label. */}
        {!compact && (() => {
          let prevPeriod = null
          return buckets.map((b, i) => {
            const match = b.label.match(/^(\d+):00(am|pm)$/i)
            if (!match) return null  // skip half-hour buckets entirely
            const [, hourNum, period] = match
            const showPeriod = period.toLowerCase() !== prevPeriod
            prevPeriod = period.toLowerCase()
            const displayText = showPeriod ? `${hourNum}${period.toUpperCase()}` : hourNum
            return (
              <text
                key={`label-${b.label}`}
                x={xCenter(i)}
                y={margin.top + plotH + 14}
                textAnchor="middle"
                fill={QUIET}
                fontSize={9}
              >
                {displayText}
              </text>
            )
          })
        })()}
      </svg>

      {tip && (() => {
        const tipIdx = buckets.indexOf(tip)
        const tipX = xCenter(tipIdx)
        const flip = tipX > width - 100
        return (
          <div style={{
            position: 'absolute',
            left: flip ? undefined : tipX + 10,
            right: flip ? width - tipX + 10 : undefined,
            top: 4,
            background: SURFACE, border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '6px 10px',
            zIndex: 100, pointerEvents: 'none', minWidth: 90,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: TEXT, marginBottom: 2 }}>{tip.label}</p>
            <p style={{ fontSize: 10, color: barColor(tip), margin: 0 }}>{tip.count} nights</p>
          </div>
        )
      })()}
    </div>
  )
}