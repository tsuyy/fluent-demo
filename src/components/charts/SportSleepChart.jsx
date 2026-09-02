import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SPORTS = [
  {
      "sport": "Tennis",
      "deep": 61.5,
      "rem": 83.5,
      "awake": 41.4,
      "total": 445.4,
      "n": 22,
      "color": '#27C48A'
    },
    {
      "sport": "Strength",
      "deep": 52.5,
      "rem": 79.8,
      "awake": 35.8,
      "total": 426.8,
      "n": 55,
      "color": '#6B9EFF'
    },
    {
      "sport": "Running",
      "deep": 49.7,
      "rem": 81.0,
      "awake": 38.0,
      "total": 425.1,
      "n": 93,
      "color": '#9B8AFF'
    },
    {
      "sport": "Cycling",
      "deep": 49.2,
      "rem": 77.2,
      "awake": 36.2,
      "total": 415.7,
      "n": 89,
      "color": '#0681fc'
    },
    {
      "sport": "Pilates/Yoga",
      "deep": 44.7,
      "rem": 79.9,
      "awake": 33.7,
      "total": 423.4,
      "n": 39,
      "color": '#c3e84a'
    },
    {
      "sport": "Skiing",
      "deep": 37.7,
      "rem": 78.5,
      "awake": 46.1,
      "total": 397.9,
      "n": 16,
      "color": '#E8504A'
    }
]
const BASELINE = { "deep": 48.8,
    "rem": 80.0,
    "awake": 35.9,
    "total": 425.1,
    "n": 365 }

const AXES = [
  { key: 'deep',  label: 'Deep Sleep', unit: 'min', max: 75  },
  { key: 'rem',   label: 'REM',        unit: 'min', max: 95  },
  { key: 'awake', label: 'Awake',      unit: 'min', max: 60, inverted: true },
]

const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = '#1A1A18'

function polarToXY(angle, radius, cx, cy) {
  const rad = (angle - 90) * (Math.PI / 180)
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
}

function buildPath(values, maxR, cx, cy) {
  return AXES.map((axis, i) => {
    const angle = (360 / AXES.length) * i
    const raw   = values[axis.key]
    const pct   = axis.inverted ? 1 - raw / axis.max : raw / axis.max
    return polarToXY(angle, Math.min(pct, 1) * maxR, cx, cy)
  }).map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z'
}

// Hit-test: which axis vertex is nearest to a mouse position
function nearestAxisPoint(mx, my, cx, cy, maxR) {
  let best = null, bestD = Infinity
  AXES.forEach((axis, i) => {
    const angle = (360 / AXES.length) * i
    const tip = polarToXY(angle, maxR + 30, cx, cy)
    const d = Math.hypot(mx - tip.x, my - tip.y)
    if (d < bestD) { bestD = d; best = i }
  })
  return bestD < 36 ? best : null
}

export default function SportSleepChart({ size = 260 }) {
  const [active,  setActive]  = useState(new Set(SPORTS.map(s => s.sport)))
  const [showBaseline, setShowBaseline] = useState(true)
  const [tip,     setTip]     = useState(null) // { sport, x, y }
  const [axisTip, setAxisTip] = useState(null) // { axis, x, y }
  const svgRef = useRef(null)
  const cx = size / 2, cy = size / 2
  const maxR = size * 0.36
  const rings = [0.25, 0.5, 0.75, 1.0]

  const toggleSport = (sport) => {
    setActive(prev => {
      const next = new Set(prev)
      if (next.has(sport)) { if (next.size > 1) next.delete(sport) }
      else next.add(sport)
      return next
    })
  }

  const handleSvgMove = useCallback((e) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const mx = (e.clientX - rect.left) * (size / rect.width)
    const my = (e.clientY - rect.top)  * (size / rect.height)

    // Check axis label proximity
    const ai = nearestAxisPoint(mx, my, cx, cy, maxR)
    if (ai !== null) { setAxisTip({ axis: AXES[ai], x: e.clientX, y: e.clientY }); setTip(null); return }
    setAxisTip(null)

    // Check polygon hit — find sport whose polygon contains mouse
    // Simple: find sport whose path comes closest to mouse on each axis
    const visibleSports = SPORTS.filter(s => active.has(s.sport))
    let hitSport = null, minDist = 18
    visibleSports.forEach(sport => {
      AXES.forEach((axis, i) => {
        const angle = (360 / AXES.length) * i
        const pct = axis.inverted ? 1 - sport[axis.key] / axis.max : sport[axis.key] / axis.max
        const p = polarToXY(angle, Math.min(pct, 1) * maxR, cx, cy)
        const d = Math.hypot(mx - p.x, my - p.y)
        if (d < minDist) { minDist = d; hitSport = sport }
      })
    })
    if (hitSport) setTip({ sport: hitSport, x: e.clientX, y: e.clientY })
    else setTip(null)
  }, [active, cx, cy, maxR, size])

  const baselinePath = buildPath(BASELINE, maxR, cx, cy)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>

      {/* Filter chips — sports + baseline toggle */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Baseline chip */}
        <button
          type="button"
          onClick={() => setShowBaseline(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: showBaseline ? 'rgba(255,255,255,0.08)' : 'transparent',
            border: `1px solid ${showBaseline ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 999, padding: '4px 10px',
            cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 11, color: showBaseline ? 'rgba(255,255,255,0.7)' : QUIET,
            transition: 'all 0.15s',
          }}
        >
          <div style={{ width: 14, height: 1.5, background: 'rgba(255,255,255,0.4)', borderTop: '1px dashed rgba(255,255,255,0.5)' }} />
          Baseline
        </button>
        {SPORTS.map(s => {
          const on = active.has(s.sport)
          return (
            <button
              key={s.sport}
              type="button"
              onClick={() => toggleSport(s.sport)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: on ? `${s.color}18` : 'transparent',
                border: `1px solid ${on ? s.color : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 999, padding: '4px 10px',
                cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 11, color: on ? s.color : QUIET,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: on ? s.color : QUIET }} />
              {s.sport}
            </button>
          )
        })}
      </div>

      {/* Radar SVG */}
      <div style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          width={size} height={size}
          viewBox={`0 0 ${size} ${size}`}
          onMouseMove={handleSvgMove}
          onMouseLeave={() => { setTip(null); setAxisTip(null) }}
          style={{ cursor: 'crosshair', overflow: 'visible' }}
        >
          {/* Grid rings */}
          {rings.map(r => (
            <polygon key={r}
              points={AXES.map((_, i) => {
                const p = polarToXY((360 / AXES.length) * i, r * maxR, cx, cy)
                return `${p.x},${p.y}`
              }).join(' ')}
              fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1}
            />
          ))}

          {/* Axis lines + labels */}
          {AXES.map((axis, i) => {
            const angle = (360 / AXES.length) * i
            const end   = polarToXY(angle, maxR, cx, cy)
            const lbl   = polarToXY(angle, maxR + 26, cx, cy)
            return (
              <g key={axis.key}>
                <line x1={cx} y1={cy} x2={end.x} y2={end.y}
                  stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
                <text x={lbl.x} y={lbl.y} textAnchor="middle" dominantBaseline="middle"
                  fill={QUIET} fontSize={10} style={{ userSelect: 'none' }}>
                  {axis.label}
                </text>
              </g>
            )
          })}

          {/* Baseline */}
          {showBaseline && <path d={baselinePath}
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={1.5} strokeDasharray="3 3"
          />}

          {/* Sport polygons */}
          {SPORTS.map(sport => (
            <AnimatePresence key={sport.sport}>
              {active.has(sport.sport) && (
                <motion.path
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  d={buildPath(sport, maxR, cx, cy)}
                  fill={`${sport.color}20`}
                  stroke={sport.color}
                  strokeWidth={2} strokeLinejoin="round"
                />
              )}
            </AnimatePresence>
          ))}

          <circle cx={cx} cy={cy} r={2} fill="rgba(255,255,255,0.2)" />
        </svg>

        {/* Sport tooltip */}
        {tip && (
          <div style={{
            position: 'fixed', left: tip.x + 12, top: tip.y - 10,
            background: SURFACE, border: `1px solid ${tip.sport.color}44`,
            borderRadius: 8, padding: '10px 14px',
            zIndex: 200, pointerEvents: 'none', minWidth: 150,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: tip.sport.color }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>{tip.sport.sport}</span>
              <span style={{ fontSize: 11, color: QUIET, marginLeft: 'auto' }}>n={tip.sport.n}</span>
            </div>
            {AXES.map(axis => (
              <div key={axis.key} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: QUIET }}>{axis.label}</span>
                <span style={{ fontSize: 11, color: TEXT }}>{tip.sport[axis.key]} min</span>
              </div>
            ))}
          </div>
        )}

        {/* Axis tooltip */}
        {axisTip && (
          <div style={{
            position: 'fixed', left: axisTip.x + 10, top: axisTip.y - 10,
            background: SURFACE, border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '8px 12px',
            zIndex: 200, pointerEvents: 'none', maxWidth: 200,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
              {axisTip.axis.label}
            </p>
            <p style={{ fontSize: 11, color: QUIET, lineHeight: 1.5, margin: 0 }}>
              Baseline: {BASELINE[axisTip.axis.key]} min
              {axisTip.axis.inverted ? ' · lower = better (axis inverted)' : ''}
            </p>
          </div>
        )}
      </div>

      <p style={{ fontSize: 10, color: QUIET, textAlign: 'center', margin: 0, fontStyle: 'italic' }}>
        Awake axis inverted — further from center = less awake time = better
      </p>
    </div>
  )
}