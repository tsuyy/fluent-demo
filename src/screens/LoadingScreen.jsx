import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageContainer from '../components/layout/PageContainer'


const COPY = {
  jamie: {
    headline: "Loading Jamie's data...",
    lines: [
      "8 months of inconsistent wearable data.",
      "Some weeks have gaps — her watch wasn't always charged. Fluent shows what's there and names what isn't.",
      "Jamie's question: why do some weeks feel so much harder than others?",
      "This takes about 30 seconds.",
    ],
    gradient: "radial-gradient(ellipse at 20% 60%, rgba(180,60,60,0.45) 0%, rgba(120,40,140,0.3) 45%, transparent 70%)",
  },
  yvonne: {
    headline: "Loading Yvonne's data...",
    lines: [
      "1,645 days of consistent wearable data.",
      "Looking for patterns across sleep, activity, cardiovascular data, and life annotations.",
      "Yvonne's question: what's actually shaping how she feels?",
      "This takes about 30 seconds.",
    ],
    gradient: "radial-gradient(ellipse at 70% 30%, rgba(6,129,252,0.35) 0%, rgba(39,196,138,0.2) 50%, transparent 70%)",
  },
  robert: {
    headline: "Loading Robert's data...",
    lines: [
      "547 days of consistent wearable data.",
      "Looking for patterns across activity, cardiovascular health, and sleep.",
      "Robert's question: what did retiring actually do to his body?",
      "This takes about 30 seconds.",
    ],
    gradient: "radial-gradient(ellipse at 30% 70%, rgba(39,196,138,0.3) 0%, rgba(80,40,160,0.2) 50%, transparent 70%)",
  },
  alex: {
    headline: "Loading Alex's data...",
    lines: [
      "Alex's activity history from phone step tracking — no wearable.",
      "Fluent shows what's visible from steps alone and where a tracker would add depth.",
      "Alex's question: what does his phone already know about him?",
      "This takes about 30 seconds.",
    ],
    gradient: "radial-gradient(ellipse at 60% 40%, rgba(39,196,138,0.2) 0%, rgba(100,100,140,0.2) 50%, transparent 70%)",
  },
}

export default function LoadingScreen({ persona, onComplete }) {
  const [visibleLines, setVisibleLines] = useState(0)
  const copy = COPY[persona] || COPY.yvonne

  useEffect(() => {
    setVisibleLines(0)
    const timers = copy.lines.map((_, i) =>
      setTimeout(() => setVisibleLines(v => Math.max(v, i + 1)),
        600 + i * 700)
    )
    const done = setTimeout(onComplete,
      600 + copy.lines.length * 700 + 1000)
    return () => { timers.forEach(clearTimeout); clearTimeout(done) }
  }, [persona])

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--color-base)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center',
      padding: '48px',
    }}>
    <PageContainer>

      {/* Animated gradient */}
      <motion.div
        key={persona}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0,
          background: copy.gradient,
          pointerEvents: 'none',
        }}
      />

      {/* Nav */}
      <div style={{
        position: 'absolute', top: 32, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>fluent</span>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
        <motion.h1
          key={`headline-${persona}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 700,
            marginBottom: 40,
            lineHeight: 1.15,
          }}
        >
          {copy.headline}
        </motion.h1>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          <AnimatePresence>
            {copy.lines.slice(0, visibleLines).map((line, i) => (
              <motion.p
                key={`${persona}-line-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontSize: i === 2 ? 18 : 15,
                  fontStyle: i === 2 ? 'italic' : 'normal',
                  color: i === copy.lines.length - 1
                    ? 'var(--color-text-tertiary)'
                    : i === 2
                    ? 'var(--color-text-secondary)'
                    : 'var(--color-text-primary)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {line}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      </div>
      </PageContainer>

    </div>
  )
}