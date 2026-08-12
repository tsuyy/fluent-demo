import { motion } from 'framer-motion'
import FloatingNav from '../components/nav/FloatingNav'
import SportHRVChart from '../components/charts/SportHRVChart'
import RetirementArcChart from '../components/charts/RetirementArcChart'
import SeasonalStepsChart from '../components/charts/SeasonalStepsChart'
import HRRecoveryChart from '../components/charts/HRRecoveryChart'
import SportMixChart from '../components/charts/SportMixChart'
import PageContainer from '../components/layout/PageContainer'

const PERSONA_LABELS = { jamie: 'Jamie', yvonne: 'Yvonne', robert: 'Robert', alex: 'Alex' }

const GRADIENTS = {
  jamie:  'radial-gradient(ellipse at 15% 70%, rgba(180,60,60,0.2) 0%, transparent 55%)',
  yvonne: 'radial-gradient(ellipse at 80% 20%, rgba(6,129,252,0.15) 0%, rgba(39,196,138,0.08) 40%, transparent 65%)',
  robert: 'radial-gradient(ellipse at 20% 60%, rgba(39,196,138,0.15) 0%, transparent 55%)',
  alex:   'radial-gradient(ellipse at 60% 30%, rgba(39,196,138,0.1) 0%, transparent 55%)',
}

function ChartCard({ title, subtitle, children, delay = 0 }) {
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
          marginBottom: 12,
          lineHeight: 1.4,
        }}>
          {subtitle}
        </p>
      )}
      {children}
    </motion.div>
  )
}

export default function MovementRecoveryScreen({ persona, onNavigate, onBack }) {
  const gradient = GRADIENTS[persona] || GRADIENTS.yvonne

  const isYvonne = persona === 'yvonne'
  const isRobert = persona === 'robert'
  const isAlex   = persona === 'alex'
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

      <PageContainer>

      {/* Background */}
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

      {/* Content */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '48px',
        position: 'relative', zIndex: 1,
      }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}
        >
          <h1 style={{
            fontSize: 'clamp(24px, 3vw, 40px)',
            fontWeight: 700, marginBottom: 6,
          }}>
            Movement & Recovery
          </h1>
          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: 15,
          }}>
            What you do, what it costs, and how your body responds
          </p>
        </motion.div>

        {/* Yvonne — richest view */}
        {isYvonne && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Top row — two charts */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
            }}>
              <ChartCard
                title="How each sport affects your recovery"
                subtitle="HRV deviation from baseline, day-of through day+3"
                delay={0.1}
              >
                <SportHRVChart height={200}  />
              </ChartCard>

              <ChartCard
                title="HR recovery by sport"
                subtitle="How fast your heart resets after each activity"
                delay={0.2}
              >
                <HRRecoveryChart height={200} />
              </ChartCard>
            </div>

            {/* Bottom — full width sport mix */}
              <ChartCard
                title="How your activity has shifted over the years"
                subtitle="Sport mix evolution 2022 → 2026"
                delay={0.3}
              >
                <SportMixChart height={160} />
              </ChartCard>
          </div>
        )}

        {/* Jamie — simpler */}
        {isJamie && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <ChartCard
              title="Your weekly rhythm"
              subtitle="How your body responds across the week"
              delay={0.1}
            >
              <div style={{
                height: 180,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{
                  color: 'var(--color-text-tertiary)', fontSize: 11,
                }}>
                  weekly rhythm chart
                </span>
              </div>
            </ChartCard>

            <ChartCard
              title="Activity levels"
              subtitle="How much you've been moving month by month"
              delay={0.2}
            >
              <SeasonalStepsChart height={160} />
            </ChartCard>
          </div>
        )}

        {/* Robert */}
        {isRobert && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <ChartCard
              title="Activity before and after retirement"
              subtitle="How your movement changed"
              delay={0.1}
            >
              <RetirementArcChart height={180} />
            </ChartCard>

            <ChartCard
              title="Structured vs unstructured weeks"
              subtitle="Your body responds differently based on how your week is shaped"
              delay={0.2}
            >
              <div style={{
                height: 160, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  color: 'var(--color-text-tertiary)', fontSize: 11,
                }}>
                  structure comparison chart
                </span>
              </div>
            </ChartCard>
          </div>
        )}

        {/* Alex */}
        {isAlex && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <ChartCard
              title="Your seasonal step pattern"
              subtitle="How your movement changes across the year"
              delay={0.1}
            >
              <SeasonalStepsChart height={180} />
            </ChartCard>

            <ChartCard
              title="What steps can't tell you"
              subtitle="Here's where a wearable would add depth"
              delay={0.2}
            >
              <div style={{
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                {[
                  { label: 'Recovery signals', desc: 'How your body responded' },
                  { label: 'Sleep quality', desc: 'How you recovered overnight' },
                  { label: 'Cardiovascular trend', desc: 'How your heart is adapting' },
                ].map((layer, i) => (
                  <motion.div
                    key={layer.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 0.5, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: 8,
                      border: '1px dashed rgba(255,255,255,0.08)',
                    }}
                  >
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)',
                      flexShrink: 0,
                    }} />
                    <div>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                        {layer.label}
                      </p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                        {layer.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <p style={{
                  fontSize: 12,
                  color: 'var(--color-text-tertiary)',
                  marginTop: 8, lineHeight: 1.5,
                }}>
                  See what a wearable would add →
                </p>
              </div>
            </ChartCard>
          </div>
        )}
      </div>

      {/* Floating nav */}
      <FloatingNav active="activity" onNavigate={onNavigate} />
      </PageContainer>
    </div>
  )
}
