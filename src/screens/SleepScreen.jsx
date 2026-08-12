import { motion } from 'framer-motion'
import FloatingNav from '../components/nav/FloatingNav'
import SleepArchitectureChart from '../components/charts/SleepArchitectureChart'
import SleepHRVChart from '../components/charts/SleepHRVChart'
import QQRTCard from '../components/cards/QQRTCard'
import SleepTrendCards from '../components/cards/SleepTrendCards'
import PageContainer from '../components/layout/PageContainer'


const GRADIENTS = {
  jamie:  'radial-gradient(ellipse at 15% 70%, rgba(180,60,60,0.2) 0%, transparent 55%)',
  yvonne: 'radial-gradient(ellipse at 80% 20%, rgba(6,129,252,0.15) 0%, rgba(39,196,138,0.08) 40%, transparent 65%)',
  robert: 'radial-gradient(ellipse at 20% 60%, rgba(39,196,138,0.15) 0%, transparent 55%)',
  alex:   'radial-gradient(ellipse at 60% 30%, rgba(39,196,138,0.1) 0%, transparent 55%)',
}

function ChartCard({ title, subtitle, children, delay = 0, fullWidth = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: '20px 20px 16px',
        gridColumn: fullWidth ? '1 / -1' : undefined,
      }}
    >
      {title && (
        <p style={{
          fontSize: 13, fontWeight: 600,
          marginBottom: subtitle ? 4 : 16,
          lineHeight: 1.3,
        }}>
          {title}
        </p>
      )}
      {subtitle && (
        <p style={{
          fontSize: 11, color: 'var(--color-text-tertiary)',
          marginBottom: 16, lineHeight: 1.4,
        }}>
          {subtitle}
        </p>
      )}
      {children}
    </motion.div>
  )
}

export default function SleepScreen({ persona, onNavigate, onBack }) {
  const gradient = GRADIENTS[persona] || GRADIENTS.yvonne
  const isAlex = persona === 'alex'

  return (
    <div style={{
      height: '100%',
      background: 'var(--color-base)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      flex: 1, overflowY: 'auto',
      padding: '48px',
      zIndex: 1,
    }}>
      <PageContainer>
      <div style={{
        position: 'fixed', inset: 0,
        height: '100%',
        background: gradient, pointerEvents: 'none',
      }} />

      {/* Nav */}
      <div style={{
        position: 'absolute', top: 32, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', zIndex: 10,
      }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>fluent</span>
        <span
        onClick={() => onNavigate('switch')}          
        style={{
            fontSize: 14, color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
        >
          {persona}
        </span>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '48px',
        position: 'relative', zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}
        >
          <h1 style={{
            fontSize: 'clamp(24px, 3vw, 40px)',
            fontWeight: 700, marginBottom: 6,
          }}>
            Sleep
          </h1>
          <p style={{
            color: 'var(--color-text-secondary)', fontSize: 15,
          }}>
            How your body and mind recover overnight
          </p>
        </motion.div>

        {/* Alex — capability gap */}
        {isAlex && (
          <div style={{
            padding: 32, borderRadius: 16,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <p style={{ fontSize: 16, marginBottom: 12, lineHeight: 1.5 }}>
              Sleep staging requires a wearable worn overnight.
            </p>
            <p style={{
              color: 'var(--color-text-tertiary)',
              fontSize: 14, lineHeight: 1.6, marginBottom: 20,
            }}>
              Deep sleep, REM, and overnight HRV are all captured
              during sleep — the most valuable window for understanding
              how your body recovers.
            </p>
            <p
              onClick={() => onNavigate('changed')}
              style={{
                color: 'var(--color-accent)',
                fontSize: 14, cursor: 'pointer',
              }}
            >
              See what Yvonne's sleep data shows →
            </p>
          </div>
        )}

        {/* Wearable personas */}
        {!isAlex && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}>

            {/* Sleep architecture — full width */}
            <ChartCard
              title="Sleep architecture — this week"
              subtitle="Deep · REM · Core · Awake"
              delay={0.1}
              fullWidth
            >
              <SleepArchitectureChart
                persona={persona}
                height={200}
              />
            </ChartCard>

            {/* QQRT pillars — full width */}
            <ChartCard
              title="The four pillars"
              subtitle="Quantity · Quality · Regularity · Timing"
              delay={0.2}
              fullWidth
            >
              <QQRTCard persona={persona} />
            </ChartCard>

            {/* Trend direction cards — full width */}
            <ChartCard
              title="How your sleep has changed"
              subtitle="This quarter vs last quarter"
              delay={0.3}
              fullWidth
            >
              <SleepTrendCards persona={persona} />
            </ChartCard>

            {/* Sleep × HRV quadrant — Yvonne only */}
            {persona === 'yvonne' && (
              <ChartCard
                title="Sleep efficiency × next-day HRV"
                subtitle="When these two signals disagree — that's the finding"
                delay={0.4}
                fullWidth
              >
                <SleepHRVChart height={220} />
              </ChartCard>
            )}

            {/* Epistemic qualifier */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.2)',
                lineHeight: 1.6,
                gridColumn: '1 / -1',
                padding: '0 4px',
              }}
            >
              Sleep data is directional guidance — not a score to optimize.
              Apple Watch sleep staging is directionally accurate.
              Trends matter more than any single night's reading.
            </motion.p>
          </div>
        )}
      </div>

      <FloatingNav active="sleep" onNavigate={onNavigate} />
      </PageContainer>
    </div>
  )
}