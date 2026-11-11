import { useMemo, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { layoutFeverArc, fmtDate } from './feverArcLayout'

const PINK = '#c450e8'
const BLUE = '#0681fc'
const QUIET = 'var(--color-quiet, rgba(255,255,255,0.5))'
const TEXT = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = '#1A1A18'
const sgn = (v, dp) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(dp)}`

/**
 * IllnessArcChart — HRV deviation bars with two marked windows
 * ("Warmer nights", "Fever"), travel days excluded, and neutral callouts.
 * Matches slide 08. Shows what the data did; it does not say what it meant.
 *
 * data: { meta, bands, days, callouts }  (see src/data/yvonne/illness_arc.json)
 */
export default function IllnessArcChart({ data, height = 300, compact = false }) {
  const [tip, setTip] = useState(null)
  const nodeRef = useRef(null)
  const [width, setWidth] = useState(640)
  const measureRef = useCallback((node) => {
    nodeRef.current = node
    if (!node) return
    setWidth(node.getBoundingClientRect().width || 640)
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(([e]) => setWidth(e.contentRect.width || 640)).observe(node)
    }
  }, [])

  const days = data?.days ?? []
  const { prims, geom } = useMemo(
    () => (days.length ? layoutFeverArc(data, { width, height, compact }) : { prims: [], geom: null }),
    [data, width, height, compact, days.length],
  )

  if (!days.length) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 13, color: QUIET }}>No data</span></div>
  }

  const onMove = (e) => {
    if (!nodeRef.current) return
    const r = nodeRef.current.getBoundingClientRect()
    const idx = Math.floor((e.clientX - r.left - geom.m.l) / geom.dayW)
    if (idx < 0 || idx >= days.length) return setTip(null)
    setTip({ idx, x: geom.xc(idx) })
  }
  const td = tip ? days[tip.idx] : null
  const flip = tip && tip.x > width - 190

  return (
    <div ref={measureRef} style={{ width: '100%', position: 'relative' }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} onMouseMove={onMove} onClick={onMove} onMouseLeave={() => setTip(null)}
        role="img" aria-label="Daily HRV compared with baseline, Feb 8 to Mar 1, with the Feb 11–12 warmer nights and a fever window"
        style={{ overflow: 'visible', cursor: 'crosshair' }}>
        {prims.map((p) => {
          if (p.t === 'rect') {
            const common = { x: p.x, y: p.y, width: p.w, height: p.h, rx: p.rx ?? 0, fill: p.fill, stroke: p.stroke, strokeDasharray: p.dash ?? undefined, opacity: p.opacity }
            return p.bar != null ? (
              <motion.rect key={p.key} {...common} initial={{ height: 0 }} animate={{ height: p.h }} transition={{ duration: 0.4, delay: p.bar * 0.012 }} />
            ) : <rect key={p.key} {...common} />
          }
          if (p.t === 'line') return <line key={p.key} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={p.stroke} strokeWidth={p.sw ?? 1} />
          if (p.t === 'text') return p.text ? (
            <text key={p.key} x={p.x} y={p.y} textAnchor={p.anchor} fill={p.fill} fontSize={p.size} fontWeight={p.weight} letterSpacing={p.spacing}>{p.text}</text>
          ) : null
          return null
        })}
        {tip && <rect x={tip.x - geom.dayW / 2} y={geom.m.t} width={geom.dayW} height={geom.plotH} fill="rgba(255,255,255,0.06)" pointerEvents="none" />}
      </svg>

      {tip && td && (
        <div style={{
          position: 'absolute', top: geom.m.t, left: flip ? undefined : tip.x + 12, right: flip ? width - tip.x + 12 : undefined,
          background: SURFACE, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', zIndex: 100,
          pointerEvents: 'none', minWidth: 160, maxWidth: 220, boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, margin: '0 0 6px' }}>{fmtDate(td.date)}</p>
          {td.excluded ? (
            <p style={{ fontSize: 12, color: QUIET, margin: 0 }}>Travel day, excluded</p>
          ) : (
            <>
              {[
                ['HRV', td.hrv_dev, 'ms', 0, td.hrv_dev < 0 ? PINK : BLUE],
                ['Resting HR', td.rhr_dev, ' bpm', 1, QUIET],
                ['Wrist temp', td.wrist_dev, ' °C', 2, QUIET],
              ].map(([k, v, u, dp, c]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, color: c }}>{k}</span>
                  <span style={{ fontSize: 12, color: TEXT }}>{v == null ? 'no reading' : `${sgn(v, dp)}${u}`}</span>
                </div>
              ))}
              {geom.notes[tip.idx]?.length > 0 && (
                <div style={{ margin: '6px 0 0', paddingTop: 6, borderTop: '0.5px solid rgba(255,255,255,0.12)' }}>
                  {geom.notes[tip.idx].map((n) => (
                    <p key={n} style={{ fontSize: 12, color: TEXT, margin: '0 0 2px', lineHeight: 1.4 }}>{n}</p>
                  ))}
                </div>
              )}
              {td.activities?.length > 0 && (
                <p style={{ fontSize: 12, color: QUIET, margin: '6px 0 0', lineHeight: 1.4 }}>{td.activities.join(' · ')}</p>
              )}
            </>
          )}
        </div>
      )}

      {!compact && (
        <div style={{ display: 'flex', gap: 16, marginTop: 8, paddingLeft: 14, flexWrap: 'wrap' }}>
          {[[PINK, 'HRV below baseline'], [BLUE, 'HRV above baseline']].map(([c, l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, background: c, opacity: 0.8, borderRadius: 1 }} />
              <span style={{ fontSize: 12, color: QUIET }}>{l}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 10, border: '1px dashed rgba(255,255,255,0.5)', borderRadius: 1 }} />
            <span style={{ fontSize: 12, color: QUIET }}>Travel days excluded (Feb 15–16)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 10, border: '1px solid rgba(255,255,255,0.5)', borderRadius: 1 }} />
            <span style={{ fontSize: 12, color: QUIET }}>Feb 11–12, warmer nights</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 10, background: 'rgba(196,80,232,0.3)', borderRadius: 1 }} />
            <span style={{ fontSize: 12, color: QUIET }}>Fever, Feb 24–25, for comparison</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: QUIET, margin: '0 4px' }} />
            <span style={{ fontSize: 12, color: QUIET }}>Day with more detail (hover or tap)</span>
          </div>
        </div>
      )}
    </div>
  )
}
