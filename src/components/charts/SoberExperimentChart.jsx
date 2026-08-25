import { useMemo, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const HRV_COLOR = '#0681fc'
const QUIET     = 'var(--color-quiet, #888780)'
const TEXT      = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE   = '#1A1A18'

const PHASE_COLORS = {
  before:      'rgba(255,255,255,0.03)',
  during:      'rgba(39,196,138,0.08)',
  after_clean: 'rgba(6,129,252,0.06)',
  after_dirty: 'rgba(232,80,74,0.06)',
}

/**
 * SoberExperimentChart — HRV line across before/during/after-clean/after-dirty
 * phases, shaded background regions, vertical event markers, two dashed
 * baseline references.
 *
 * data shape:
 *   {
 *     phases: { before: {...}, during: {...}, after_clean: {...}, after_dirty: {...} },
 *     dirty_dates: [...],
 *     daily: [{ date, hrv, hrv_dev, phase }],
 *     markers: [{ date, label }]
 *   }
 */
export default function SoberExperimentChart({ data, height = 240, compact = false }) {
  const [tip, setTip] = useState(null)
  const containerRef  = useRef(null)
  const [width, setWidth] = useState(560)

  const daily   = data?.daily ?? []
  const markers = data?.markers ?? []
  const phases  = data?.phases ?? {}

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

  const margin = { top: compact ? 8 : 32, right: 20, bottom: compact ? 6 : 32, left: compact ? 4 : 40 }
  const plotW  = width  - margin.left - margin.right
  const plotH  = height - margin.top  - margin.bottom

  const hrvValues = daily.map(d => d.hrv).filter(v => v != null)
  const yMin = Math.min(...hrvValues) - 4
  const yMax = Math.max(...hrvValues) + 4

  const xScale = (i) => margin.left + (i / (daily.length - 1)) * plotW
  const yScale = (v) => margin.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH

  const linePath = daily
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(1)} ${yScale(d.hrv).toFixed(1)}`)
    .join(' ')

  // Phase background bands — find index ranges per phase
  const phaseBands = useMemo(() => {
    const bands = []
    let currentPhase = daily[0]?.phase
    let start = 0
    daily.forEach((d, i) => {
      if (d.phase !== currentPhase) {
        bands.push({ phase: currentPhase, start, end: i - 1 })
        currentPhase = d.phase
        start = i
      }
    })
    bands.push({ phase: currentPhase, start, end: daily.length - 1 })
    return bands
  }, [daily])

  const beforeBaseline = phases?.before?.hrv_avg
  const duringAvg      = phases?.during?.hrv_avg

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const relX = (mx - margin.left) / plotW
    const idx = Math.round(relX * (daily.length - 1))
    if (idx < 0 || idx >= daily.length) { setTip(null); return }
    setTip({ idx, x: xScale(idx), point: daily[idx] })
  }, [daily, plotW, margin.left])

  return (
    <div ref={measureRef} style={{ width: '100%', position: 'relative' }}>
      <svg
        width="100%" height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTip(null)}
        style={{ cursor: 'crosshair', overflow: 'visible' }}
      >
        {/* Phase background bands */}
        {phaseBands.map((band, i) => (
          <rect
            key={i}
            x={xScale(band.start)}
            y={margin.top}
            width={xScale(band.end) - xScale(band.start)}
            height={plotH}
            fill={PHASE_COLORS[band.phase] || 'transparent'}
          />
        ))}

        {/* Phase labels */}
        {!compact && phaseBands.filter(b => ['before', 'during'].includes(b.phase) ||
          (b.phase === 'after_clean' && phaseBands.findIndex(x => x.phase.startsWith('after')) === phaseBands.indexOf(b))
        ).map((band, i) => {
          const midX = (xScale(band.start) + xScale(band.end)) / 2
          const label = band.phase === 'before' ? 'before'
            : band.phase === 'during' ? '14-day experiment'
            : 'after'
          return (
            <text key={i} x={midX} y={margin.top - 12} textAnchor="middle" fill={QUIET} fontSize={9}>
              {label}
            </text>
          )
        })}

        {/* Baseline reference lines — labels anchored left, near the
             'before' phase where there's no competing content, instead
             of the right edge where they collided with the 'after'
             phase bands and clipped outside the chart. */}
        {beforeBaseline != null && (
          <>
            <line x1={margin.left} y1={yScale(beforeBaseline)} x2={width - margin.right} y2={yScale(beforeBaseline)}
              stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="4 4" />
            {!compact && (
              <text x={margin.left + 4} y={yScale(beforeBaseline) - 4} textAnchor="start" fill={QUIET} fontSize={9}>
                {beforeBaseline}ms before baseline
              </text>
            )}
          </>
        )}
        {duringAvg != null && (
          <>
            <line x1={margin.left} y1={yScale(duringAvg)} x2={width - margin.right} y2={yScale(duringAvg)}
              stroke="rgba(39,196,138,0.3)" strokeWidth={1} strokeDasharray="4 4" />
            {!compact && (
              <text x={margin.left + 4} y={yScale(duringAvg) - 4} textAnchor="start" fill="rgba(39,196,138,0.6)" fontSize={9}>
                {duringAvg}ms during avg
              </text>
            )}
          </>
        )}

        {/* HRV line */}
        <motion.path
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          d={linePath} fill="none" stroke={HRV_COLOR} strokeWidth={2}
        />

        {/* Event markers */}
        {!compact && markers.map(m => {
          const idx = daily.findIndex(d => d.date === m.date)
          if (idx < 0) return null
          const x = xScale(idx)
          return (
            <g key={m.date}>
              <circle cx={x} cy={margin.top + plotH + 4} r={3} fill="rgba(255,255,255,0.4)" />
              <text x={x} y={height - 6} textAnchor="middle" fill={QUIET} fontSize={8}>
                {m.label}
              </text>
            </g>
          )
        })}

        {/* Hover crosshair */}
        {tip && (
          <line x1={tip.x} y1={margin.top} x2={tip.x} y2={margin.top + plotH}
            stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
        )}
      </svg>

      {/* Legend — clean vs substance days */}
      {!compact && <div style={{ display: 'flex', gap: 16, marginTop: 8, paddingLeft: margin.left }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(6,129,252,0.6)' }} />
          <span style={{ fontSize: 10, color: QUIET }}>clean days</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(232,80,74,0.6)' }} />
          <span style={{ fontSize: 10, color: QUIET }}>substance days</span>
        </div>
      </div>}

      {/* Tooltip */}
      {tip && (
        <div style={{
          position: 'absolute',
          left: Math.min(tip.x + 12, width - 140),
          top: 8,
          background: SURFACE, border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, padding: '8px 12px',
          zIndex: 100, pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
            {tip.point.date}
          </p>
          <p style={{ fontSize: 11, color: HRV_COLOR, margin: 0 }}>
            HRV: {tip.point.hrv}ms
          </p>
        </div>
      )}
    </div>
  )
}