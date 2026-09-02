import { motion } from 'framer-motion'
import FloatingNav from '../components/nav/FloatingNav'
import QuarterlyArcChart from '../components/charts/QuarterlyArcChart'
import RHRTrendChart from '../components/charts/RHRTrendChart'
import HRRecoveryChart from '../components/charts/HRRecoveryChart'
import PageContainer from '../components/layout/PageContainer'
import { useIsNarrow } from '../components/scrolly/useIsNarrow'
import Zone2ProgressChart from '../components/charts/Zone2ProgressChart'
import zone2Data          from '../data/yvonne/zone2_running.json'
import CyclingAdaptationChart from '../components/charts/CyclingAdaptationChart'
import cyclingData            from '../data/yvonne/cycling_efficiency.json'
import quarterlyArc           from '../data/yvonne/quarterly_arc.json'
import cyclingLongRides from '../data/yvonne/cycling_long_rides.json'  // NOT cycling_efficiency.json



const GRADIENTS = {
  jamie:  'radial-gradient(ellipse at 15% 70%, rgba(180,60,60,0.2) 0%, transparent 55%)',
  yvonne: 'radial-gradient(ellipse at 80% 20%, rgba(6,129,252,0.15) 0%, rgba(39,196,138,0.08) 40%, transparent 65%)',
  robert: 'radial-gradient(ellipse at 20% 60%, rgba(39,196,138,0.15) 0%, transparent 55%)',
  alex:   'radial-gradient(ellipse at 60% 30%, rgba(39,196,138,0.1) 0%, transparent 55%)',
}

const PERSONA_LABELS = { jamie: 'Jamie', yvonne: 'Yvonne', robert: 'Robert', alex: 'Alex' }

function ChartCard({ title, subtitle, insight, children, delay = 0, fullWidth = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '20px 20px 12px',
        gridColumn: fullWidth ? '1 / -1' : undefined,
      }}
    >
      <p>{title}</p>
        {subtitle && <p>{subtitle}</p>}
        {children}
        {insight && (
          <p style={{
            fontSize: 12, color: 'var(--color-text-tertiary)',
            fontStyle: 'italic', lineHeight: 1.5,
            marginTop: 10,
          }}>
            "{insight}"
          </p>
        )}
    </motion.div>
  )
}


export default function HeartNervousSystemScreen({ persona, onNavigate, onBack }) {
  const gradient = GRADIENTS[persona] || GRADIENTS.yvonne
  const isYvonne = persona === 'yvonne'
  const isRobert = persona === 'robert'
  const isJamie  = persona === 'jamie'

  const narrow = useIsNarrow()

  return (
    <div style={{
      background: 'var(--color-base)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      flex: 1, overflowY: 'auto',
      zIndex: 1,
    }}>

      <div style={{
        position: 'absolute', inset: 0,
        background: gradient, pointerEvents: 'none',
      }} />

      {/* Nav */}
      <div style={{
        position: 'fixed', top: 32, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', zIndex: 20,
      }}>
        <motion.span
          whileHover={{ opacity: 0.7 }}
          onClick={onBack}
          style={{ fontSize: 16, fontWeight: 500, cursor: 'pointer' }}
        >
          fluent
        </motion.span>
        <motion.span
          whileHover={{ opacity: 0.7 }}
          onClick={() => onNavigate('picker')}
          style={{
            fontSize: 14,
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            flexShrink: 0, whiteSpace: 'nowrap',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20, padding: '4px 12px',
          }}
        >
          {PERSONA_LABELS[persona] || persona}
        </motion.span>
      </div>
    <PageContainer>

      {/* Content */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: narrow ? '90px 24px 130px' : '90px 56px 130px',
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
            Heart & Nervous System
          </h1>
          <p style={{
            color: 'var(--color-text-secondary)', fontSize: 15,
          }}>
            Your cardiovascular health over time
          </p>
        </motion.div>

        {/* Yvonne */}
         {isYvonne && (
    <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: 20 }}>
      {/* Section 1 — unchanged */}
      <ChartCard
        title="Your cardiovascular arc — 4 years"
        subtitle="RHR declining, HRV climbing. The two lines tell the same story."
        delay={0.1}
        insight="Breathing rate dropping alongside HRV climbing isn't a coincidence — both track the same underlying shift in how hard your resting body is working."
        fullWidth
      >
          <QuarterlyArcChart data={quarterlyArc} height={280} />
      </ChartCard>
      <ChartCard
        title="Cycling efficiency"
        subtitle="Long rides · same heart rate · higher speed"
        delay={0.2}
        insight="Same effort, meaningfully more speed — this is what getting fitter actually looks like in the data, not just feeling fitter."
      >
        <CyclingAdaptationChart data={cyclingLongRides} height={200} />
      </ChartCard>
      <ChartCard
        title="Zone 2 running"
        subtitle="HR 130–148 · 23 sessions · 2024–2026"
        delay={0.3}
        insight="The July 2026 run is the whole story in one point: more distance, lower heart rate, same 'easy' effort you'd have called hard two years ago."
      >
        <Zone2ProgressChart data={zone2Data} height={200} />
      </ChartCard>

      {/* Section 3 — unchanged, now full width on its own row */}
      <ChartCard
        title="How fast your heart recovers after effort"
        subtitle="HR recovery by sport"
        delay={0.4}
        insight="Running clears the most heart-rate load in the extra 30 seconds — the other sports mostly finish recovering by the one-minute mark."
        fullWidth
      >
        <HRRecoveryChart height={200} />
      </ChartCard>
    </div>
  )}

        {/* Jamie */}
        {isJamie && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : '1fr 1fr',
            gap: 20,
          }}>
            <ChartCard
              title="Resting heart rate"
              subtitle="8 months of gradual improvement"
              delay={0.1}
              fullWidth
            >
              <RHRTrendChart height={180} />
            </ChartCard>

            <ChartCard
              title="HRV weekly pattern"
              subtitle="Your nervous system follows your weekly rhythm"
              delay={0.2}
              fullWidth
            >
              <div style={{
                height: 160,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{
                  color: 'var(--color-text-tertiary)', fontSize: 11,
                }}>
                  HRV day-of-week pattern
                </span>
              </div>
            </ChartCard>
          </div>
        )}

        {/* Robert */}
        {isRobert && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : '1fr 1fr',
            gap: 20,
          }}>
            <ChartCard
              title="Resting heart rate — 2 years"
              subtitle="Before and after retirement"
              delay={0.1}
              fullWidth
            >
              <RHRTrendChart height={200} />
            </ChartCard>

            <ChartCard
              title="HRV stability"
              subtitle="Structured weeks consistently show better nervous system recovery"
              delay={0.2}
              fullWidth
            >
              <div style={{
                padding: 20,
                display: 'flex', gap: 24,
              }}>
                {[
                  { label: 'Structured weeks', hrv: 33.0, rhr: 57.9 },
                  { label: 'Unstructured weeks', hrv: 26.6, rhr: 62.0 },
                ].map(w => (
                  <div key={w.label} style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 10, padding: 16,
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <p style={{
                      fontSize: 11, color: 'var(--color-text-tertiary)',
                      marginBottom: 12,
                    }}>
                      {w.label}
                    </p>
                    <p style={{ fontSize: 26, fontWeight: 700 }}>
                      {w.hrv}ms
                    </p>
                    <p style={{
                      fontSize: 11, color: 'var(--color-text-tertiary)',
                      marginTop: 4,
                    }}>
                      avg HRV
                    </p>
                    <p style={{
                      fontSize: 14, marginTop: 12,
                      color: 'var(--color-text-secondary)',
                    }}>
                      {w.rhr} bpm RHR
                    </p>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        )}

        {/* Alex */}
        {!isYvonne && !isJamie && !isRobert && (
          <div style={{
            padding: 32,
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <p style={{
              fontSize: 16, marginBottom: 12, lineHeight: 1.5,
            }}>
              Cardiovascular signals require a wearable worn overnight.
            </p>
            <p style={{
              color: 'var(--color-text-tertiary)',
              fontSize: 14, lineHeight: 1.6,
            }}>
              Resting heart rate, HRV, and respiratory rate are all captured
              during sleep — the most reliable window for autonomic measurement.
            </p>
            <p
              onClick={() => onNavigate('changed')}
              style={{
                color: 'var(--color-accent)',
                fontSize: 14, marginTop: 20,
                cursor: 'pointer',
              }}
            >
              See what Yvonne's data shows →
            </p>
          </div>
        )}
      </div>
      </PageContainer>

      <FloatingNav active="cardio" onNavigate={onNavigate} />
    </div>
  )
}