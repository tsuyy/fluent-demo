import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = [
  {
    id: 'different',
    label: 'Something feels different lately',
    description: 'A pattern shifted in your data.',
    icon: '↗',
  },
  {
    id: 'changed',
    label: "How I've changed over time",
    description: 'Through the lens of your wearable data.',
    icon: '·L·',
  },
  {
    id: 'activity',
    label: 'Movement & Recovery',
    description: 'What you do, what it costs, and how your body responds.',
    icon: '✳',
  },
  {
    id: 'cardio',
    label: 'Heart & Nervous System',
    description: 'Your cardiovascular health over time.',
    icon: '♥',
  },
  {
    id: 'sleep',
    label: 'Sleep',
    description: 'What your sleep is actually doing.',
    icon: '◗',
  },
  {
    id: 'moments',
    label: 'Moments that shaped my health',
    description: 'When life showed up in your data.',
    icon: '◉',
  },
]

const GRADIENTS = {
  jamie:  'radial-gradient(ellipse at 15% 70%, rgba(180,60,60,0.25) 0%, transparent 55%)',
  yvonne: 'radial-gradient(ellipse at 80% 20%, rgba(6,129,252,0.2) 0%, rgba(39,196,138,0.1) 40%, transparent 65%)',
  robert: 'radial-gradient(ellipse at 20% 60%, rgba(39,196,138,0.2) 0%, transparent 55%)',
  alex:   'radial-gradient(ellipse at 60% 30%, rgba(39,196,138,0.12) 0%, transparent 55%)',
}

export default function HomeScreen({ persona, onNavigate, onPersonaSwitch }) {
  const [hovered, setHovered] = useState(null)
  const gradient = GRADIENTS[persona] || GRADIENTS.yvonne
  const personaLabel = persona
    ? persona.charAt(0).toUpperCase() + persona.slice(1)
    : ''

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'var(--color-base)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      padding: '80px 120px',
    }}>

      {/* Background gradient */}
      <motion.div
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: 'absolute', inset: 0,
          background: gradient, pointerEvents: 'none',
        }}
      />

      {/* Nav */}
      <div style={{
        position: 'absolute', top: 32, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', zIndex: 10,
      }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>fluent</span>
        <motion.span
          onClick={onPersonaSwitch}
          whileHover={{ opacity: 0.7 }}
          style={{
            fontSize: 14,
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
        >
          {personaLabel}
        </motion.span>
      </div>

      {/* Question */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          fontSize: 'clamp(36px, 5vw, 72px)',
          fontWeight: 700,
          marginBottom: 56,
          lineHeight: 1.1,
          position: 'relative', zIndex: 1,
        }}
      >
        What are you curious<br />about today?
      </motion.h1>

      {/* Category list */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: 80,
        rowGap: 4,
        position: 'relative', zIndex: 1,
        maxWidth: 900,
      }}>
        {CATEGORIES.map((cat, i) => {
          const isHovered = hovered === cat.id
          const isOther   = hovered && hovered !== cat.id

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
              style={{ position: 'relative' }}
            >
              <motion.p
                onMouseEnter={() => setHovered(cat.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onNavigate(cat.id)}
                animate={{
                  opacity: isOther ? 0.3 : 1,
                  x: isHovered ? 4 : 0,
                }}
                transition={{ duration: 0.15 }}
                style={{
                  fontSize: 'clamp(15px, 1.6vw, 22px)',
                  cursor: 'pointer',
                  padding: '10px 0',
                  lineHeight: 1.3,
                  userSelect: 'none',
                  fontWeight: isHovered ? 500 : 400,
                }}
              >
                {cat.label}
              </motion.p>

              {/* Hover tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      left: '105%', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(30,30,28,0.95)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 10,
                      padding: '10px 14px',
                      display: 'flex', alignItems: 'center', gap: 10,
                      whiteSpace: 'nowrap',
                      zIndex: 20,
                      backdropFilter: 'blur(12px)',
                      pointerEvents: 'none',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{cat.icon}</span>
                    <span style={{
                      fontSize: 13,
                      color: 'var(--color-text-secondary)',
                    }}>
                      {cat.description}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom left back arrow */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onPersonaSwitch}
        style={{
          position: 'absolute', bottom: 36, left: 48,
          color: 'var(--color-text-tertiary)',
          fontSize: 14, cursor: 'pointer',
          zIndex: 10,
        }}
      >
        ←
      </motion.span>

    </div>
  )
}