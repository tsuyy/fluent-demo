import { motion } from 'framer-motion'
import FloatingNav from '../components/nav/FloatingNav'
import SportRecoveryBars from '../components/charts/SportRecoveryBars'
import StackingBars from '../components/charts/StackingBars'
import MovementCalendar from '../components/charts/MovementCalendar'
import calendarData from '../data/yvonne/calendar.json'
import PageContainer from '../components/layout/PageContainer'
import { useIsNarrow } from '../components/scrolly/useIsNarrow'



const GRADIENTS = {
  yvonne: 'radial-gradient(ellipse at 80% 20%, rgba(6,129,252,0.15) 0%, rgba(39,196,138,0.08) 40%, transparent 65%)',
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

      </div>

      {/* Floating nav */}
      <FloatingNav active="activity" onNavigate={onNavigate} />
      </PageContainer>
    </div>
  )
}
