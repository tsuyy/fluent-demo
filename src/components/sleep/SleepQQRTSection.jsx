import { useState } from 'react'
import { motion } from 'framer-motion'
import SleepQuantityChart    from '../charts/SleepQuantityChart'
import SleepEfficiencyChart  from '../charts/SleepEfficiencyChart'
import SleepRegularityChart  from '../charts/SleepRegularityChart'
import MetricTooltip from '../MetricTooltip'
import { useIsNarrow } from '../scrolly/useIsNarrow'

const QUIET = 'var(--color-quiet, #888780)'

// Added `insight` — same pattern as MetricCard's italic takeaway line,
// extended to ChartCard so every chart can state its "why this
// matters" in words, not just show its shape.
function ChartCard({ title, subtitle, metric, insight, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'grid', gap: 12, minWidth: 0, boxSizing: 'border-box',
        gridTemplateColumns: 'minmax(0, 1fr)',
        padding: '18px 20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{title}</p>
          {metric && <MetricTooltip metric={metric} />}
        </div>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>
          {subtitle}
        </p>
      </div>
      {children}
      {insight && (
        <p style={{
          fontSize: 14, color: 'rgba(255,255,255,0.7)',
          fontStyle: 'italic', lineHeight: 1.5,
          margin: 0,
        }}>
          "{insight}"
        </p>
      )}
    </motion.div>
  )
}

// Night-of-week view of the Quantity data. Dates in the export are the morning a
// night ends, so the night STARTS the day before (Sat-morning = Friday night).
const NIGHT_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TARGET_HR = 7
const WAKE_DAY = { Sun: 'Monday', Mon: 'Tuesday', Tue: 'Wednesday', Wed: 'Thursday', Thu: 'Friday', Fri: 'Saturday', Sat: 'Sunday' }

function nightOfWeekStats(nightly) {
  const rows = NIGHT_LABELS.map((label) => ({ label, hrs: [] }))
  for (const n of nightly) {
    const wake = new Date(n.date + 'T12:00:00')
    const start = (wake.getDay() + 6) % 7        // weekday the night began
    rows[start].hrs.push(n.total_hr)
  }
  return rows.map((r) => ({
    label: r.label,
    n: r.hrs.length,
    avg: r.hrs.length ? r.hrs.reduce((a, b) => a + b, 0) / r.hrs.length : null,
    under: r.hrs.length ? r.hrs.filter((h) => h < TARGET_HR).length / r.hrs.length : null,
    underCount: r.hrs.filter((h) => h < TARGET_HR).length,
  }))
}

function NightOfWeek({ rows, lowIdx }) {
  const MIN = 5.5, MAX = 8, H = 150
  const pos = (v) => `${((v - MIN) / (MAX - MIN)) * 100}%`
  return (
    <div role="img" aria-label={'Average hours slept by night of the week. ' +
      rows.map((r) => `${r.label} night ${r.avg?.toFixed(1)} hours`).join(', ')}>
      <div style={{ position: 'relative', height: H, marginLeft: 36 }}>
        {[6, 7, 8].map((v) => (
          <div key={v} style={{
            position: 'absolute', left: -36, right: 0, bottom: pos(v),
            borderTop: v === TARGET_HR ? '1px dashed rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.05)',
          }}>
            <span style={{ position: 'absolute', left: 0, top: -16, fontSize: 13, color: 'rgba(255,255,255,0.72)' }}>{v}h</span>
          </div>
        ))}
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {rows.map((r, i) => (
            <div key={r.label} style={{ position: 'relative' }} title={`${r.label} night: ${r.avg?.toFixed(2)}h avg, ${Math.round(r.under * 100)}% under ${TARGET_HR}h (n=${r.n})`}>
              {r.avg != null && (
                <>
                  <div style={{
                    position: 'absolute', left: '50%', bottom: pos(r.avg), transform: 'translate(-50%, 50%)',
                    width: i === lowIdx ? 14 : 10, height: i === lowIdx ? 14 : 10, borderRadius: '50%',
                    background: '#0681fc', opacity: i === lowIdx ? 1 : 0.55,
                  }} />
                  <span style={{
                    position: 'absolute', left: 0, right: 0, textAlign: 'center',
                    bottom: `calc(${pos(r.avg)} + 12px)`, fontSize: 14,
                    color: i === lowIdx ? '#fff' : 'rgba(255,255,255,0.7)', fontWeight: i === lowIdx ? 600 : 400,
                  }}>{r.avg.toFixed(1)}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginLeft: 36, marginTop: 6 }}>
        {rows.map((r, i) => (
          <div key={r.label} style={{ textAlign: 'center', fontSize: 14, color: i === lowIdx ? '#fff' : 'rgba(255,255,255,0.7)' }}>
            {r.label}
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)' }}>{Math.round(r.under * 100)}% &lt;{TARGET_HR}h</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SleepQQRTSection({ data, sleepTimes }) {
  const narrow = useIsNarrow()
  if (!data) return null

  const q   = data.quantity
  const ql  = data.quality
  const reg = data.regularity
  const nightly = ql.nightly ?? []
  const dow = nightOfWeekStats(nightly)
  const withData = dow.filter((r) => r.avg != null && r.n >= 20)
  const lowIdx = withData.length ? dow.indexOf(withData.reduce((a, b) => (b.avg < a.avg ? b : a))) : -1
  const low = lowIdx >= 0 ? dow[lowIdx] : null
  const rest = dow.filter((_, i) => i !== lowIdx && dow[i].n)
  const restUnder = rest.length ? rest.reduce((a, r) => a + r.underCount, 0) / rest.reduce((a, r) => a + r.n, 0) : 0
  const restAvg = rest.length ? rest.reduce((a, r) => a + r.avg * r.n, 0) / rest.reduce((a, r) => a + r.n, 0) : 0
  const underAll = nightly.length ? nightly.filter((n) => n.total_hr < TARGET_HR).length / nightly.length : 0
  const quantityInsight = low
    ? `${low.label} nights (waking ${WAKE_DAY[low.label]}) are where sleep is lost: ${low.avg.toFixed(1)}h on average and ${Math.round(low.under * 100)}% under ${TARGET_HR}h, against ${restAvg.toFixed(1)}h and ${Math.round(restUnder * 100)}% on every other night.`
    : null
  const lowQ = nightly.filter((n) => n.efficiency < 85)
  const okQ = nightly.filter((n) => n.efficiency >= 85)
  const mean = (a, k) => (a.length ? a.reduce((x, y) => x + y[k], 0) / a.length : 0)
  const qualityInsight = lowQ.length
    ? `The ${lowQ.length} nights below 85% had ${Math.round(mean(lowQ, 'awake_min'))} min awake vs ${Math.round(mean(okQ, 'awake_min'))} on other nights, and ${Math.round((mean(okQ, 'total_hr') - mean(lowQ, 'total_hr')) * 60)} min less sleep.`
    : null
  const eras = sleepTimes?.eras ?? []
  const [eraId, setEraId] = useState('series10')
  const era = eras.find((e) => e.id === eraId) ?? eras[0]
  const other = eras.find((e) => e.id !== era?.id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <ChartCard
        title="Quantity"
        metric="sleep_quantity"
        subtitle={`${q.mean_hr}hr avg · ${q.nights} nights tracked · ${Math.round(underAll * 100)}% of nights under ${TARGET_HR}h`}
        insight={quantityInsight}
      >
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Week by week</p>
        <SleepQuantityChart data={data} height={190} />
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '8px 0 0' }}>
          By night of the week (night starts that evening) · avg hours · % of nights under {TARGET_HR}h
        </p>
        <NightOfWeek rows={dow} lowIdx={lowIdx} />
      </ChartCard>

      <ChartCard
        title="Quality"
        metric="sleep_efficiency"
        subtitle={`${ql.mean_pct}% efficiency · ${nightly.length ? Math.round((okQ.length / nightly.length) * 100) : ql.pct_above_85}% of nights at or above 85%`}
        insight={qualityInsight}
      >
        <SleepEfficiencyChart data={data} height={200} />
      </ChartCard>

      <ChartCard
        title="Regularity"
        metric="sleep_regularity"
        subtitle={era
          ? `9–11pm anchor · bedtime varies ±${era.bedtime_std_min} min · ${era.total_nights} nights, ${era.span}`
          : 'Bedtime regularity'}
        insight="Most nights cluster around 9–11pm. The late nights are what pull the average around."
      >
        {eras.length > 1 && (
          <div style={{ display: 'flex', gap: 6 }}>
            {eras.map((e) => {
              const on = e.id === era.id
              return (
                <button key={e.id} type="button" onClick={() => setEraId(e.id)}
                  style={{
                    background: on ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: `1px solid ${on ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 999, padding: '4px 12px', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer',
                    color: on ? 'var(--color-text, #fff)' : QUIET,
                  }}>
                  {e.label} · {e.span}
                </button>
              )
            })}
          </div>
        )}
        <SleepRegularityChart data={era} height={160} />
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.66)', margin: 0, lineHeight: 1.6 }}>
          Each bar is a 30-minute bedtime window. The late-night tail is what costs more recovery the next day.
        </p>
        {era && other && (
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', margin: 0, lineHeight: 1.5 }}>
            {era.label}: {era.anchor_pct}% of nights at 9–11pm, {era.late_pct}% at midnight or later; wake time varies ±{era.waketime_std_min} min.
            {' '}{other.label}: ±{other.bedtime_std_min} min bedtime, ±{other.waketime_std_min} min wake. The two watches measure bedtime differently
            (earlier: time in bed, over 3 hours; now: the first sleep stage of the night), so compare the shapes, not the exact minutes.
          </p>
        )}
      </ChartCard>

    </div>
  )
}