import { motion } from 'framer-motion'
import SleepQuantityChart    from '../charts/SleepQuantityChart'
import SleepEfficiencyChart  from '../charts/SleepEfficiencyChart'
import SleepRegularityChart  from '../charts/SleepRegularityChart'
import MetricTooltip from '../MetricTooltip'

const QUIET = 'var(--color-quiet, #888780)'

function ChartCard({ title, subtitle, metric, children }) {
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
    </motion.div>
  )
}

export default function SleepQQRTSection({ data }) {
  if (!data) return null

  const q   = data.quantity
  const ql  = data.quality
  const reg = data.regularity

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
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
        >
          <SleepEfficiencyChart data={data} height={160} />
        </ChartCard>
      </div>

      <ChartCard
        title="Regularity"
        metric="sleep_regularity"
        subtitle={`Avg bedtime 10:35pm · ±${reg.bedtime_std_min}min variance · ${reg.nights} nights`}
      >
        <SleepRegularityChart data={data} height={160} />
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0, lineHeight: 1.6 }}>
          Each dot is one night. Late-night outliers are the nights that cost more recovery the next day.
        </p>
      </ChartCard>

    </div>
  )
}