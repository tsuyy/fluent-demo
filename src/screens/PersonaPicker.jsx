import { useState } from 'react'
import { motion } from 'framer-motion'
import PageContainer from '../components/layout/PageContainer'
 
const PERSONAS = [
  { id: 'jamie',  name: 'Jamie',  age: 'late 30s',    activity: 'Moderately active', dataProfile: '8 months · inconsistent · minimal annotations',       gradient: 'linear-gradient(135deg, rgba(180,60,60,0.6) 0%, rgba(120,40,140,0.4) 100%)' },
  { id: 'yvonne', name: 'Yvonne', age: 'early 30s',   activity: 'Very active',        dataProfile: '4+ years · consistent · life events documented',        gradient: 'linear-gradient(135deg, rgba(6,129,252,0.5) 0%, rgba(39,196,138,0.3) 100%)' },
  { id: 'robert', name: 'Robert', age: 'retired, 65+', activity: 'Moderately active', dataProfile: '2 years · consistent · minimal annotations',            chips: ['golf', 'garden', 'travel'], gradient: 'linear-gradient(135deg, rgba(39,196,138,0.4) 0%, rgba(80,40,160,0.3) 100%)' },
  { id: 'alex',   name: 'Alex',   age: 'mid 40s',     activity: 'Lightly active',     dataProfile: '5 years phone step data · no wearable',                 gradient: 'linear-gradient(135deg, rgba(39,196,138,0.25) 0%, rgba(100,100,140,0.25) 100%)' },
]
 
// currentPersona — highlights the active profile with a "current" chip + brighter border
// prevScreen     — where back button routes to
export default function PersonaPicker({ onSelect, onBack, currentPersona }) {
  const [hovered, setHovered] = useState(null)
 
  return (
    <>
      <div style={{ width: '100%', minHeight: '100%', background: 'var(--color-base)', display: 'flex', flexDirection: 'column', position: 'relative', flex: 1, overflowY: 'auto', padding: '48px', zIndex: 1 }}>
        <PageContainer>
 
          <div style={{ position: 'absolute', top: 32, left: 48, right: 48, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16, fontWeight: 500 }}>fluent</span>
          </div>
 
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 48, marginTop: 72 }}>
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, marginBottom: 8 }}>Explore sample wearable data</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 16 }}>
              Three synthetic profiles, very different amounts of data. The same system adapts to each.
            </p>
          </motion.div>
 
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, flex: 1 }}>
            {PERSONAS.map((p, i) => {
              const isHovered = hovered === p.id
              const isCurrent = p.id === currentPersona
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)}
                  onClick={() => onSelect(p.id)}
                  style={{ background: p.gradient, borderRadius: 'var(--radius-lg)', border: isCurrent ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.08)', padding: 24, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, transform: isHovered ? 'translateY(-4px)' : 'none', transition: 'transform 0.2s ease, border-color 0.2s ease', height: '100%', maxHeight: 400 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', marginBottom: 8 }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 18 }}>{p.name}</p>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 2 }}>{p.age}</p>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>{p.activity}</p>
                  {p.chips && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {p.chips.map(chip => (
                        <span key={chip} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: '3px 10px', fontSize: 12, color: 'var(--color-text-secondary)' }}>{chip}</span>
                      ))}
                    </div>
                  )}
                  <p style={{ color: 'var(--color-text-tertiary)', fontSize: 12, marginTop: 'auto', lineHeight: 1.5 }}>{p.dataProfile}</p>
                  {isCurrent && (
                    <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', alignSelf: 'flex-start' }}>
                      current
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
 
        </PageContainer>
      </div>
 
      <div style={{ position: 'fixed', bottom: 32, left: 48, right: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, pointerEvents: 'none' }}>
        <span onClick={onBack} style={{ color: 'var(--color-text-tertiary)', fontSize: 14, cursor: 'pointer', pointerEvents: 'all' }}>← back</span>
      </div>
    </>
  )
}