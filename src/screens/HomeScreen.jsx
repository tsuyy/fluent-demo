import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageContainer from '../components/layout/PageContainer'
import IconDifferent from '../components/nav/icons/IconDifferent'
import IconChanged   from '../components/nav/icons/IconChanged'
import IconActivity  from '../components/nav/icons/IconActivity'
import IconCardio    from '../components/nav/icons/IconCardio'
import IconSleep     from '../components/nav/icons/IconSleep'
import IconMoments   from '../components/nav/icons/IconMoments'
import AnimatedMeshBackground from '../components/backgrounds/AnimatedMeshBackground'
import { useIsNarrow } from '../components/scrolly/useIsNarrow'

const CATEGORIES = [
  { id: 'different', label: 'Something feels different lately', description: 'You bring the feeling. Fluent checks the data.', Icon: IconDifferent },
  { id: 'changed',   label: "How I've changed over time",       description: 'How your body has shifted over months and years', Icon: IconChanged },
  { id: 'activity',  label: 'Movement & Recovery',               description: 'What you do, what it costs, and how your body responds', Icon: IconActivity },
  { id: 'cardio',    label: 'Heart & Nervous System',             description: 'Your cardiovascular health over time', Icon: IconCardio },
  { id: 'sleep',     label: 'Sleep',                              description: 'How your body and mind recover overnight', Icon: IconSleep },
  { id: 'moments',   label: 'Moments that shaped my health',      description: 'Where data and life intersect', Icon: IconMoments },
]

const PERSONA_LABELS = { jamie: 'Jamie', yvonne: 'Yvonne', robert: 'Robert', alex: 'Alex' }

export default function HomeScreen({ persona, onNavigate, onBack, onPersonaSwitch }) {
  const [hovered,  setHovered]  = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const narrow = useIsNarrow()

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  const personaLabel = PERSONA_LABELS[persona] || persona

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--color-base)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: narrow ? '24px' : '48px',
      boxSizing: 'border-box',
    }}>
      <AnimatedMeshBackground animated opacity={0.9} />

      <div style={{
        position: 'fixed', top: 32, left: narrow ? 24 : 48, right: narrow ? 24 : 48,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 20,
      }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>fluent</span>
        <motion.span
          whileHover={{ opacity: 0.7 }}
          onClick={onPersonaSwitch}
          style={{
            fontSize: 14, color: 'var(--color-text-secondary)',
            cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20, padding: '4px 12px',
          }}
        >
          {personaLabel}
        </motion.span>
      </div>

      <PageContainer>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: narrow ? 'clamp(28px, 8vw, 48px)' : 'clamp(36px, 5vw, 72px)',
            fontWeight: 700, marginBottom: narrow ? 32 : 56, lineHeight: 1.1,
            position: 'relative', zIndex: 1,
          }}
        >
          {narrow
            ? 'What are you curious about today?'  // no forced <br> — wraps naturally at any width
            : <>What are you curious<br />about today?</>}
        </motion.h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : '1fr 1fr',
          columnGap: 80, rowGap: narrow ? 20 : 4,
          position: 'relative', zIndex: 1, maxWidth: 900,
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
              >
                <motion.p
                  onMouseEnter={() => setHovered(cat.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onNavigate(cat.id)}
                  animate={{ opacity: isOther ? 0.3 : 1, x: isHovered ? 4 : 0 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    fontSize: narrow ? 18 : 'clamp(24px, 1.6vw, 22px)',
                    cursor: 'pointer', padding: '10px 0',
                    lineHeight: 1.3, userSelect: 'none',
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

      <AnimatePresence>
        {hovered && !narrow && (() => {
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
                left: Math.min(mousePos.x + 20, window.innerWidth - 280),
                top: Math.max(mousePos.y - 20, 10),
                background: 'rgba(20, 20, 18, 0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                whiteSpace: 'nowrap', zIndex: 1000,
                backdropFilter: 'blur(20px)',
                pointerEvents: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              <cat.Icon size={32} color="rgba(255,255,255,1)" />
              <span style={{ fontSize: 22, color: 'rgba(255,255,255,1)' }}>{cat.description}</span>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onBack}
        style={{
          position: 'fixed', bottom: 36, left: narrow ? 24 : 48,
          color: 'var(--color-text-tertiary)',
          fontSize: 14, cursor: 'pointer', zIndex: 10,
        }}
      >
        ←
      </motion.span>
    </div>
  )
}