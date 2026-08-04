import { motion } from 'framer-motion'
import FloatingNav from '../components/nav/FloatingNav'
import QuarterlyArcChart from '../components/charts/QuarterlyArcChart'
import RHRTrendChart from '../components/charts/RHRTrendChart'
import HRRecoveryChart from '../components/charts/HRRecoveryChart'
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
        borderRadius: 16,
        padding: '20px 20px 12px',
        gridColumn: fullWidth ? '1 / -1' : undefined,
      }}
    >
      <p style={{
        fontSize: 13, fontWeight: 600,
        marginBottom: 4, lineHeight: 1.3,
      }}>
        {title}
      </p>
      {subtitle && (
        <p style={{
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
          marginBottom: 12, lineHeight: 1.4,
        }}>
          {subtitle}
        </p>
      )}
      {children}
    </motion.div>
  )
}

// Respiratory rate trend — simple line
function RespRateCard() {
  return (
    <div style={{ padding: '16px 0 8px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', marginBottom: 16,
      }}>
        <div>
          <p style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
            15.8
          </p>
          <p style={{
            fontSize: 11, color: 'var(--color-text-tertiary)',
            marginTop: 4,
          }}>
            breaths/min · today
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{
            fontSize: 13, color: 'var(--color-recovery)',
            fontWeight: 500,
          }}>
            ↓ from 20–22
          </p>
          <p style={{
            fontSize: 11, color: 'var(--color-text-tertiary)',
          }}>
            when you started
          </p>
        </div>
      </div>
      <p style={{
        fontSize: 12, color: 'var(--color-text-tertiary)',
        lineHeight: 1.6,
      }}>
        The most underrated signal in your data. Correlates almost
        perfectly with your HRV improvements (r = −0.879).
      </p>
    </div>
  )
}

// Blood panel static card
function BloodPanelCard() {
  const markers = [
    { label: 'hs-CRP (inflammation)', from: '0.6', to: '0.2', dir: 'down' },
    { label: 'Triglycerides',         from: '116', to: '68',  dir: 'down' },
    { label: 'HDL cholesterol',       from: '72',  to: '93',  dir: 'up'   },
  ]
  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {markers.map(m => (
          <div key={m.label} style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center',
            padding: '48px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 8,
          }}>
            <span style={{
              fontSize: 12, color: 'var(--color-text-secondary)',
            }}>
              {m.label}
            </span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                fontSize: 11, color: 'var(--color-text-tertiary)',
              }}>
                {m.from}
              </span>
              <span style={{
                color: m.dir === 'down'
                  ? 'var(--color-recovery)'
                  : 'var(--color-accent)',
                fontSize: 12,
              }}>
                → {m.to} {m.dir === 'down' ? '↓' : '↑'}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p style={{
        fontSize: 11, color: 'var(--color-text-tertiary)',
        marginTop: 12, lineHeight: 1.5,
      }}>
        Directional trends only. Not clinical guidance.
      </p>
    </div>
  )
}

export default function HeartNervousSystemScreen({ persona, onNavigate, onBack }) {
  const gradient = GRADIENTS[persona] || GRADIENTS.yvonne
  const isYvonne = persona === 'yvonne'
  const isRobert = persona === 'robert'
  const isJamie  = persona === 'jamie'

  return (
    <div style={{
      background: 'var(--color-base)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      flex: 1, overflowY: 'auto',
      padding: '48px',
      zIndex: 1,
    }}>

      <div style={{
        position: 'absolute', inset: 0,
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
            onClick={() => onNavigate('suggestion')}  // ← routes to picker
            style={{
            fontSize: 14,
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            }}
        >
            {persona}
        </span>
    </div>
    <PageContainer>

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
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}>
            {/* Full width — quarterly arc */}
            <ChartCard
              title="Your cardiovascular arc — 18 quarters"
              subtitle="RHR declining, HRV climbing. The two lines tell the same story."
              delay={0.1}
              fullWidth
            >
              <QuarterlyArcChart height={260} />
            </ChartCard>

            {/* HR recovery trend */}
            <ChartCard
              title="HR recovery by sport"
              subtitle="How fast your heart resets — improving +57% year over year"
              delay={0.2}
            >
              <HRRecoveryChart height={180} />
            </ChartCard>

            {/* Respiratory rate */}
            <ChartCard
              title="Breathing rate"
              subtitle="Captured during sleep — your most underrated signal"
              delay={0.3}
            >
              <RespRateCard />
            </ChartCard>

            {/* Blood panel — full width */}
            <ChartCard
              title="Blood panel context"
              subtitle="Annual markers alongside 4 years of training data"
              delay={0.4}
              fullWidth
            >
              <BloodPanelCard />
            </ChartCard>
          </div>
        )}

        {/* Jamie */}
        {isJamie && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
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
            gridTemplateColumns: '1fr 1fr',
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