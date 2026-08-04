import { motion, AnimatePresence } from 'framer-motion'
import FloatingNav from '../components/nav/FloatingNav'
import IconDifferent from '../components/nav/icons/IconDifferent'
import IconChanged   from '../components/nav/icons/IconChanged'
import IconActivity  from '../components/nav/icons/IconActivity'
import IconCardio    from '../components/nav/icons/IconCardio'
import IconSleep     from '../components/nav/icons/IconSleep'
import IconMoments   from '../components/nav/icons/IconMoments'
import { useState, useEffect } from 'react'
import PageContainer from '../components/layout/PageContainer'


const CATEGORIES = [
  {
    id: 'different',
    label: 'Something feels different lately',
    description: 'A pattern shifted in your data.',
    Icon: IconDifferent,
  },
  {
    id: 'changed',
    label: "How I've changed over time",
    description: 'Through the lens of your wearable data.',
    Icon: IconChanged,
  },
  {
    id: 'activity',
    label: 'Movement & Recovery',
    description: 'What you do, what it costs, and how your body responds.',
    Icon: IconActivity,
  },
  {
    id: 'cardio',
    label: 'Heart & Nervous System',
    description: 'Your cardiovascular health over time.',
    Icon: IconCardio,
  },
  {
    id: 'sleep',
    label: 'Sleep',
    description: 'What your sleep is actually doing.',
    Icon: IconSleep,
  },
  {
    id: 'moments',
    label: 'Moments that shaped my health',
    description: 'When life showed up in your data.',
    Icon: IconMoments,
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const gradient = GRADIENTS[persona] || GRADIENTS.yvonne
  const personaLabel = persona
    ? persona.charAt(0).toUpperCase() + persona.slice(1)
    : ''

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--color-base)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      padding: '48px',
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
          onClick={() => onNavigate('suggestion')}
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
      <PageContainer>

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

            </motion.div>
          )
        })}
      </div>
      </PageContainer>
      {/* <FloatingNav active={null} onNavigate={onNavigate} /> */}
      <AnimatePresence>
        {hovered && (() => {
          const cat = CATEGORIES.find(c => c.id === hovered)
          if (!cat) return null
          return (
            <motion.div
              key={hovered}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              style={{
                position: 'fixed',
                left: mousePos.x + 20,   // 20px offset from cursor
                top: mousePos.y - 20,    // slightly above cursor
                background: 'rgba(20,20,18,0.92)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                whiteSpace: 'nowrap',
                zIndex: 1000,
                backdropFilter: 'blur(12px)',
                pointerEvents: 'none',  // critical — doesn't block clicks
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              <cat.Icon size={18} color="rgba(255,255,255,0.7)" />
              <span style={{
                fontSize: 13,
                color: 'var(--color-text-secondary)',
              }}>
                {cat.description}
              </span>
            </motion.div>
          )
        })()}
      </AnimatePresence>


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