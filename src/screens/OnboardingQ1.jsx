import { useState } from 'react'
import { motion } from 'framer-motion'

const OPTIONS = [
  { id: 'workouts', text: 'I want to understand how my workouts are affecting my body' },
  { id: 'love',     text: 'I want to keep doing the things I love' },
  { id: 'different',text: 'Something feels different lately' },
  { id: 'explore',  text: 'I want to explore what my data actually shows about me' },
]

export default function OnboardingQ1({ onSelect }) {
  const [hovered,  setHovered]  = useState(null)
  const [selected, setSelected] = useState(null)

  function handleSelect(id) {
    setSelected(id)
    setTimeout(() => onSelect(id), 400)
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'var(--color-base)',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      padding: '80px 120px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Subtle gradient background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 20% 60%, rgba(6,129,252,0.08) 0%, transparent 60%)',
      }} />

      {/* Nav */}
      <div style={{
        position: 'absolute', top: 32, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ color: 'var(--color-text-primary)', fontSize: 16, fontWeight: 500 }}>
          fluent
        </span>
        <button
          onClick={() => onSelect(null)}
          style={{
            background: 'none', border: 'none',
            color: 'var(--color-text-tertiary)',
            fontSize: 14, cursor: 'pointer',
          }}
        >
          skip
        </button>
      </div>

      {/* Question */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          fontSize: 'clamp(28px, 4vw, 52px)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: 56,
          lineHeight: 1.15,
          maxWidth: 700,
        }}
      >
        What brings you here?
      </motion.h1>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {OPTIONS.map((opt, i) => {
          const isHovered  = hovered === opt.id
          const isSelected = selected === opt.id
          const isOther    = hovered && hovered !== opt.id

          return (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
            >
              <motion.p
                onMouseEnter={() => setHovered(opt.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleSelect(opt.id)}
                animate={{
                  opacity: isSelected ? 1
                         : isOther    ? 0.35
                         : 1,
                  scale: isHovered || isSelected ? 1.02 : 1,
                  color: isSelected ? '#0681fc' : '#ffffff',
                }}
                transition={{ duration: 0.15 }}
                style={{
                  fontSize: 'clamp(16px, 2vw, 22px)',
                  cursor: 'pointer',
                  lineHeight: 1.4,
                  userSelect: 'none',
                  transformOrigin: 'left center',
                  display: 'inline-block',
                }}
              >
                {opt.text}
              </motion.p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
