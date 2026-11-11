import { motion } from 'framer-motion'
import FloatingNav from '../components/nav/FloatingNav'
import SportRecoveryBars from '../components/charts/SportRecoveryBars'
import StackingBars from '../components/charts/StackingBars'
import StructureCompareBars from '../components/charts/StructureCompareBars'
import WeeklyRhythmFullChart from '../components/charts/WeeklyRhythmFullChart'
import RetirementArcChart from '../components/charts/RetirementArcChart'
import SeasonalStepsChart from '../components/charts/SeasonalStepsChart'
import MovementCalendar from '../components/charts/MovementCalendar'
import calendarData from '../data/yvonne/calendar.json'
import PageContainer from '../components/layout/PageContainer'
import { useIsNarrow } from '../components/scrolly/useIsNarrow'


const PERSONA_LABELS = { jamie: 'Jamie', yvonne: 'Yvonne', robert: 'Robert', alex: 'Alex' }

const GRADIENTS = {
  jamie:  'radial-gradient(ellipse at 15% 70%, rgba(196,80,232,0.2) 0%, transparent 55%)',
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
        fontSize: 14, fontWeight: 600,
        marginBottom: 4, lineHeight: 1.3,
      }}>
        {title}
      </p>
      {subtitle && (
        <p style={{
          fontSize: 13,
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
  const narrow = useIsNarrow()
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
        padding: narrow ? '90px 24px 130px' : '90px 56px 130px',
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
            <ChartCard
              title="When you moved"
              subtitle="Daily active minutes, 2022 to now · pick a sport to filter"
              delay={0.05}
            >
              <MovementCalendar data={calendarData} />
            </ChartCard>

            {/* Sport recovery — full width */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
               <ChartCard
                title="How each sport affects your recovery"
                subtitle="Average HRV change from your 30-night baseline, at its biggest point in the 3 days after a session"
                delay={0.1}
              >
                <SportRecoveryBars />
              </ChartCard>

              <ChartCard
                title="Does stacking active days cost you?"
                subtitle="Next morning's HRV change, by how many active days came in a row"
                delay={0.2}
              >
                <StackingBars />
              </ChartCard>
            </div>

          </div>
        )}

        {/* Jamie — simpler */}
        {isJamie && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <ChartCard
              title="Your weekly rhythm"
              subtitle="Resting heart rate by day, last 8 weeks"
              delay={0.1}
            >
              <WeeklyRhythmFullChart height={200} metric="RHR" />
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: '12px 0 4px', fontStyle: 'italic' }}>
                "Resting heart rate is lowest on Mondays (68 bpm on average) and highest on Saturdays (75 bpm)."
              </p>
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
              subtitle="Weeks with plans vs weeks with an open calendar"
              delay={0.2}
            >
              <StructureCompareBars />
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
                      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                        {layer.label}
                      </p>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.52)' }}>
                        {layer.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <p style={{
                  fontSize: 13,
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
