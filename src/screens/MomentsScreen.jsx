import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingNav from '../components/nav/FloatingNav'
import PageContainer from '../components/layout/PageContainer'
import IllnessArcChart      from '../components/charts/IllnessArcChart'
import SoberExperimentChart from '../components/charts/SoberExperimentChart'
import SportHRVChart         from '../components/charts/SportHRVChart'
import RHRTrendChart         from '../components/charts/RHRTrendChart'
import illnessArcData        from '../data/yvonne/illness_arc.json'
import soberData              from '../data/yvonne/sober_experiment.json'
import RetirementArcChart from '../components/charts/RetirementArcChart'
import SeasonalStepsChart from '../components/charts/SeasonalStepsChart'

// ── Moment data ────────────────────────────────────────────────────────────
// Ordered most recent → oldest (reverse chronological)
// User scrolls down to go further into the past

const MOMENTS = {
  yvonne: [
    {
      id: 'sober_experiment',
      date: 'Jul 6–20 2026',
      label: 'Alcohol-free experiment',
      type: 'pattern',
      color: '#27C48A',
      chart: 'sober_experiment',
      observation: 'Fourteen days alcohol-free. Training, sleep, and diet unchanged. HRV rose 10.8ms — a 24% increase. Deep sleep added 13 minutes per night. Resting heart rate barely moved.',
      insight: "The experiment ended. The signal didn't.",
      dataNote: 'HRV +10.8ms · Deep sleep +13min · RHR flat · Jul 6–20',
      annotation: null,
      forwardLink: { label: 'See the full data →', cardId: 'sober_experiment' },
    },
    {
      id: 'race',
      date: 'Jun 2026',
      label: 'Half marathon',
      type: 'milestone',
      color: '#27C48A',
      chart: 'rhr_trend',
      observation: 'HRV peaked the night before and rebounded within 5 days — faster than any previous hard effort.',
      insight: 'Four years of training showed up on one morning.',
      dataNote: 'HRV 83ms night before · Full recovery day +5',
      annotation: null,
      forwardLink: { label: 'See your cardiovascular arc →', screen: 'changed' },
    },
     {
      id: 'illness_arc',
      date: 'Feb 2026',
      label: 'Two signals, twelve days before you felt it',
      type: 'insight',
      color: '#E8504A',
      chart: 'illness_arc',
      observation: 'Feb 11: HRV dropped 10ms below baseline, wrist temperature elevated. Feb 12: the signal strengthened. Then it appeared to resolve. Feb 20: RHR spiked 18 bpm above baseline. Feb 23 was the peak — RHR +33 bpm, HRV at near personal low.',
      insight: 'The data noticed before you did.',
      dataNote: 'HRV −10ms · Wrist temp +1.09° · Feb 11  |  RHR +33 · HRV −28.6ms · Feb 23',
      annotation: null,
      forwardLink: { label: 'See the full data →', cardId: 'illness_arc' },
    },
    {
      id: 'tennis_era',
      date: 'Sep 2025',
      label: 'Tennis era begins',
      type: 'pattern',
      color: '#27C48A',
      chart: 'sport_hrv',
      observation: 'Back-to-back sessions September 6–7 produced your highest-ever tennis HRV responses. +35ms day+2. Nothing before or since has matched it.',
      insight: 'The data can see ease. It can\'t see why.',
      dataNote: 'HRV +35ms day+2 · Sep 6–7 2025 · All-time tennis high',
      annotation: 'A life change coincided with discovering tennis.',
      forwardLink: { label: 'See sport HRV analysis →', screen: 'activity' },
    },
    {
      id: 'base_building',
      date: 'Aug–Sep 2023',
      label: 'Getting worse before getting better',
      type: 'pattern',
      color: '#0681fc',
      chart: 'rhr_trend',
      observation: 'HRV was consistently suppressed for weeks. Active calories were running 50% above your baseline. At the time it looked like accumulated fatigue.',
      insight: 'The data looked like a warning. Looking back, it was the work.',
      dataNote: 'HRV −5 to −9ms sustained · Active cal +50% · Aug–Sep 2023',
      annotation: null,
      forwardLink: null,
    },
  ],

  robert: [
    {
      id: 'structure',
      date: 'Mar 2025',
      label: 'Structure as a health variable',
      type: 'pattern',
      color: '#0681fc',
      chart: 'retirement_arc',
      observation: 'Weeks with consistent plans — golf, social commitments, scheduled activity — show measurably different recovery signals than weeks without structure.',
      insight: 'Structure isn\'t just a preference. For your body, it\'s a recovery tool.',
      dataNote: 'Structured: HRV 33ms, RHR 57.9 · Unstructured: HRV 26.6, RHR 62.0',
      annotation: null,
      forwardLink: null,
    },
    {
      id: 'portugal',
      date: 'May 2024',
      label: 'Portugal trip',
      type: 'travel',
      color: '#888780',
      chart: null,
      observation: 'Brief disruption in routine. HRV dipped during travel, recovered within 4 days of returning home.',
      insight: 'Your baseline held.',
      dataNote: 'HRV dip · Recovery day +4',
      annotation: null,
      forwardLink: null,
    },
    {
      id: 'golf_routine',
      date: 'Jan 2024',
      label: 'Golf routine established',
      type: 'pattern',
      color: '#0681fc',
      chart: null,
      observation: 'Once a consistent golf schedule began, the structure dependency pattern became visible in the data.',
      insight: 'Routine created regularity. Regularity showed up in your recovery.',
      dataNote: 'Structured weeks: HRV consistently higher',
      annotation: null,
      forwardLink: null,
    },
    {
      id: 'retirement',
      date: 'Aug 2023',
      label: 'Retirement',
      type: 'milestone',
      color: '#27C48A',
      chart: 'retirement_arc',
      observation: 'Your resting heart rate rose briefly then settled into a new, lower baseline over 5 months. Your body registered the transition before you finished processing it.',
      insight: 'The body adapts on its own timeline.',
      dataNote: 'RHR +2.2 bpm first month → −5.8 bpm new baseline',
      annotation: null,
      forwardLink: { label: 'See your cardiovascular arc →', screen: 'changed' },
    },
  ],

  jamie: [
    {
      id: 'hikes',
      date: 'Jan 2025',
      label: 'Weekend hikes begin',
      type: 'pattern',
      color: '#27C48A',
      chart: null,
      observation: 'A consistent weekend hiking pattern emerged. Monday recovery readings improved in weeks that followed.',
      insight: 'Movement you enjoy shows up differently than movement you track.',
      dataNote: 'Monday RHR improved on hike weeks',
      annotation: null,
      forwardLink: null,
    },
    {
      id: 'project',
      date: 'Nov 2024',
      label: 'Heavy project period',
      type: 'insight',
      color: '#E8504A',
      chart: null,
      observation: 'Your tracking gaps cluster around your busiest periods. The absence is itself information — your watch wasn\'t charged when things got hard.',
      insight: 'The data can see the shape of your calendar.',
      dataNote: 'Tracking coverage dropped to 52% · Nov 2024',
      annotation: null,
      forwardLink: null,
    },
    {
      id: 'start',
      date: 'Aug 2024',
      label: 'Started tracking',
      type: 'milestone',
      color: '#0681fc',
      chart: null,
      observation: 'The first consistent data. Some gaps from the start — but the patterns began to emerge within the first month.',
      insight: 'The longer you track, the more meaningful it becomes.',
      dataNote: '8 months · 73% coverage',
      annotation: null,
      forwardLink: null,
    },
  ],

  alex: [
    {
      id: 'pattern',
      date: '2021–2025',
      label: '5 years of movement',
      type: 'insight',
      color: '#0681fc',
      chart: 'seasonal_steps',
      observation: 'October peaks and February troughs — every single year without exception. A rhythm you\'ve been living without seeing.',
      insight: 'Patterns become visible when you look at enough time.',
      dataNote: 'Oct avg: 10,200 steps · Feb avg: 5,680 steps',
      annotation: null,
      forwardLink: null,
    },
  ],
}

const TYPE_LABELS = {
  insight:   'insight',
  milestone: 'milestone',
  travel:    'travel',
  pattern:   'pattern',
}

// ── Annotation bottom sheet ────────────────────────────────────────────────
const ANNOTATION_CHIPS = [
  'Travel', 'Training', 'Life change', 'Stress',
  'Illness', 'Social', 'Work', 'Something else',
]

function AnnotationSheet({ onSave, onCancel, existing }) {
  const [text, setText] = useState(existing?.text || '')
  const [chips, setChips] = useState(existing?.chips || [])

  function toggleChip(chip) {
    setChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: '#1A1A18',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px 16px 0 0',
        padding: '24px 24px 40px',
        zIndex: 200,
      }}
    >
      <p style={{
        fontSize: 14, fontWeight: 600,
        marginBottom: 16,
      }}>
        What was happening around this time?
      </p>

      {/* Quick chips */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8,
        marginBottom: 16,
      }}>
        {ANNOTATION_CHIPS.map(chip => (
          <motion.span
            key={chip}
            onClick={() => toggleChip(chip)}
            whileHover={{ scale: 1.02 }}
            style={{
              background: chips.includes(chip)
                ? 'rgba(39,196,138,0.15)'
                : 'rgba(255,255,255,0.06)',
              border: chips.includes(chip)
                ? '1px solid rgba(39,196,138,0.4)'
                : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: '6px 14px',
              fontSize: 13,
              cursor: 'pointer',
              color: chips.includes(chip)
                ? '#27C48A'
                : 'var(--color-text-secondary)',
              transition: 'all 0.15s',
            }}
          >
            {chip}
          </motion.span>
        ))}
      </div>

      {/* Freetext */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Or add your own context..."
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: '12px 14px',
          fontSize: 14,
          color: '#fff',
          fontFamily: 'inherit',
          resize: 'none',
          minHeight: 80,
          marginBottom: 16,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      <div style={{ display: 'flex', gap: 10 }}>
        <motion.button
          onClick={() => onSave({ text, chips })}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            flex: 1,
            background: 'var(--color-accent)',
            border: 'none',
            borderRadius: 8,
            padding: '12px',
            color: '#fff',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Save
        </motion.button>
        <motion.button
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '12px',
            color: 'var(--color-text-secondary)',
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Cancel
        </motion.button>
      </div>
    </motion.div>
  )
}

// ── Mini chart by type ─────────────────────────────────────────────────────
  function MomentChart({ type }) {
    if (!type) return null
    if (type === 'rhr_trend')        return <RHRTrendChart height={140} />
    if (type === 'sport_hrv')        return <SportHRVChart height={140} />
    if (type === 'retirement_arc')   return <RetirementArcChart height={140} />
    if (type === 'seasonal_steps')   return <SeasonalStepsChart height={140} />
    if (type === 'illness_arc')      return <IllnessArcChart data={illnessArcData} height={140} compact />
    if (type === 'sober_experiment') return <SoberExperimentChart data={soberData} height={140} compact />
    return null
  }

// ── Single moment card ─────────────────────────────────────────────────────
function MomentCard({
  moment, isExpanded, onToggle,
  annotation, onAnnotate, onDeleteAnnotation,
  showAnnotationSheet, onOpenSheet, onCloseSheet,
  onForwardLink, delay,
}) {
  const displayAnnotation = annotation || (moment.annotation
    ? { text: moment.annotation, chips: [] }
    : null)

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      style={{ marginBottom: 24, position: 'relative' }}
    >
      {/* Timeline dot */}
      <div style={{
        position: 'absolute',
        left: -28, top: 8,
        width: 12, height: 12,
        borderRadius: '50%',
        background: moment.color,
        border: '2px solid var(--color-base)',
        boxShadow: `0 0 0 1px ${moment.color}40`,
        zIndex: 1,
      }} />

      {/* Card */}
      <motion.div
        onClick={onToggle}
        whileHover={{ x: isExpanded ? 0 : 2 }}
        style={{
          background: isExpanded
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(255,255,255,0.03)',
          border: `1px solid ${isExpanded
            ? moment.color + '30'
            : 'rgba(255,255,255,0.06)'}`,
          borderRadius: 12,
          padding: isExpanded ? '18px 20px 20px' : '14px 20px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {/* Header — always visible */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 8, marginBottom: 4,
            }}>
              <span style={{
                fontSize: 10,
                color: moment.color,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}>
                {TYPE_LABELS[moment.type]}
              </span>
              <span style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.25)',
              }}>
                {moment.date}
              </span>
            </div>
            <p style={{
              fontSize: 15, fontWeight: 600,
              lineHeight: 1.3,
            }}>
              {moment.label}
            </p>
          </div>
          <motion.span
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              color: 'rgba(255,255,255,0.2)',
              fontSize: 12, marginTop: 2, flexShrink: 0,
            }}
          >
            →
          </motion.span>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ paddingTop: 16 }}>

                {/* Mini chart */}
                {moment.chart && (
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 8,
                    padding: '12px 8px 4px',
                    marginBottom: 16,
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <MomentChart type={moment.chart} />
                  </div>
                )}

                {/* Observation */}
                <p style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                  marginBottom: 12,
                }}>
                  {moment.observation}
                </p>

                {/* Data note */}
                <p style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.25)',
                  fontFamily: 'monospace',
                  marginBottom: 12,
                  lineHeight: 1.5,
                }}>
                  {moment.dataNote}
                </p>

                {/* User annotation — if present */}
                {displayAnnotation && (
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    marginBottom: 12,
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <p style={{
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.3)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      marginBottom: 6,
                    }}>
                      Your context
                    </p>
                    {displayAnnotation.chips?.length > 0 && (
                      <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: 6,
                        marginBottom: displayAnnotation.text ? 8 : 0,
                      }}>
                        {displayAnnotation.chips.map(chip => (
                          <span key={chip} style={{
                            background: 'rgba(39,196,138,0.1)',
                            border: '1px solid rgba(39,196,138,0.2)',
                            borderRadius: 12,
                            padding: '3px 10px',
                            fontSize: 12,
                            color: '#27C48A',
                          }}>
                            {chip}
                          </span>
                        ))}
                      </div>
                    )}
                    {displayAnnotation.text && (
                      <p style={{
                        fontSize: 13,
                        color: 'var(--color-text-secondary)',
                        fontStyle: 'italic',
                        lineHeight: 1.5,
                      }}>
                        "{displayAnnotation.text}"
                      </p>
                    )}
                    <p
                      onClick={() => {
                        onDeleteAnnotation?.()
                        onOpenSheet()
                      }}
                      style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.25)',
                        marginTop: 8,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        textDecorationColor: 'rgba(255,255,255,0.15)',
                      }}
                    >
                      Edit
                    </p>
                  </div>
                )}

                {/* Insight line */}
                <p style={{
                  fontSize: 13,
                  color: moment.color,
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                  marginBottom: 16,
                }}>
                  "{moment.insight}"
                </p>

                {/* Add context / forward link */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  {!displayAnnotation ? (
                    <p
                      onClick={onOpenSheet}
                      style={{
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.3)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      + Add context
                    </p>
                  ) : <div />}

                {moment.forwardLink && (
                  <p
                    onClick={(e) => { e.stopPropagation(); onForwardLink(moment.forwardLink) }}
                    style={{
                      fontSize: 13,
                      color: 'var(--color-accent)',
                      cursor: 'pointer',
                    }}
                  >
                    {moment.forwardLink.label}
                  </p>
                )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ── Main screen ────────────────────────────────────────────────────────────
export default function MomentsScreen({ persona, onNavigate, onBack, onFlow2 }) {
  const moments = MOMENTS[persona] || MOMENTS.jamie

  // Default: first moment (most recent) expanded
  const [expanded, setExpanded] = useState(moments[0]?.id || null)
  const [annotations, setAnnotations] = useState({})  // momentId → { text, chips }
  const [annotationSheet, setAnnotationSheet] = useState(null) // momentId or null

  function handleToggle(id) {
    setExpanded(prev => prev === id ? null : id)
  }

  function handleSaveAnnotation(momentId, annotation) {
    setAnnotations(prev => ({ ...prev, [momentId]: annotation }))
    setAnnotationSheet(null)
  }

  function handleDeleteAnnotation(momentId) {
    setAnnotations(prev => {
      const next = { ...prev }
      delete next[momentId]
      return next
    })
  }
    function handleForwardLink(link) {
    if (link.screen) {
      onNavigate(link.screen)
    } else if (link.cardId) {
      onFlow2?.(link.cardId)
    }
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--color-base)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      flex: 1,
    }}>

      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 30% 60%, rgba(6,129,252,0.07) 0%, transparent 60%)',
      }} />

      {/* Nav */}
      <div style={{
        position: 'absolute', top: 32, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', zIndex: 10,
      }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>fluent</span>
        <span
          onClick={onBack}
          style={{
            fontSize: 14, color: 'var(--color-text-secondary)',
            cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
          }}
        >
          {persona}
        </span>
      </div>

      {/* Scrollable content */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '100px 24px 120px',
        position: 'relative', zIndex: 1,
      }}>
        <PageContainer>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 48 }}
          >
            <h1 style={{
              fontSize: 'clamp(24px, 3vw, 40px)',
              fontWeight: 700, marginBottom: 6,
            }}>
              Moments that shaped my health
            </h1>
            <p style={{
              color: 'var(--color-text-secondary)', fontSize: 15,
            }}>
              Where data and life intersect
            </p>
          </motion.div>

          {/* Timeline */}
          <div style={{
            position: 'relative',
            paddingLeft: 32,
          }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: 7, top: 8, bottom: 8,
              width: 1,
              background: 'rgba(255,255,255,0.07)',
            }} />

            {moments.map((moment, i) => (
              <MomentCard
                key={moment.id}
                moment={moment}
                isExpanded={expanded === moment.id}
                onToggle={() => handleToggle(moment.id)}
                annotation={annotations[moment.id] || null}
                onOpenSheet={() => {
                  setExpanded(moment.id)
                  setAnnotationSheet(moment.id)
                }}
                onCloseSheet={() => setAnnotationSheet(null)}
                onDeleteAnnotation={() => handleDeleteAnnotation(moment.id)}
                showAnnotationSheet={annotationSheet === moment.id}
                onForwardLink={handleForwardLink}
                delay={0.05 + i * 0.06}
              />
            ))}
          </div>

          {/* Closing line — Yvonne only */}
          {persona === 'yvonne' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.2)',
                lineHeight: 1.7,
                marginTop: 16,
                paddingLeft: 32,
                fontStyle: 'italic',
              }}
            >
              The data can see it. Whether it matches how you feel —
              that's the conversation Fluent is trying to start.
            </motion.p>
          )}

          {/* Alex — forward invitation */}
          {persona === 'alex' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                marginTop: 32, paddingLeft: 32,
              }}
            >
              <p style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.25)',
                lineHeight: 1.7,
              }}>
                Life context makes patterns meaningful. With a wearable
                and a few notes over time, Fluent can tell you not just
                when things changed — but why.
              </p>
            </motion.div>
          )}

        </PageContainer>
      </div>

      {/* Annotation bottom sheet */}
      <AnimatePresence>
        {annotationSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAnnotationSheet(null)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 199,
              }}
            />
            <AnnotationSheet
              existing={annotations[annotationSheet]}
              onSave={(annotation) =>
                handleSaveAnnotation(annotationSheet, annotation)
              }
              onCancel={() => setAnnotationSheet(null)}
            />
          </>
        )}
      </AnimatePresence>

      <FloatingNav active="moments" onNavigate={onNavigate} />
    </div>
  )
}