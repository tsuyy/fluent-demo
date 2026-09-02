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
        display: 'grid', gap: 12,
        padding: '18px 20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <p style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>{title}</p>
          {metric && <MetricTooltip metric={metric} />}
        </div>
        <p style={{ fontSize: 11, color: QUIET, margin: 0, lineHeight: 1.5 }}>
          {subtitle}
        </p>
      </div>
      {children}
      {insight && (
        <p style={{
          fontSize: 12, color: 'var(--color-text-tertiary)',
          fontStyle: 'italic', lineHeight: 1.5,
          margin: 0,
        }}>
          "{insight}"
        </p>
      )}
    </motion.div>
  )
}

export default function SleepQQRTSection({ data, sleepTimes }) {
  const narrow = useIsNarrow()
  if (!data) return null

  const q   = data.quantity
  const ql  = data.quality
  const reg = data.regularity

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: 20 }}>
        <ChartCard
          title="Quantity"
          metric="sleep_quantity"
          subtitle={`${q.mean_hr}hr avg · ${q.nights} nights tracked`}
        >
          <SleepQuantityChart data={data} height={160} />
        </ChartCard>

        <ChartCard
          title="Quality"
          metric="sleep_efficiency"
          subtitle={`${ql.mean_pct}% efficiency · ${ql.pct_above_85}% of nights above 85%`}
          insight={`Most nights clear the 85% threshold comfortably — the ${100 - ql.pct_above_85}% that don't cluster around specific stretches, not randomly, which is usually worth noticing when it happens.`}
        >
          <SleepEfficiencyChart data={data} height={160} />
        </ChartCard>
      </div>

      <ChartCard
        title="Regularity"
        metric="sleep_regularity"
        subtitle={`9pm-11pm anchor · ±${reg.bedtime_std_min}min driven by late nights · ${reg.nights} nights`}
        insight={`Most nights cluster tightly around 9-11pm — the late nights are the outliers pulling the average around, not the norm.`}

      >
        <SleepRegularityChart data={sleepTimes} height={160} />
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0, lineHeight: 1.6 }}>
          Each bar is a 30-minute bedtime window. The late-night tail is what costs more recovery the next day.
        </p>
      </ChartCard>

    </div>
  )
}