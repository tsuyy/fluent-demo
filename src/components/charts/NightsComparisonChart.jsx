import { useMemo, useState } from 'react'
import { useIsNarrow } from '../scrolly/useIsNarrow'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'
const SOFT  = 'var(--color-text-secondary, rgba(255,255,255,0.7))'

const COLORS = {
  before: 'rgba(255,255,255,0.55)', free: '#27C48A',
  home: '#27C48A', travel: 'rgba(39,196,138,0.55)',
  light: '#E8A94A', heavy: '#E8504A',
}
const STAGES = [
  { key: 'deep',  label: 'Deep',  color: '#0681fc' },
  { key: 'rem',   label: 'REM',   color: '#9B8AFF' },
  { key: 'core',  label: 'Core',  color: 'rgba(255,255,255,0.55)' },
  { key: 'awake', label: 'Awake', color: '#E8504A' },
]
const sgn = (v, dp = 1) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(dp)}`
const fmtDate = (s) => new Date(s + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

/**
 * Groups of nights side by side for HRV, resting HR, breathing rate and sleep stages.
 * Reads { note, metrics, groups:[{id,label,sub,n,hrv,rhr,resp,deep,rem,core,awake,nights?:[{date,evening,note,hrv,...}]}] }.
 * Single-value metrics are drawn as a dot per night with a tick at the group mean (no bars,
 * so a 3 bpm difference is not hidden by a zero baseline). Stages are stacked group means.
 * The sentence under the chart is computed from the data. refId = the group the others are compared with.
 */
export default function NightsComparisonChart({ data, refId, showDots = true }) {
  const narrow = useIsNarrow()
  const [metricId, setMetricId] = useState('hrv')
  const [hover, setHover] = useState(null)
  const groups = data?.groups ?? []
  const metrics = data?.metrics ?? []
  const metric = metrics.find((m) => m.id === metricId) ?? metrics[0]
  const ref = groups.find((g) => g.id === refId) ?? groups[0]

  const domain = useMemo(() => {
    if (!metric || metric.id === 'stages') return [0, 1]
    const vals = []
    groups.forEach((g) => {
      if (g[metric.id] != null) vals.push(g[metric.id])
      if (showDots) (g.nights ?? []).forEach((n) => n[metric.id] != null && vals.push(n[metric.id]))
    })
    const lo = Math.min(...vals), hi = Math.max(...vals), pad = (hi - lo) * 0.08 || 1
    return [Math.floor(lo - pad), Math.ceil(hi + pad)]
  }, [groups, metric, showDots])
  const stageMax = useMemo(
    () => Math.max(...groups.map((g) => STAGES.reduce((s, st) => s + (g[st.key] ?? 0), 0))),
    [groups],
  )
  if (!metric || !ref) return null

  const pos = (v) => `${((v - domain[0]) / (domain[1] - domain[0])) * 100}%`
  const others = groups.filter((g) => g.id !== ref.id)

  let read
  if (metric.id === 'stages') {
    const parts = others.map((g) => `${g.label}: REM ${g.rem} (${sgn(g.rem - ref.rem, 0)}), awake ${g.awake} (${sgn(g.awake - ref.awake, 0)})`)
    read = `Minutes per night. ${ref.label}: REM ${ref.rem}, awake ${ref.awake}. ${parts.join('; ')}. Deep sleep did not drop on the drinking nights.`
  } else {
    const v = metric.id
    const parts = others.map((g) => `${g.label} ${g[v]} (${sgn(g[v] - ref[v])})`)
    read = `${metric.label}, average per night. ${ref.label}: ${ref[v]} ${metric.unit}. ${parts.join('; ')}.`
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {metrics.map((m) => {
          const on = m.id === metric.id
          return (
            <button key={m.id} type="button" onClick={() => setMetricId(m.id)}
              style={{
                background: on ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: `1px solid ${on ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 999, padding: '5px 12px', fontSize: 14, fontFamily: 'inherit',
                cursor: 'pointer', color: on ? TEXT : QUIET, transition: 'all 0.15s ease',
              }}>
              {m.label}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {groups.map((g) => {
          const total = STAGES.reduce((s, st) => s + (g[st.key] ?? 0), 0)
          const c = COLORS[g.id] ?? '#fff'
          return (
            <div key={g.id} style={{ display: 'grid', gridTemplateColumns: narrow ? 'minmax(0,1fr)' : 'minmax(104px, 160px) 1fr', gap: narrow ? 6 : 12, alignItems: 'center' }}>
              <div style={narrow ? { order: 2 } : undefined}>
                <p style={{ fontSize: 13, color: TEXT, margin: 0, lineHeight: 1.3 }}>{g.label}</p>
                <p style={{ fontSize: 12, color: QUIET, margin: '2px 0 0' }}>{g.sub} · n={g.n}</p>
              </div>
              {metric.id === 'stages' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', height: 22, width: `${(total / stageMax) * 100}%`, borderRadius: 4, overflow: 'hidden' }}>
                    {STAGES.map((st) => (
                      <div key={st.key} title={`${st.label} ${g[st.key]} min`}
                        style={{ width: `${((g[st.key] ?? 0) / total) * 100}%`, background: st.color, height: '100%' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 13, color: QUIET, whiteSpace: 'nowrap' }}>{Math.round(total)} min</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ position: 'relative', flex: 1, height: 26 }}>
                    <div style={{ position: 'absolute', left: 0, right: 0, top: 12, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                    {g.id !== ref.id && ref[metric.id] != null && (
                      <div style={{ position: 'absolute', left: pos(ref[metric.id]), top: 2, bottom: 2, borderLeft: '1px dashed rgba(255,255,255,0.3)' }} />
                    )}
                    {showDots && (g.nights ?? []).map((n) => n[metric.id] != null && (
                      <div key={n.date}
                        onMouseEnter={() => setHover({ g: g.id, n })} onMouseLeave={() => setHover(null)}
                        style={{ position: 'absolute', left: pos(n[metric.id]), top: 8, width: 9, height: 9, marginLeft: -4.5, borderRadius: '50%', background: c, opacity: 0.45, cursor: 'default' }} />
                    ))}
                    <div style={{ position: 'absolute', left: pos(g[metric.id]), top: 3, width: 3, height: 20, marginLeft: -1.5, borderRadius: 2, background: c }} />
                    {hover?.g === g.id && (
                      <div style={{ position: 'absolute', left: pos(hover.n[metric.id]), bottom: 28, transform: 'translateX(-50%)', background: 'rgba(20,20,22,0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '4px 8px', fontSize: 12, color: TEXT, whiteSpace: 'nowrap', zIndex: 2, pointerEvents: 'none' }}>
                        night of {fmtDate(hover.n.evening)} → {hover.n[metric.id]} {metric.unit}{hover.n.note ? ` · ${hover.n.note}` : ''}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 13, color: TEXT, whiteSpace: 'nowrap', minWidth: 52 }}>
                    {g[metric.id]} <span style={{ color: QUIET, fontSize: 12 }}>{metric.unit}</span>
                  </span>
                </div>
              )}
            </div>
          )
        })}
        {metric.id !== 'stages' && (narrow ? (
          <p style={{ fontSize: 12, color: QUIET, lineHeight: 1.5, margin: 0 }}>
            Scale {domain[0]}–{domain[1]} {metric.unit}. Dashed line = {ref.label.toLowerCase()} average · tick = group average · dots = single nights
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(104px, 160px) 1fr', gap: 12 }}>
            <span />
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 62, fontSize: 12, color: QUIET }}>
              <span>{domain[0]}</span><span>dashed line = {ref.label.toLowerCase()} average · tick = group average · dots = single nights</span><span>{domain[1]}</span>
            </div>
          </div>
        ))}
      </div>

      {metric.id === 'stages' && (
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 12 }}>
          {STAGES.map((st) => (
            <span key={st.key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: QUIET }}>
              <i style={{ width: 8, height: 8, borderRadius: 2, background: st.color, display: 'inline-block' }} />{st.label}
            </span>
          ))}
        </div>
      )}

      <p style={{ fontSize: 13, color: SOFT, lineHeight: 1.55, margin: '14px 0 0' }}>{read}</p>
      {data.note && <p style={{ fontSize: 12, color: QUIET, lineHeight: 1.5, margin: '6px 0 0' }}>{data.note}</p>}
    </div>
  )
}
