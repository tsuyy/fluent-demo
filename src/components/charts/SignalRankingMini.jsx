import { useState, useMemo, useRef, useCallback } from 'react'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = '#1A1A18'
const ACCENT = '#0681fc'

// Alert thresholds already used elsewhere in the build — reused here
// so "how close to notable" has a consistent meaning across the app,
// not a fresh number invented for this one chart.
const THRESHOLDS = { hrv: 8, rhr: 5, wrist: 0.8, sleep: 10, cal: 0.2 }

/**
 * SignalRankingMini — simplified stand-in for the spec's full 90-day
 * rolling-baseline signal ranking. That would need a live baseline
 * service; this instead normalizes each signal's 14-day average
 * deviation against its own known alert threshold (same thresholds
 * used in illness_arc / overtraining detection elsewhere) and shows
 * the two signals closest to being notable. Real data, simplified math
 * — flagged here rather than presented as the literal spec mechanism.
 */
export default function SignalRankingMini({ activity, recovery, physical, sleep, height = 70 }) {
  const [tip, setTip] = useState(null)
  const containerRef = useRef(null)

  const ranked = useMemo(() => {
    const mean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
    const abs  = (arr) => arr.map(v => Math.abs(v))

    const hrvVals = (recovery?.daily ?? []).map(d => d.hrv_dev).filter(v => v != null)
    const rhrVals = (recovery?.daily ?? []).map(d => d.rhr_dev).filter(v => v != null)
    const wristVals = (physical?.daily ?? []).map(d => d.wrist_dev).filter(v => v != null)
    const calDevs = (activity?.daily ?? [])
      .filter(d => d.active_cal != null && activity?.baseline_active_cal)
      .map(d => (d.active_cal - activity.baseline_active_cal) / activity.baseline_active_cal)
    const sleepDevs = (sleep?.quality?.nightly ?? []).slice(-14)
      .map(n => n.efficiency - 85)

    const signals = [
      { key: 'hrv',   label: 'HRV',              score: mean(abs(hrvVals))   / THRESHOLDS.hrv,   series: hrvVals,   unit: 'ms', dir: 'dev' },
      { key: 'rhr',   label: 'Resting HR',       score: mean(abs(rhrVals))   / THRESHOLDS.rhr,   series: rhrVals,   unit: 'bpm', dir: 'dev' },
      { key: 'wrist', label: 'Wrist temp',       score: mean(abs(wristVals)) / THRESHOLDS.wrist, series: wristVals, unit: '°', dir: 'dev' },
      { key: 'sleep', label: 'Sleep efficiency', score: mean(abs(sleepDevs)) / THRESHOLDS.sleep, series: sleepDevs, unit: 'pts', dir: 'dev' },
      { key: 'cal',   label: 'Active calories',  score: mean(abs(calDevs))   / THRESHOLDS.cal,   series: calDevs.map(v => v * 100), unit: '%', dir: 'dev' },
    ]

    return signals.sort((a, b) => b.score - a.score).slice(0, 2)
  }, [activity, recovery, physical, sleep])

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {ranked.map(sig => (
        <SignalSparkline key={sig.key} sig={sig} height={height} />
      ))}
    </div>
  )
}

function SignalSparkline({ sig, height }) {
  const [tip, setTip] = useState(null)
  const containerRef = useRef(null)
  const [width, setWidth] = useState(300)

  const measureRef = useCallback((node) => {
    containerRef.current = node
    if (node) setWidth(node.getBoundingClientRect().width)
  }, [])

  const series = sig.series
  if (!series.length) return null

  const max = Math.max(...series.map(Math.abs), 1)
  const dayW = width / series.length
  const midY = height / 2

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const idx = Math.floor((e.clientX - rect.left) / dayW)
    if (idx < 0 || idx >= series.length) { setTip(null); return }
    setTip({ x: dayW * idx + dayW / 2, value: series[idx] })
  }, [series, dayW])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: QUIET }}>{sig.label}</span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>past 14 days</span>
      </div>
      <div ref={measureRef} style={{ width: '100%', height, position: 'relative' }}>
        <svg
          width="100%" height={height}
          viewBox={`0 0 ${width} ${height}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTip(null)}
          style={{ cursor: 'crosshair', overflow: 'visible' }}
        >
          <line x1={0} y1={midY} x2={width} y2={midY} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
          {series.map((v, i) => {
            const h = (Math.abs(v) / max) * (height / 2 - 4)
            const isNeg = v < 0
            return (
              <rect
                key={i}
                x={dayW * i + dayW * 0.15} y={isNeg ? midY : midY - h}
                width={dayW * 0.7} height={h}
                fill={isNeg ? '#E8504A' : ACCENT}
                opacity={0.6}
                rx={1}
              />
            )
          })}
        </svg>
        {tip && (
          <div style={{
            position: 'absolute',
            left: Math.min(tip.x + 8, width - 80), top: 0,
            background: SURFACE, border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6, padding: '4px 8px',
            fontSize: 10, color: TEXT, pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}>
            {tip.value > 0 ? '+' : ''}{tip.value.toFixed(1)}{sig.unit}
          </div>
        )}
      </div>
    </div>
  )
}