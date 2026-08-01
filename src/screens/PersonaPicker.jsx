import { useState } from 'react'
import { motion } from 'framer-motion'

const PERSONAS = [
  {
    id: 'jamie',
    name: 'Jamie',
    age: 'late 30s',
    activity: 'Moderately active',
    dataProfile: '8 months · inconsistent · minimal annotations',
    gradient: 'linear-gradient(135deg, rgba(180,60,60,0.6) 0%, rgba(120,40,140,0.4) 100%)',
  },
  {
    id: 'yvonne',
    name: 'Yvonne',
    age: 'early 30s',
    activity: 'Very active',
    dataProfile: '4+ years · consistent · life events documented',
    gradient: 'linear-gradient(135deg, rgba(6,129,252,0.5) 0%, rgba(39,196,138,0.3) 100%)',
  },
  {
    id: 'robert',
    name: 'Robert',
    age: 'retired, 65+',
    activity: 'Moderately active',
    dataProfile: '2 years · consistent · minimal annotations',
    chips: ['golf', 'garden', 'travel'],
    gradient: 'linear-gradient(135deg, rgba(39,196,138,0.4) 0%, rgba(80,40,160,0.3) 100%)',
  },
  {
    id: 'alex',
    name: 'Alex',
    age: 'mid 40s',
    activity: 'Lightly active',
    dataProfile: '5 years phone step data · no wearable',
    gradient: 'linear-gradient(135deg, rgba(39,196,138,0.25) 0%, rgba(100,100,140,0.25) 100%)',
  },
]

export default function PersonaPicker({ q1, q2, onSelect }) {
  const [hovered, setHovered] = useState(null)

  // Suggest persona based on Q2
  const suggested =
    q2 === 'consistent'   ? 'yvonne' :
    q2 === 'inconsistent' ? 'jamie'  :
    q2 === 'steps'        ? 'alex'   :
    q2 === 'nothing'      ? 'alex'   : 'yvonne'

  return (
    <div style={{
      width: '100vw', minHeight: '100vh',
      background: 'var(--color-base)',
      display: 'flex', flexDirection: 'column',
      padding: '80px 64px 64px',
      position: 'relative',
    }}>

      {/* Nav */}
      <div style={{
        position: 'absolute', top: 32, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>fluent</span>
      </div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 48, marginTop: 16 }}
      >
        <h1 style={{
          fontSize: 'clamp(24px, 3vw, 40px)',
          fontWeight: 700, marginBottom: 8,
        }}>
          Explore sample wearable data
        </h1>
        {suggested && (
          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: 16,
          }}>
            Based on what you shared,{' '}
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
              {PERSONAS.find(p => p.id === suggested)?.name}'s data
            </span>
            {' '}might resonate with you.
          </p>
        )}
      </motion.div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16, flex: 1,
      }}>
        {PERSONAS.map((p, i) => {
          const isHovered   = hovered === p.id
          const isSuggested = p.id === suggested
          const Q1_LABELS = {
            workouts:  'I want to understand how my workouts affect my body',
            love:      'I want to keep doing the things I love',
            different: 'Something feels different lately',
            explore:   'I want to explore what my data shows about me',
          }

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(p.id)}
              style={{
                background: p.gradient,
                borderRadius: 'var(--radius-lg)',
                border: isSuggested
                  ? '1px solid rgba(255,255,255,0.25)'
                  : '1px solid rgba(255,255,255,0.08)',
                padding: 24,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                transform: isHovered ? 'translateY(-4px)' : 'none',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                minHeight: 0,
                height: '100%',
                maxHeight: 400,
              }}
            >
              {/* Avatar placeholder */}
              <div style={{
                width: 56, height: 56,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                marginBottom: 8,
              }} />

              {/* Name + age */}
              <div>
                <p style={{ fontWeight: 600, fontSize: 18 }}>{p.name}</p>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 13, marginTop: 2,
                }}>
                  {p.age}
                </p>
              </div>

              {/* Activity level */}
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: 13,
              }}>
                {p.activity}
              </p>

              {q1 && (
                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 12, fontStyle: 'italic',
                    lineHeight: 1.5,
                }}>
                    "{Q1_LABELS[q1]}"
                </p>
            )}

              {/* Chips (Robert only) */}
              {p.chips && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {p.chips.map(chip => (
                    <span key={chip} style={{
                      background: 'rgba(255,255,255,0.12)',
                      borderRadius: 20, padding: '3px 10px',
                      fontSize: 12,
                      color: 'var(--color-text-secondary)',
                    }}>
                      {chip}
                    </span>
                  ))}
                </div>
              )}

              {/* Data profile */}
              <p style={{
                color: 'var(--color-text-tertiary)',
                fontSize: 12, marginTop: 'auto',
                lineHeight: 1.5,
              }}>
                {p.dataProfile}
              </p>

              {/* Suggested badge */}
              {isSuggested && (
                <div style={{
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: 6, padding: '4px 10px',
                  fontSize: 11, fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  alignSelf: 'flex-start',
                }}>
                  suggested for you
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Bottom nav */}
      <div style={{
        display: 'flex', justifyContent: 'flex-start',
        marginTop: 32,
      }}>
        <span style={{
          color: 'var(--color-text-tertiary)',
          fontSize: 14, cursor: 'pointer',
        }}>
          ← back
        </span>
      </div>
    </div>
  )
}