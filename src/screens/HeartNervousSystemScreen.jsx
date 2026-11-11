import { useEffect } from 'react'
import { motion } from 'framer-motion'
import FloatingNav from '../components/nav/FloatingNav'
import QuarterlyArcChart from '../components/charts/QuarterlyArcChart'
import RHRTrendChart from '../components/charts/RHRTrendChart'
import WeeklyRhythmFullChart from '../components/charts/WeeklyRhythmFullChart'
import HRRecoveryChart from '../components/charts/HRRecoveryChart'
import PageContainer from '../components/layout/PageContainer'
import { useIsNarrow } from '../components/scrolly/useIsNarrow'
import Zone2ProgressChart from '../components/charts/Zone2ProgressChart'
import zone2Data          from '../data/yvonne/zone2_running.json'
import HRSpeedChart         from '../components/charts/HRSpeedChart'
import SoberExperimentChart from '../components/charts/SoberExperimentChart'
import NightsComparisonChart from '../components/charts/NightsComparisonChart'
import quarterlyArc         from '../data/yvonne/quarterly_arc.json'
import hrEfficiency         from '../data/yvonne/hr_efficiency.json'
import soberExperiment      from '../data/yvonne/sober_experiment.json'
import soberComparison      from '../data/yvonne/sober_comparison.json'
import substanceNights      from '../data/yvonne/substance_nights.json'


const GRADIENTS = {
  jamie:  'radial-gradient(ellipse at 15% 70%, rgba(196,80,232,0.2) 0%, transparent 55%)',
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
      <p style={{ fontSize: 14, fontWeight: 600, marginBottom: subtitle ? 4 : 16, lineHeight: 1.3 }}>{title}</p>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 16, lineHeight: 1.4 }}>{subtitle}</p>}
        {children}
        {insight && (
          <p style={{
            fontSize: 13, color: 'var(--color-text-tertiary)',
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

  // Moments links here with a target; jump to it once the cards have mounted.
  useEffect(() => {
    let target = null
    try { target = sessionStorage.getItem('fluent.scrollTo'); sessionStorage.removeItem('fluent.scrollTo') } catch { /* storage unavailable */ }
    if (!target) return
    const t = setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 450)
    return () => clearTimeout(t)
  }, [])

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
            <ChartCard
              title="Your cardiovascular arc — nearly 5 years"
              subtitle="Resting heart rate down; HRV and VO2 max up. Breathing rate down."
              delay={0.1}
              insight="These moved together over the same years. My training, my watch and Apple's VO2 estimate also changed, so this shows a pattern with an open cause."
              fullWidth
            >
              <QuarterlyArcChart data={quarterlyArc} height={280} showVo2 />
              {quarterlyArc.vo2_note && (
                <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', lineHeight: 1.5, margin: '8px 0 0' }}>{quarterlyArc.vo2_note}</p>
              )}
            </ChartCard>

            <ChartCard
              title="Speed at the same heart rate"
              subtitle="Every cycling and running session at a similar heart rate"
              delay={0.2}
              fullWidth
            >
              <HRSpeedChart data={hrEfficiency} height={200} />
            </ChartCard>

            <ChartCard
              title="Zone 2 running"
              subtitle="HR 130–148 · 23 sessions · 2024–2026"
              delay={0.3}
              insight="The July 2026 run is the whole story in one point: more distance, lower heart rate, same 'easy' effort you'd have called hard two years ago."
              fullWidth
            >
              <Zone2ProgressChart data={zone2Data} height={200} />
            </ChartCard>

            <ChartCard
              title="How fast your heart recovers after effort"
              subtitle="HR recovery by sport"
              delay={0.4}
              insight="Running clears the most heart-rate load in the extra 30 seconds — the other sports mostly finish recovering by the one-minute mark."
              fullWidth
            >
              <HRRecoveryChart height={200} />
            </ChartCard>

            <div id="sober-experiment" style={{ gridColumn: '1 / -1' }}>
              <ChartCard
                title="Alcohol-free experiment, Jul 6–20"
                subtitle="14 nights without alcohol vs the 30 nights before: HRV, resting heart rate, breathing rate and sleep stages"
                delay={0.5}
                fullWidth
              >
                <SoberExperimentChart data={soberExperiment} height={200} />
                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />
                <NightsComparisonChart data={soberComparison} refId="before" showDots={false} />
              </ChartCard>
            </div>

            <div id="substance-nights" style={{ gridColumn: '1 / -1' }}>
              <ChartCard
                title="After the experiment: nights with and without"
                subtitle="Jul 21 – Oct 20 · alcohol you logged, scored on the following night"
                delay={0.6}
                insight="On average, more drinks went with lower HRV, and resting heart rate barely moved. One of the three heavier nights was above my usual, and every group is small and self-reported, so this is a pattern to test, not a result."
                fullWidth
              >
                <NightsComparisonChart data={substanceNights} refId="home" />
              </ChartCard>
            </div>
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
              subtitle="HRV by day, last 8 weeks"
              delay={0.2}
              fullWidth
            >
              <WeeklyRhythmFullChart height={200} metric="HRV" />
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: '12px 0 4px', fontStyle: 'italic' }}>
                "HRV mirrors your heart rate: about 41 ms on Mondays and 32.5 ms on Saturdays, against 36.7 ms across these weeks."
              </p>
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
                      fontSize: 13, color: 'var(--color-text-tertiary)',
                      marginBottom: 12,
                    }}>
                      {w.label}
                    </p>
                    <p style={{ fontSize: 26, fontWeight: 700 }}>
                      {w.hrv}ms
                    </p>
                    <p style={{
                      fontSize: 13, color: 'var(--color-text-tertiary)',
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
          </div>
        )}
      </div>
      </PageContainer>

      <FloatingNav active="cardio" onNavigate={onNavigate} />
    </div>
  )
}