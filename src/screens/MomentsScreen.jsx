import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingNav from '../components/nav/FloatingNav'
import PageContainer from '../components/layout/PageContainer'

const MOMENTS = {
  yvonne: [
    {
      id: 'illness',
      date: 'Feb 2026',
      label: 'The 13-day warning',
      type: 'insight',
      color: '#E8504A',
      description: 'Two sensors flagged something 13 days before symptoms appeared. HRV dropped. Wrist temperature rose. Resting HR looked normal.',
      dataNote: 'HRV −10ms · Wrist temp ↑ · RHR stable',
      insight: 'The data noticed before you did.',
    },
    {
      id: 'race',
      date: 'Jun 2026',
      label: 'Half marathon',
      type: 'milestone',
      color: '#27C48A',
      description: 'Race day. 13.1 miles. Your HRV peaked the night before and rebounded within 5 days — faster than any previous hard effort.',
      dataNote: 'HRV 83ms night before · Full recovery day +5',
      insight: '4 years of training showed up on one morning.',
    },
    {
      id: 'seattle',
      date: 'Jun–Jul 2026',
      label: 'Seattle trip',
      type: 'travel',
      color: '#0681fc',
      description: 'Your RHR dropped 5.7 bpm over 12 days — lower than any comparable period in your data. Fluent noticed. You added the context.',
      dataNote: 'RHR −5.7 bpm · Sustained 12 days',
      insight: 'Travel + tennis + cooler weather. The data couldn\'t name it. You could.',
    },
    {
      id: 'tennis_era',
      date: 'Sep 2025',
      label: 'Tennis era begins',
      type: 'pattern',
      color: '#27C48A',
      description: 'A life change coincided with discovering tennis. The data shows what followed — your strongest sustained HRV period outside of the half marathon build.',
      dataNote: 'HRV avg ↑ · Strongest recovery sport confirmed',
      insight: 'The data shows it. What happened is yours.',
    },
  ],
  robert: [
    {
      id: 'retirement',
      date: 'Aug 2023',
      label: 'Retirement',
      type: 'milestone',
      color: '#27C48A',
      description: 'Your resting heart rate rose briefly then settled into a new, lower baseline over 5 months. Your body registered the transition before you finished processing it.',
      dataNote: 'RHR +2.2 bpm first month → −5.8 bpm new baseline',
      insight: 'The body adapts on its own timeline.',
    },
    {
      id: 'golf',
      date: 'Jan 2024',
      label: 'Golf routine established',
      type: 'pattern',
      color: '#0681fc',
      description: 'Once a consistent golf schedule began, the structure dependency pattern became visible — structured weeks showing measurably better recovery than open weeks.',
      dataNote: 'Structured weeks: HRV 33ms vs 26.6ms unstructured',
      insight: 'Structure is a health variable, not just a preference.',
    },
    {
      id: 'portugal',
      date: 'May 2024',
      label: 'Portugal trip',
      type: 'travel',
      color: '#888780',
      description: 'Brief disruption in routine. HRV dipped during travel, recovered within 4 days of returning home.',
      dataNote: 'HRV dip · Recovery day +4',
      insight: 'Your baseline held.',
    },
  ],
  jamie: [
    {
      id: 'start',
      date: 'Aug 2024',
      label: 'Started tracking',
      type: 'milestone',
      color: '#0681fc',
      description: 'The first consistent data. Some gaps from the start — but the patterns began to emerge within the first month.',
      dataNote: '8 months · 73% coverage',
      insight: 'The longer you track, the more meaningful it becomes.',
    },
    {
      id: 'project',
      date: 'Nov 2024',
      label: 'Heavy project period',
      type: 'pattern',
      color: '#E8504A',
      description: 'Your tracking gaps cluster around your busiest school periods. The absence is itself information — your watch wasn\'t charged when things got hard.',
      dataNote: 'Tracking coverage dropped to 52% · Nov 2024',
      insight: 'The data can see the shape of your calendar.',
    },
    {
      id: 'hikes',
      date: 'Jan 2025',
      label: 'Weekend hikes begin',
      type: 'pattern',
      color: '#27C48A',
      description: 'A consistent weekend hiking pattern emerged. Correlates with slightly better Monday recovery readings in weeks that followed.',
      dataNote: 'Monday RHR improved on hike weeks',
      insight: 'Movement you enjoy shows up differently than movement you track.',
    },
  ],
  alex: [
    {
      id: 'pattern',
      date: '2021–2025',
      label: '5 years of movement',
      type: 'insight',
      color: '#0681fc',
      description: 'October peaks and February troughs — every single year without exception. A rhythm you\'ve been living without seeing.',
      dataNote: 'Oct avg: 10,200 steps · Feb avg: 5,680 steps',
      insight: 'Patterns become visible when you look at enough time.',
    },
  ],
}

const TYPE_LABELS = {
  insight:   'insight',
  milestone: 'milestone',
  travel:    'travel',
  pattern:   'pattern',
}

export default function MomentsScreen({ persona, onNavigate, onBack }) {
  const [expanded, setExpanded] = useState(null)
  const moments = MOMENTS[persona] || MOMENTS.jamie

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
        background: 'radial-gradient(ellipse at 30% 60%, rgba(6,129,252,0.08) 0%, transparent 60%)',
      }} />

      {/* Nav */}
      <div style={{
        position: 'absolute', top: 32, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', zIndex: 10,
      }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>fluent</span>
        <span
            onClick={() => onNavigate('suggestion')}          
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
        padding: '100px 24px 120px',
        position: 'relative', zIndex: 1,
      }}>
        <PageContainer>
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
              When life showed up in your data
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
              background: 'rgba(255,255,255,0.08)',
            }} />

            {moments.map((moment, i) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                style={{ marginBottom: 32, position: 'relative' }}
              >
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute',
                  left: -28, top: 6,
                  width: 12, height: 12,
                  borderRadius: '50%',
                  background: moment.color,
                  border: '2px solid var(--color-base)',
                  boxShadow: `0 0 0 1px ${moment.color}40`,
                }} />

                {/* Card */}
                <motion.div
                  onClick={() => setExpanded(
                    expanded === moment.id ? null : moment.id
                  )}
                  whileHover={{ x: 2 }}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${
                      expanded === moment.id
                        ? moment.color + '40'
                        : 'rgba(255,255,255,0.07)'
                    }`,
                    borderRadius: 12,
                    padding: '16px 20px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                >
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: expanded === moment.id ? 16 : 0,
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
                        fontSize: 16, fontWeight: 600,
                        lineHeight: 1.3,
                      }}>
                        {moment.label}
                      </p>
                    </div>
                    <span style={{
                      color: 'rgba(255,255,255,0.2)',
                      fontSize: 12, marginTop: 2,
                      transition: 'transform 0.2s',
                      transform: expanded === moment.id
                        ? 'rotate(90deg)' : 'none',
                    }}>
                      →
                    </span>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {expanded === moment.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={{
                          fontSize: 14, lineHeight: 1.7,
                          color: 'var(--color-text-secondary)',
                          marginBottom: 16,
                        }}>
                          {moment.description}
                        </p>

                        {/* Data note */}
                        <div style={{
                          background: 'rgba(255,255,255,0.04)',
                          borderRadius: 8, padding: '10px 14px',
                          marginBottom: 16,
                          display: 'flex', alignItems: 'center',
                          gap: 8,
                        }}>
                          <span style={{
                            fontSize: 10,
                            color: 'rgba(255,255,255,0.25)',
                            fontFamily: 'monospace',
                          }}>
                            {moment.dataNote}
                          </span>
                        </div>

                        {/* Insight */}
                        <p style={{
                          fontSize: 13,
                          color: moment.color,
                          fontStyle: 'italic',
                          lineHeight: 1.5,
                        }}>
                          "{moment.insight}"
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
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
                lineHeight: 1.7, marginTop: 16,
                paddingLeft: 32,
                fontStyle: 'italic',
              }}
            >
              The data can see it. Whether it matches how you feel —
              that's the conversation Fluent is trying to start.
            </motion.p>
          )}
        </PageContainer>
      </div>

      <FloatingNav active="moments" onNavigate={onNavigate} />
    </div>
  )
}
