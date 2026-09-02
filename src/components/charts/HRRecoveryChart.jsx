import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = '#1A1A18'
const LATE_COLOR  = 'rgba(39,196,138,0.4)'   // 60s point
const FINAL_COLOR = '#27C48A'                 // 90s point

// Real data — sorted descending by 90s recovery, so the sport with
// the most total heart-rate drop reads first.
const HR_RECOVERY_DATA = [
  { sport: 'Running',  hrr1: 29.1, hrr2: 42.9 },
  { sport: 'Strength', hrr1: 31.3, hrr2: 36.1 },
  { sport: 'Tennis',   hrr1: 28.5, hrr2: 31.4 },
  { sport: 'Cycling',  hrr1: 24.8, hrr2: 30.6 },
  { sport: 'Skiing',   hrr1: 20.1, hrr2: 26.8 },
]

/**
 * HRRecoveryChart — slope/dumbbell chart replacing the grouped-bar
 * version. Two nearly-identical bar heights per sport didn't give
 * the eye much to compare; a line connecting the 60s point to the
 * 90s point makes the CONTINUED recovery between those two moments
 * the visual story — steeper slope = more recovery still happening
 * after the first minute.
 */
export default function HRRecoveryChart({ height = 200, compact = false }) {
  const [tip, setTip] = useState(null)
  const containerRef  = useRef(null)
  const [width, setWidth] = useState(480)

  const measureRef = useCallback((node) => {
    containerRef.current = node
    if (node) setWidth(node.getBoundingClientRect().width)
  }, [])

  const margin = { top: 12, right: compact ? 16 : 56, bottom: 12, left: compact ? 60 : 76 }
  const plotW = width - margin.left - margin.right
  const plotH = height - margin.top - margin.bottom

  const maxVal = Math.max(...HR_RECOVERY_DATA.map(d => d.hrr2)) * 1.1
  const rowH = plotH / HR_RECOVERY_DATA.length
  const xFor = (v) => margin.left + (v / maxVal) * plotW
  const yFor = (i) => margin.top + rowH * i + rowH / 2

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const my = e.clientY - rect.top
    const idx = Math.floor((my - margin.top) / rowH)
    if (idx < 0 || idx >= HR_RECOVERY_DATA.length) { setTip(null); return }
    setTip({ idx, sport: HR_RECOVERY_DATA[idx] })
  }, [rowH, margin.top])

  return (
    <div ref={measureRef} style={{ width: '100%', position: 'relative' }}>
      <svg
        width="100%" height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTip(null)}
        style={{ cursor: 'crosshair', overflow: 'visible' }}
      >
        {HR_RECOVERY_DATA.map((d, i) => {
          const y = yFor(i)
          const x1 = xFor(d.hrr1), x2 = xFor(d.hrr2)
          return (
            <g key={d.sport}>
              <text x={margin.left - 10} y={y + 4} textAnchor="end" fill={TEXT} fontSize={11}>
                {d.sport}
              </text>

              <motion.line
                initial={{ x2: x1 }}
                animate={{ x2 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                x1={x1} y1={y} y2={y}
                stroke="rgba(39,196,138,0.25)" strokeWidth={2}
              />

              <motion.circle
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                cx={x1} cy={y} r={4} fill={LATE_COLOR}
              />
              <motion.circle
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 + 0.1 }}
                cx={x2} cy={y} r={5} fill={FINAL_COLOR}
              />

              {!compact && (
                <text x={x2 + 10} y={y + 4} fill={QUIET} fontSize={10}>
                  −{d.hrr2} bpm
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {!compact && (
        <div style={{ display: 'flex', gap: 14, marginTop: 10, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: LATE_COLOR }} />
            <span style={{ fontSize: 10, color: QUIET }}>60 sec</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: FINAL_COLOR }} />
            <span style={{ fontSize: 10, color: QUIET }}>90 sec</span>
          </div>
        </div>
      )}

      {tip && (() => {
        const y = yFor(tip.idx)
        const flip = y > height - 60
        return (
          <div style={{
            position: 'absolute',
            left: margin.left,
            top: flip ? y - 56 : y + 12,
            background: SURFACE, border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '8px 12px',
            zIndex: 100, pointerEvents: 'none', minWidth: 110,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: TEXT, marginBottom: 4 }}>{tip.sport.sport}</p>
            <p style={{ fontSize: 10, color: LATE_COLOR, margin: 0 }}>60s: −{tip.sport.hrr1} bpm</p>
            <p style={{ fontSize: 10, color: FINAL_COLOR, margin: '2px 0 0' }}>90s: −{tip.sport.hrr2} bpm</p>
          </div>
        )
      })()}
    </div>
  )
}