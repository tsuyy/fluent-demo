import { useState, useRef, useCallback, useMemo } from 'react'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = '#1A1A18'
const GOOD  = '#27C48A'
const LOW   = '#E8504A'

/**
 * Recent sleep efficiency — real data, last 14 nights of
 * sleep_qqrt.json's quality.nightly array. Custom hover tooltip
 * matching the rest of the Recent* chart family (was previously
 * just a native `title` attribute — inconsistent with everything
 * else and easy to miss).
 */
export default function RecentSleepMini({ data, height = 70 }) {
  const [tip, setTip] = useState(null)
  const containerRef  = useRef(null)
  const [width, setWidth] = useState(300)

  const recent = useMemo(() => (data?.quality?.nightly ?? []).slice(-14), [data])

  const measureRef = useCallback((node) => {
    containerRef.current = node
    if (node) setWidth(node.getBoundingClientRect().width)
  }, [])

  if (recent.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 11, color: QUIET }}>No data</span>
      </div>
    )
  }

  const max = 100
  const dayW = width / recent.length

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const idx = Math.floor((e.clientX - rect.left) / dayW)
    if (idx < 0 || idx >= recent.length) { setTip(null); return }
    setTip({ x: dayW * idx + dayW / 2, point: recent[idx] })
  }, [recent, dayW])

  return (
    <div ref={measureRef} style={{ width: '100%', height, position: 'relative' }}>
      <svg
        width="100%" height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTip(null)}
        style={{ cursor: 'crosshair', overflow: 'visible' }}
      >
        {recent.map((n, i) => {
          const h = (n.efficiency / max) * height
          return (
            <rect
              key={n.date}
              x={dayW * i + dayW * 0.12}
              y={height - h}
              width={dayW * 0.76}
              height={h}
              fill={n.efficiency >= 85 ? GOOD : LOW}
              opacity={0.7}
              rx={1.5}
            />
          )
        })}
      </svg>

      {tip && (() => {
        const flip = tip.x > width - 100
        return (
          <div style={{
            position: 'absolute',
            left: flip ? undefined : tip.x + 8,
            right: flip ? width - tip.x + 8 : undefined,
            top: 0,
            background: SURFACE, border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '6px 10px',
            zIndex: 100, pointerEvents: 'none', minWidth: 90,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: TEXT, marginBottom: 2 }}>{tip.point.date}</p>
            <p style={{ fontSize: 10, color: tip.point.efficiency >= 85 ? GOOD : LOW, margin: 0 }}>
              {tip.point.efficiency}% efficiency
            </p>
          </div>
        )
      })()}
    </div>
  )
}