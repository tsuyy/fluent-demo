import { useCallback, useMemo, useRef, useState } from 'react'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = '#1A1A18'
const COLORS = { cycling: '#0681fc', running: '#9B8AFF' }
const fmt = (s) => new Date(s + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

/**
 * Speed at the same heart rate: one dot per session, with a sport toggle.
 * Reads hr_efficiency.json: { note, sports:[{id,label,band:[lo,hi],sessions:[{date,mph,hr,mi,min}]}] }
 * Heart rate is held roughly constant (the band), so a higher dot means more speed for the same effort.
 * Dot size = distance. The dashed line is a least-squares fit, a description and not a test.
 */
export default function HRSpeedChart({ data, height = 200 }) {
  const sports = data?.sports ?? []
  const [sportId, setSportId] = useState(sports[0]?.id)
  const [tip, setTip] = useState(null)
  const [width, setWidth] = useState(560)
  const ref = useRef(null)
  const measure = useCallback((n) => { ref.current = n; if (n) setWidth(n.getBoundingClientRect().width) }, [])

  const [groupId, setGroupId] = useState(null)
  const sport = sports.find((s) => s.id === sportId) ?? sports[0]
  const groups = sport?.groups ?? []
  const group = groups.find((x) => x.id === groupId) ?? groups[0] ?? null
  const sessions = useMemo(
    () => (group ? (sport?.sessions ?? []).filter((s) => s.type === group.id) : (sport?.sessions ?? [])),
    [sport, group],
  )
  const color = COLORS[sport?.id] ?? '#0681fc'
  const m = { t: 22, r: 14, b: 28, l: 36 }
  const plotW = width - m.l - m.r
  const plotH = height - m.t - m.b

  const g = useMemo(() => {
    if (sessions.length < 3) return null
    const t = sessions.map((s) => new Date(s.date + 'T12:00:00').getTime())
    const v = sessions.map((s) => s.mph)
    const t0 = Math.min(...t), t1 = Math.max(...t)
    const lo = Math.floor(Math.min(...v) * 2) / 2 - 0.5, hi = Math.ceil(Math.max(...v) * 2) / 2 + 0.5
    const n = v.length, mt = t.reduce((a, b) => a + b, 0) / n, mv = v.reduce((a, b) => a + b, 0) / n
    const slope = t.reduce((a, ti, i) => a + (ti - mt) * (v[i] - mv), 0) / t.reduce((a, ti) => a + (ti - mt) ** 2, 0)
    const at = (ti) => mv + slope * (ti - mt)
    const sorted = [...v].sort((p, q) => p - q)
    const q1 = sorted[Math.floor(n * 0.25)], q3 = sorted[Math.floor(n * 0.75)]
    const maxMi = Math.max(...sessions.map((s) => s.mi))
    const years = []
    for (let y = new Date(t0).getFullYear() + 1; y <= new Date(t1).getFullYear(); y++) years.push(y)
    return { t, t0, t1, lo, hi, slope, at, maxMi, years, q1, q3 }
  }, [sessions])
  if (!sport || !g) return null

  const x = (ti) => m.l + ((ti - g.t0) / (g.t1 - g.t0)) * plotW
  const y = (val) => m.t + plotH - ((val - g.lo) / (g.hi - g.lo)) * plotH
  const r = (mi) => 2.5 + 3.5 * Math.sqrt(mi / g.maxMi)
  const step = g.hi - g.lo > 8 ? 2.5 : g.hi - g.lo > 4 ? 1 : 0.5
  const ticks = []
  for (let v = Math.ceil(g.lo / step) * step; v <= g.hi; v += step) ticks.push(Math.round(v * 10) / 10)

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const px = e.clientX - rect.left, py = e.clientY - rect.top
    let best = null, bd = 18
    sessions.forEach((s, i) => {
      const d = Math.hypot(x(g.t[i]) - px, y(s.mph) - py)
      if (d < bd) { bd = d; best = i }
    })
    setTip(best == null ? null : { i: best, x: x(g.t[best]), y: y(sessions[best].mph) })
  }

  const a = g.at(g.t0), b = g.at(g.t1)
  const d0 = new Date(g.t0), d1 = new Date(g.t1)
  const what = group ? group.label.toLowerCase() : `${sport.label.toLowerCase()} sessions`
  const summary = `${sessions.length} ${what} with an average heart rate of ${sport.band[0]}–${sport.band[1]} bpm. A straight-line fit runs from about ${a.toFixed(1)} mph in ${d0.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} to ${b.toFixed(1)} mph in ${d1.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}, and the middle half of sessions fall between ${g.q1.toFixed(1)} and ${g.q3.toFixed(1)} mph.`

  return (
    <div ref={measure} style={{ width: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {sports.map((s) => {
          const on = s.id === sport.id, c = COLORS[s.id]
          return (
            <button key={s.id} type="button" onClick={() => { setSportId(s.id); setGroupId(null); setTip(null) }}
              style={{
                background: on ? `${c}22` : 'transparent', border: `1px solid ${on ? c : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 999, padding: '5px 12px', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer',
                color: on ? c : QUIET, transition: 'all 0.15s ease',
              }}>{s.label}</button>
          )
        })}
      </div>
      {groups.length > 0 && (
        <div style={{ display: 'flex', gap: 14, marginBottom: 10, flexWrap: 'wrap' }}>
          {groups.map((x) => {
            const on = x.id === group.id
            return (
              <span key={x.id} onClick={() => { setGroupId(x.id); setTip(null) }} title={x.def}
                style={{ fontSize: 13, cursor: 'pointer', color: on ? TEXT : QUIET, borderBottom: `1.5px solid ${on ? color : 'transparent'}`, paddingBottom: 2 }}>
                {x.label} <span style={{ fontSize: 12, color: QUIET }}>{(sport.sessions ?? []).filter((s) => s.type === x.id).length}</span>
              </span>
            )
          })}
          <span style={{ fontSize: 12, color: QUIET, alignSelf: 'center' }}>{group.def}</span>
        </div>
      )}
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} onMouseMove={onMove} onMouseLeave={() => setTip(null)}
        role="img" aria-label={`${sport.label} speed at a heart rate of ${sport.band[0]} to ${sport.band[1]} bpm, one dot per session`}
        style={{ overflow: 'visible', cursor: 'crosshair' }}>
        {ticks.map((v) => (
          <g key={v}>
            <line x1={m.l} x2={width - m.r} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.06)" />
            <text x={m.l - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill={QUIET}>{v}</text>
          </g>
        ))}
        <text x={m.l - 6} y={10} textAnchor="end" fontSize="9" fill={QUIET}>mph</text>
        {g.years.map((yr) => {
          const ti = new Date(yr, 0, 1).getTime()
          return (
            <g key={yr}>
              <line x1={x(ti)} x2={x(ti)} y1={m.t} y2={m.t + plotH} stroke="rgba(255,255,255,0.05)" />
              <text x={x(ti)} y={height - 8} textAnchor="middle" fontSize="9" fill={QUIET}>{yr}</text>
            </g>
          )
        })}
        <line x1={x(g.t0)} y1={y(a)} x2={x(g.t1)} y2={y(b)} stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeDasharray="4 3" />
        {sessions.map((s, i) => (
          <circle key={s.date + i} cx={x(g.t[i])} cy={y(s.mph)} r={r(s.mi)} fill={color} opacity={tip?.i === i ? 1 : 0.45} />
        ))}
      </svg>
      {tip && (() => {
        const s = sessions[tip.i]
        const flip = tip.x > width - 170
        return (
          <div style={{
            position: 'absolute', top: Math.max(0, tip.y - 8) + 36, left: flip ? undefined : tip.x + 12, right: flip ? width - tip.x + 12 : undefined,
            background: SURFACE, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 10px', zIndex: 100,
            pointerEvents: 'none', fontSize: 12, color: TEXT, boxShadow: '0 4px 16px rgba(0,0,0,0.4)', whiteSpace: 'nowrap',
          }}>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>{fmt(s.date)}</div>
            <div style={{ color: QUIET }}>{s.mph.toFixed(1)} mph · {s.hr} bpm avg · {s.mi} mi · {s.min} min</div>
          </div>
        )
      })()}
      <p style={{ fontSize: 13, color: 'var(--color-text-secondary, rgba(255,255,255,0.7))', lineHeight: 1.55, margin: '12px 0 0' }}>{summary}</p>
      {data.note && <p style={{ fontSize: 12, color: QUIET, lineHeight: 1.5, margin: '6px 0 0' }}>{data.note}</p>}
    </div>
  )
}
