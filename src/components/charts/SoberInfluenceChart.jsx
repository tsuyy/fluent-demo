import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT  = 'var(--color-text, rgba(255,255,255,0.92))'

const GROUP_COLOR = {
  before: 'rgba(255,255,255,0.28)',
  free:   '#27C48A',
  clean:  'rgba(39,196,138,0.5)',
  dirty:  '#E8504A',
}
const STAGES = [
  { key: 'deep',  label: 'Deep',  color: '#0681fc' },
  { key: 'rem',   label: 'REM',   color: '#9B8AFF' },
  { key: 'core',  label: 'Core',  color: 'rgba(255,255,255,0.55)' },
  { key: 'awake', label: 'Awake', color: '#E8504A' },
]

const sgn = (v, dp = 1) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(dp)}`

/**
 * Nights with and without alcohol, side by side, for HRV, resting HR, breathing rate
 * and sleep stages. Reads sober_comparison.json:
 *   { note, metrics:[{id,label,unit,keys?}], groups:[{id,label,sub,n,hrv,rhr,resp,deep,rem,core,awake}] }
 * The sentence under the chart is computed from the same numbers, never typed.
 */
export default function SoberInfluenceChart({ data }) {
  const [metricId, setMetricId] = useState('hrv')
  const groups = data?.groups ?? []
  const metrics = data?.metrics ?? []
  const metric = metrics.find((m) => m.id === metricId) ?? metrics[0]
  const clean = groups.find((g) => g.id === 'clean')
  const dirty = groups.find((g) => g.id === 'dirty')

  const max = useMemo(() => {
    if (!metric || metric.id === 'stages') return 0
    return Math.max(...groups.map((g) => g[metric.id] ?? 0)) * 1.15
  }, [groups, metric])
  const stageMax = useMemo(
    () => Math.max(...groups.map((g) => STAGES.reduce((s, st) => s + (g[st.key] ?? 0), 0))),
    [groups],
  )

  if (!metric || !clean || !dirty) return null

  let read
  if (metric.id === 'stages') {
    const d = (k) => sgn(dirty[k] - clean[k], 0)
    read = `On the ${dirty.n} drinking nights: deep sleep ${dirty.deep} min vs ${clean.deep} (${d('deep')}), REM ${dirty.rem} vs ${clean.rem} (${d('rem')}), awake ${dirty.awake} vs ${clean.awake} (${d('awake')}). Compared with the ${clean.n} other nights after the experiment.`
  } else {
    const v = metric.id
    read = `${metric.label} was ${dirty[v]} ${metric.unit} on the ${dirty.n} drinking nights vs ${clean[v]} on the ${clean.n} other nights after the experiment (${sgn(dirty[v] - clean[v])}).`
    if (v === 'rhr') read += ' Resting heart rate did not rise.'
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

      <div style={{ display: 'grid', gap: 10 }}>
        {groups.map((g) => {
          const total = STAGES.reduce((s, st) => s + (g[st.key] ?? 0), 0)
          return (
            <div key={g.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(96px, 150px) 1fr', gap: 12, alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 13, color: TEXT, margin: 0, lineHeight: 1.3 }}>{g.label}</p>
                <p style={{ fontSize: 12, color: QUIET, margin: '2px 0 0' }}>{g.sub} · n={g.n}</p>
              </div>
              {metric.id === 'stages' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', height: 22, width: `${(total / stageMax) * 100}%`, borderRadius: 4, overflow: 'hidden' }}>
                    {STAGES.map((st) => (
                      <motion.div key={st.key}
                        initial={{ width: 0 }} animate={{ width: `${((g[st.key] ?? 0) / total) * 100}%` }}
                        transition={{ duration: 0.4 }}
                        title={`${st.label} ${g[st.key]} min`}
                        style={{ background: st.color, height: '100%' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 13, color: QUIET, whiteSpace: 'nowrap' }}>
                    {Math.round(total)} min
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${(g[metric.id] / max) * 100}%` }}
                    transition={{ duration: 0.4 }}
                    style={{ height: 22, borderRadius: 4, background: GROUP_COLOR[g.id], minWidth: 2 }} />
                  <span style={{ fontSize: 13, color: TEXT, whiteSpace: 'nowrap' }}>
                    {g[metric.id]} <span style={{ color: QUIET, fontSize: 12 }}>{metric.unit}</span>
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {metric.id === 'stages' && (
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 12 }}>
          {STAGES.map((st) => (
            <span key={st.key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: QUIET }}>
              <i style={{ width: 8, height: 8, borderRadius: 2, background: st.color, display: 'inline-block' }} />
              {st.label}
            </span>
          ))}
        </div>
      )}

      <p style={{ fontSize: 13, color: 'var(--color-text-secondary, rgba(255,255,255,0.7))', lineHeight: 1.55, margin: '14px 0 0' }}>{read}</p>
      {data.note && <p style={{ fontSize: 12, color: QUIET, lineHeight: 1.5, margin: '6px 0 0' }}>{data.note}</p>}
    </div>
  )
}
