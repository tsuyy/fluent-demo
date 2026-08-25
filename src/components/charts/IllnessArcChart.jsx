import { useMemo, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const BLUE  = '#0681fc'
const RED   = '#E8504A'
const AMBER = '#E8A23D'
const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = '#1A1A18'
const RECOVERY_TINT = 'rgba(39,196,138,0.06)'

const RECOVERY_START = '2026-02-14'
const RECOVERY_END   = '2026-02-19'

// Wrist temp heatmap cell color — recedes to near-invisible for
// no-reading / low-noise days, pops for the meaningfully elevated ones
function wristHeatColor(v) {
  if (v == null) return 'rgba(255,255,255,0.03)'
  const abs = Math.abs(v)
  if (abs < 0.3) return 'rgba(180,180,180,0.22)'
  if (abs < 0.5) return 'rgba(200,190,180,0.4)'
  if (abs < 0.8) return AMBER
  return RED
}

/**
 * IllnessArcChart — bar chart (HRV deviation) + wrist-temp heatmap strip
 * + narrative annotation layer with collision-avoided labels.
 *
 * data shape: { arc: [{ date, hrv_dev, rhr_dev, wrist_dev }], markers: [{ date, label, note }] }
 */
export default function IllnessArcChart({ data, height = 280, compact = false }) {
  const [tip, setTip] = useState(null)
  const containerRef  = useRef(null)
  const [width, setWidth] = useState(560)

  const arc     = data?.arc ?? []
  const markers = data?.markers ?? []

  const measureRef = useCallback((node) => {
    containerRef.current = node
    if (node) setWidth(node.getBoundingClientRect().width)
  }, [])

  if (!arc.length) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 12, color: QUIET }}>No data</span>
      </div>
    )
  }

  // Layout: [label row] [leader lines] [heatmap strip] [bar chart]
  const LABEL_ROW_H = compact ? 0 : 34
  const STRIP_H     = 12
  const STRIP_GAP   = 10
  const margin = {
    top: LABEL_ROW_H + STRIP_H + STRIP_GAP + (compact ? 6 : 14),
    right: 12, bottom: compact ? 10 : 28, left: 12,
  }
  const plotW = width  - margin.left - margin.right
  const plotH = height - margin.top  - margin.bottom
  const midY  = margin.top + plotH / 2

  const stripY = margin.top - STRIP_GAP - STRIP_H
  const leaderTopY = LABEL_ROW_H + 6

  const maxAbs = Math.max(...arc.map(d => Math.abs(d.hrv_dev ?? 0)), 15)
  const dayW = plotW / arc.length
  const barW = Math.max(dayW * 0.55, 2)
  const stripCellW = Math.max(dayW * 0.8, 2)

  const xCenter = (i) => margin.left + dayW * i + dayW / 2
  const barHeight  = (dev) => (Math.abs(dev) / maxAbs) * (plotH / 2)
  const barOpacity = (dev) => 0.25 + (Math.abs(dev) / maxAbs) * 0.65

  const recoveryStartIdx = arc.findIndex(d => d.date === RECOVERY_START)
  const recoveryEndIdx   = arc.findIndex(d => d.date === RECOVERY_END)
  const hasRecoveryBand  = recoveryStartIdx >= 0 && recoveryEndIdx >= 0

  // ── Label collision avoidance ──────────────────────────────────────
  // Markers can sit only days apart (Feb 8/11, Feb 20/23), far closer
  // together than a label's width. Greedy left-to-right nudge: sort by
  // ideal x, push any label that would overlap the previous one to the
  // right by the minimum safe gap. A leader line traces from the
  // (possibly shifted) label back down to the real data point so the
  // connection stays legible even when nudged.
  const MIN_LABEL_GAP = 148
  const labelLayout = useMemo(() => {
    const withX = markers
      .map(m => {
        const idx = arc.findIndex(d => d.date === m.date)
        return idx < 0 ? null : { ...m, idx, idealX: xCenter(idx) }
      })
      .filter(Boolean)
      .sort((a, b) => a.idealX - b.idealX)

    let prevX = -Infinity
    withX.forEach(m => {
      m.labelX = Math.max(m.idealX, prevX + MIN_LABEL_GAP)
      prevX = m.labelX
    })
    // Clamp the rightmost label back inside the chart if it overflowed
    const overflow = prevX - (width - margin.right - 70)
    if (overflow > 0) {
      withX.forEach(m => { m.labelX -= overflow })
    }
    return withX
  }, [markers, arc, width])

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const idx = Math.floor((mx - margin.left) / dayW)
    if (idx < 0 || idx >= arc.length) { setTip(null); return }
    setTip({ idx, x: xCenter(idx), point: arc[idx] })
  }, [arc, dayW, margin.left])

  return (
    <div ref={measureRef} style={{ width: '100%', position: 'relative' }}>
      <svg
        width="100%" height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTip(null)}
        style={{ cursor: 'crosshair', overflow: 'visible' 
        }}
      >
        {/* Recovery band */}
        {hasRecoveryBand && (
          <>
            <rect
              x={xCenter(recoveryStartIdx) - dayW / 2}
              y={margin.top}
              width={xCenter(recoveryEndIdx) - xCenter(recoveryStartIdx) + dayW}
              height={plotH}
              fill={RECOVERY_TINT}
            />
            {!compact && (
              <text
                x={(xCenter(recoveryStartIdx) + xCenter(recoveryEndIdx)) / 2}
                y={height - 8}
                textAnchor="middle" fill="rgba(39,196,138,0.5)" fontSize={9} fontStyle="italic"
              >
                apparent recovery
              </text>
            )}
          </>
        )}

        {/* Baseline */}
        <line x1={margin.left} y1={midY} x2={width - margin.right} y2={midY}
          stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

        {/* Wrist temp heatmap strip — continuous track, missing days nearly invisible */}
        {arc.map((d, i) => (
          <rect
            key={`heat-${d.date}`}
            x={xCenter(i) - stripCellW / 2}
            y={stripY}
            width={stripCellW}
            height={STRIP_H}
            rx={2}
            fill={wristHeatColor(d.wrist_dev)}
          />
        ))}

        {/* HRV bars */}
        {arc.map((d, i) => {
          if (d.hrv_dev == null) return null
          const isNeg = d.hrv_dev < 0
          const h = barHeight(d.hrv_dev)
          const x = xCenter(i) - barW / 2
          return (
            <motion.rect
              key={d.date}
              initial={{ height: 0 }}
              animate={{ height: h }}
              transition={{ duration: 0.4, delay: i * 0.012 }}
              x={x} y={isNeg ? midY : midY - h}
              width={barW}
              fill={isNeg ? RED : BLUE}
              opacity={barOpacity(d.hrv_dev)}
              rx={1}
            />
          )
        })}

        {/* Leader lines: label → real data point, only diagonal if nudged */}
        {!compact && labelLayout.map(m => (
          <g key={`leader-${m.date}`}>
            {Math.abs(m.labelX - m.idealX) > 2 && (
              <line
                x1={m.labelX} y1={leaderTopY}
                x2={m.idealX} y2={leaderTopY + 10}
                stroke="rgba(255,255,255,0.15)" strokeWidth={1}
              />
            )}
            <line
              x1={m.idealX} y1={leaderTopY + (Math.abs(m.labelX - m.idealX) > 2 ? 10 : 0)}
              x2={m.idealX} y2={height - margin.bottom}
              stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="3 3"
            />
          </g>
        ))}
      </svg>

      {/* HTML annotation labels — single row, collision-avoided */}
      {!compact && labelLayout.map(m => {
        const point = arc[m.idx]
        const statLine = m.note ?? [
          point.hrv_dev != null ? `HRV ${point.hrv_dev > 0 ? '+' : ''}${point.hrv_dev}ms` : null,
          point.wrist_dev != null ? `wrist ${point.wrist_dev > 0 ? '+' : ''}${point.wrist_dev}°` : null,
        ].filter(Boolean).join(' · ')

        return (
          <div
            key={`label-${m.date}`}
            style={{
              position: 'absolute',
              left: m.labelX,
              top: 0,
              transform: 'translateX(-50%)',
              width: 140,
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <p style={{ fontSize: 10, fontWeight: 600, color: TEXT, margin: 0, lineHeight: 1.3 }}>
              {m.label}
            </p>
            <p style={{ fontSize: 9, color: QUIET, margin: '2px 0 0', lineHeight: 1.3 }}>
              {m.date.slice(5)} · {statLine}
            </p>
          </div>
        )
      })}

      {/* Hover tooltip */}
      {tip && (() => {
        const flip = tip.x > width - 160
        return (
          <div style={{
            position: 'absolute',
            left: flip ? undefined : tip.x + 10,
            right: flip ? width - tip.x + 10 : undefined,
            top: margin.top - STRIP_GAP - STRIP_H - 4,
            background: SURFACE, border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '8px 12px',
            zIndex: 100, pointerEvents: 'none', minWidth: 120,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: TEXT, marginBottom: 6 }}>
              {tip.point.date}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 2 }}>
              <span style={{ fontSize: 10, color: tip.point.hrv_dev < 0 ? RED : BLUE }}>HRV</span>
              <span style={{ fontSize: 10, color: TEXT }}>
                {tip.point.hrv_dev != null ? `${tip.point.hrv_dev > 0 ? '+' : ''}${tip.point.hrv_dev}ms` : '—'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontSize: 10, color: 'rgba(200,200,200,0.7)' }}>Wrist</span>
              <span style={{ fontSize: 10, color: TEXT }}>
                {tip.point.wrist_dev != null ? `${tip.point.wrist_dev > 0 ? '+' : ''}${tip.point.wrist_dev}°` : 'no reading'}
              </span>
            </div>
          </div>
        )
      })()}

      {/* Legend */}
      {!compact && <div style={{ display: 'flex', gap: 16, marginTop: 8, paddingLeft: margin.left, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, background: RED, opacity: 0.7, borderRadius: 1 }} />
          <span style={{ fontSize: 10, color: QUIET }}>HRV below baseline</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, background: BLUE, opacity: 0.7, borderRadius: 1 }} />
          <span style={{ fontSize: 10, color: QUIET }}>HRV above baseline</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 8, background: RED, borderRadius: 1 }} />
          <span style={{ fontSize: 10, color: QUIET }}>Wrist temp elevated</span>
        </div>
      </div>}
    </div>
  )
}