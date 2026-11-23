import { motion } from 'framer-motion'
import PageContainer      from '../components/layout/PageContainer'
import FloatingNav        from '../components/nav/FloatingNav'
import IllnessArcChart      from '../components/charts/IllnessArcChart'
import SoberExperimentChart from '../components/charts/SoberExperimentChart'
import illnessArcData  from '../data/yvonne/illness_arc.json'
import soberData        from '../data/yvonne/sober_experiment.json'
import { useIsNarrow } from '../components/scrolly/useIsNarrow'
 
const CARDS = {
  yvonne: [
    {
      id: 'illness_arc',
      headline: 'Elevated wrist temperature and HRV drop, Feb 11\u201312',
      subtitle: 'Fluent can show the change. You know what was going on.',
      viz: 'illness_arc',
    },
    {
      id: 'sober_experiment',
      headline: "Alcohol-free experiment · Jul 6\u201320",
      subtitle: "Here's what your data showed",
      viz: 'sober_experiment',
    },
  ],
}
 
const GRADIENTS = {
  yvonne: 'radial-gradient(ellipse at 70% 30%, rgba(6,129,252,0.2) 0%, rgba(39,196,138,0.1) 50%, transparent 70%)',
}
 
 
function VizPlaceholder({ type, persona }) {
  if (type === 'illness_arc')
    return <IllnessArcChart data={illnessArcData} height={130} compact={true} />
  if (type === 'sober_experiment')
    return <SoberExperimentChart data={soberData} height={130} compact />  
  if (!type) return null
  return (
    <div style={{ height: 140, background: 'rgba(255,255,255,0.05)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '16px 0' }}>
      <span style={{ color: 'var(--color-text-tertiary)', fontSize: 13, letterSpacing: '0.05em' }}>{type?.replace(/_/g, ' ')}</span>
    </div>
  )
}
 
// Props:
//   onExplore(cardId | 'home') — card tap

// No onBack — fluent wordmark routes to thesis instead
export default function WhatFluentNoticed({ persona, onExplore, onHome, onNavigate }) {
  const cards    = CARDS[persona]     || CARDS.yvonne
  const gradient = GRADIENTS[persona] || GRADIENTS.yvonne
  const narrow = useIsNarrow()
 
  return (
    <div style={{
     width: '100%', height: '100%',
     background: 'var(--color-base)',
     position: 'relative', overflow: 'hidden',
     overflowX: 'hidden',
     display: 'flex', flexDirection: 'column',
     boxSizing: 'border-box',
   }}>
 
      <div style={{ position: 'absolute', inset: 0, background: gradient, pointerEvents: 'none' }} />
 
      {/* Top nav — fluent routes back to thesis, persona chip opens picker */}
      <div style={{ position: 'fixed', top: 32, left: narrow ? 16 : 48, right: narrow ? 16 : 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}>
        <motion.span
          whileHover={{ opacity: 0.7 }}
          onClick={onHome}
          style={{ fontSize: 16, fontWeight: 500, cursor: 'pointer' }}
        >
          fluent
        </motion.span>
      </div>
      <div style={{
      flex: 1, overflowY: 'auto',
      padding: narrow ? '90px 20px 130px' : '90px 48px 130px',
      position: 'relative', zIndex: 1,
    }}>
      <PageContainer>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, marginBottom: 48, position: 'relative', zIndex: 1, marginTop: 80 }}
        >
          Here's what Fluent noticed
        </motion.h1>
 
        <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: 24, alignItems: 'stretch', position: 'relative', zIndex: 1 }}>
            {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              onClick={() => onExplore(card.id)}
              style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-lg)', padding: 28, cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'border-color 0.2s, transform 0.2s', minHeight: 320, maxHeight: 440 }}
              whileHover={{ borderColor: 'rgba(255,255,255,0.2)', y: -2 }}
            >
              <h2 style={{ fontSize: 'clamp(16px, 1.5vw, 22px)', fontWeight: 600, lineHeight: 1.3, marginBottom: 12 }}>{card.headline}</h2>
              <VizPlaceholder type={card.viz} persona={persona} />
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.6, marginTop: 'auto' }}>{card.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </div>
      <FloatingNav active="noticed" onNavigate={onNavigate} />
    </div>
  )
}
 