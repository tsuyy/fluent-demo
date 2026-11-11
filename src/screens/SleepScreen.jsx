import { motion } from 'framer-motion'
import FloatingNav        from '../components/nav/FloatingNav'
import SleepArchitectureChart from '../components/charts/SleepArchitectureChart'
import SleepHRVChart      from '../components/charts/SleepHRVChart'
import SleepTrendCards    from '../components/cards/SleepTrendCards'
import SleepQQRTSection   from '../components/sleep/SleepQQRTSection'
import PageContainer      from '../components/layout/PageContainer'
import SportSleepChart from '../components/charts/SportSleepChart'
import SleepRegularityChart from '../components/charts/SleepRegularityChart'
import robertSleepTimes from '../data/robert/sleep_times.json'
import sleepQQRTData  from '../data/yvonne/sleep_qqrt.json'   // already exists
import sleepTimesData from '../data/yvonne/sleep_times.json'  // ADD this
import { useIsNarrow } from '../components/scrolly/useIsNarrow'

const PERSONA_LABELS = { jamie: 'Jamie', yvonne: 'Yvonne', robert: 'Robert', alex: 'Alex' }

const GRADIENTS = {
  jamie:  'radial-gradient(ellipse at 15% 70%, rgba(196,80,232,0.2) 0%, transparent 55%)',
  yvonne: 'radial-gradient(ellipse at 80% 20%, rgba(6,129,252,0.15) 0%, rgba(39,196,138,0.08) 40%, transparent 65%)',
  robert: 'radial-gradient(ellipse at 20% 60%, rgba(39,196,138,0.15) 0%, transparent 55%)',
  alex:   'radial-gradient(ellipse at 60% 30%, rgba(39,196,138,0.1) 0%, transparent 55%)',
}

function ChartCard({ title, subtitle, insight, children, delay = 0, fullWidth = false }) {
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
        minWidth: 0, overflow: 'hidden', boxSizing: 'border-box',
      }}
    >
      {title && (
        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: subtitle ? 4 : 16, lineHeight: 1.3 }}>
          {title}
        </p>
      )}
      {subtitle && (
        <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 16, lineHeight: 1.4 }}>
          {subtitle}
        </p>
      )}
      {children}
      {insight && (
          <p style={{
            fontSize: 13, color: 'var(--color-text-tertiary)',
            fontStyle: 'italic', lineHeight: 1.5,
            marginTop: 10,
          }}>
            "{insight}"
          </p>)}
    </motion.div>
  )
}

export default function SleepScreen({ persona, onNavigate, onBack }) {
  const gradient = GRADIENTS[persona] || GRADIENTS.yvonne
  const isAlex   = persona === 'alex'
  const isYvonne = persona === 'yvonne'
  const narrow = useIsNarrow()

  return (
    <div style={{
      height: '100%',
      background: 'var(--color-base)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      flex: 1, overflowY: 'auto',
      zIndex: 1, overflowX: 'hidden'
    }}>
      <PageContainer>
        <div style={{ position: 'fixed', inset: 0, height: '100%', background: gradient, pointerEvents: 'none' }} />

        {/* Nav */}
        <div style={{
          position: 'fixed', top: 32, left: 48, right: 48,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20,
        }}>
          <motion.span whileHover={{ opacity: 0.7 }} onClick={onBack}
            style={{ fontSize: 16, fontWeight: 500, cursor: 'pointer' }}>
            fluent
          </motion.span>
          <motion.span whileHover={{ opacity: 0.7 }} onClick={() => onNavigate('picker')}
            style={{
              fontSize: 14, color: 'var(--color-text-secondary)', cursor: 'pointer',
              flexShrink: 0, whiteSpace: 'nowrap',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20, padding: '4px 12px',
            }}>
            {PERSONA_LABELS[persona] || persona}
          </motion.span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: narrow ? '90px 24px 130px' : '90px 56px 130px', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, marginBottom: 6 }}>
              Sleep
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>
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
              <p style={{ color: 'var(--color-text-tertiary)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                Deep sleep, REM, and overnight HRV are all captured during sleep — the most
                valuable window for understanding how your body recovers.
              </p>
            </div>
          )}

          {/* Wearable personas */}
          {!isAlex && (
            <div style={{ display: 'grid', gridTemplateColumns: narrow ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: 20 }}>

              {/* How your sleep has changed: first for every wearable persona */}
              <ChartCard
                title="How your sleep has changed"
                subtitle="This quarter vs last quarter"
                delay={0.1}
                fullWidth
              >
                <SleepTrendCards persona={persona} />
              </ChartCard>

              {/* ── Yvonne: QQRT with real charts ── */}
              {isYvonne && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{ gridColumn: '1 / -1' }}
                >
                  <SleepQQRTSection data={sleepQQRTData} sleepTimes={sleepTimesData} />
                </motion.div>
              )}

              {/* ── Non-Yvonne: sleep architecture first ── */}
              {!isYvonne && (
                <ChartCard
                  title="Sleep architecture — this week"
                  subtitle="Deep · REM · Core · Awake"
                  delay={0.1}
                  fullWidth
                >
                  <SleepArchitectureChart persona={persona} height={200} />
                </ChartCard>
              )}

              {persona === 'robert' && (
                <ChartCard
                  title="How regular is your bedtime?"
                  subtitle="Every night, Jun 2023 – May 2025"
                  delay={0.2}
                  fullWidth
                  insight={`${robertSleepTimes.eras[0].anchor_pct}% of nights you were in bed between 9 and 11pm, and almost none after midnight. Your bedtime moves about 31 minutes either way, which is steady.`}
                >
                  <SleepRegularityChart data={robertSleepTimes.eras[0]} height={170} />
                </ChartCard>
              )}

              {isYvonne && (
                <ChartCard
                  title="Sleep after each sport"
                  subtitle="Average deep, REM and awake minutes on the night after a session, against all nights · tap a sport to compare"
                  delay={0.3}
                  fullWidth
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <SportSleepChart size={340} />
                  </div>
                </ChartCard>
              )}

              {/* Epistemic qualifier */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{
                  fontSize: 13, color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.6, gridColumn: '1 / -1', padding: '0 4px',
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