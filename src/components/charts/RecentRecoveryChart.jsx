import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = '#1A1A18'
const HRV_UP   = '#0681fc'
const HRV_DOWN = '#6B9EFF'
const RHR_BAD  = '#E8504A'
const RHR_GOOD = '#27C48A'

/**
 * RecentRecoveryChart — grouped bars per day, HRV + RHR deviation
 * diverging from a shared zero baseline. `compact` hides the legend
 * only — hover/tooltip stay on (see RecentActivityChart header note).
 *
 * data shape: { window, daily: [{ date, hrv_dev, rhr_dev }] }
 */
export default function RecentRecoveryChart({ data, height = 140, compact = false }) {
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

  const margin = { top: 8, right: 8, bottom: compact ? 4 : 20, left: 8 }
  const plotW  = width - margin.left - margin.right
  const plotH  = height - margin.top - margin.bottom
  const midY   = margin.top + plotH / 2

  const maxHrv = Math.max(...daily.map(d => Math.abs(d.hrv_dev ?? 0)), 6)
  const maxRhr = Math.max(...daily.map(d => Math.abs(d.rhr_dev ?? 0)), 4)

  const dayW = plotW / daily.length
  const barW = Math.max(dayW * 0.28, 2)
  const gap  = 2

  const xLeft  = (i) => margin.left + dayW * i + dayW / 2 - barW - gap / 2
  const xRight = (i) => margin.left + dayW * i + dayW / 2 + gap / 2

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const idx = Math.floor((mx - margin.left) / dayW)
    if (idx < 0 || idx >= daily.length) { setTip(null); return }
    setTip({ idx, x: margin.left + dayW * idx + dayW / 2, point: daily[idx] })
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
        <line x1={margin.left} y1={midY} x2={width - margin.right} y2={midY}
          stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

        {daily.map((d, i) => {
          const hrvH = d.hrv_dev != null ? (Math.abs(d.hrv_dev) / maxHrv) * (plotH / 2) : 0
          const rhrH = d.rhr_dev != null ? (Math.abs(d.rhr_dev) / maxRhr) * (plotH / 2) : 0
          const hrvNeg = d.hrv_dev < 0
          const rhrBad = d.rhr_dev > 0

          return (
            <g key={d.date}>
              {d.hrv_dev != null && (
                <motion.rect
                  initial={{ height: 0 }}
                  animate={{ height: hrvH }}
                  transition={{ duration: 0.4, delay: i * 0.02 }}
                  x={xLeft(i)} width={barW}
                  y={hrvNeg ? midY : midY - hrvH}
                  fill={hrvNeg ? HRV_DOWN : HRV_UP}
                  opacity={0.8}
                  rx={1}
                />
              )}
              {d.rhr_dev != null && (
                <motion.rect
                  initial={{ height: 0 }}
                  animate={{ height: rhrH }}
                  transition={{ duration: 0.4, delay: i * 0.02 + 0.05 }}
                  x={xRight(i)} width={barW}
                  y={rhrBad ? midY : midY - rhrH}
                  fill={rhrBad ? RHR_BAD : RHR_GOOD}
                  opacity={0.8}
                  rx={1}
                />
              )}
            </g>
          )
        })}
      </svg>

      {!compact && (
        <div style={{ display: 'flex', gap: 14, marginTop: 6, paddingLeft: margin.left }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, background: HRV_UP, borderRadius: 1 }} />
            <span style={{ fontSize: 10, color: QUIET }}>HRV</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, background: RHR_BAD, borderRadius: 1 }} />
            <span style={{ fontSize: 10, color: QUIET }}>RHR</span>
          </div>
        </div>
      )}

      {tip && (() => {
        const flip = tip.x > width - 130
        return (
          <div style={{
            position: 'absolute',
            left: flip ? undefined : tip.x + 8,
            right: flip ? width - tip.x + 8 : undefined,
            top: 4,
            background: SURFACE, border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '6px 10px',
            zIndex: 100, pointerEvents: 'none', minWidth: 100,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: TEXT, marginBottom: 4 }}>{tip.point.date}</p>
            <p style={{ fontSize: 10, color: tip.point.hrv_dev < 0 ? HRV_DOWN : HRV_UP, margin: 0 }}>
              HRV {tip.point.hrv_dev != null ? `${tip.point.hrv_dev > 0 ? '+' : ''}${tip.point.hrv_dev}ms` : '—'}
            </p>
            <p style={{ fontSize: 10, color: tip.point.rhr_dev > 0 ? RHR_BAD : RHR_GOOD, margin: 0 }}>
              RHR {tip.point.rhr_dev != null ? `${tip.point.rhr_dev > 0 ? '+' : ''}${tip.point.rhr_dev}bpm` : '—'}
            </p>
          </div>
        )
      })()}
    </div>
  )
}