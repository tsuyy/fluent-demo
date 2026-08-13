import { createContext, useContext, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/* ------------------------------------------------------------------ *
 * Scene context — every scene exposes its current beat to descendants.
 * `beat` is an integer: -1 = nothing revealed, 0 = first line, etc.
 * ------------------------------------------------------------------ */

const SceneContext = createContext({ beat: -1, isActive: false, reduced: false })

export const useScene = () => useContext(SceneContext)

/* ------------------------------------------------------------------ *
 * Beat — reveals its children once the scene reaches beat index `at`.
 * Stays in document flow while hidden so nothing jumps on reveal.
 * ------------------------------------------------------------------ */

export function Beat({ at, children, y = 16, duration = 0.7, delay = 0, style }) {
  const { beat, reduced } = useScene()
  const visible = beat >= at

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible || reduced ? 0 : y,
      }}
      transition={{
        duration: reduced ? 0 : duration,
        delay: visible && !reduced ? delay : 0,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      style={{ pointerEvents: visible ? 'auto' : 'none', ...style }}
      aria-hidden={!visible}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ *
 * useIsNarrow — matchMedia hook so inline styles can go responsive
 * without a stylesheet. 900px is the split → stacked breakpoint.
 * ------------------------------------------------------------------ */

export function useIsNarrow(query = '(max-width: 900px)') {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setNarrow(e.matches)
    mq.addEventListener('change', onChange)
    setNarrow(mq.matches)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return narrow
}

/* ------------------------------------------------------------------ *
 * Scene — the sticky 100vh viewport for one step.
 *
 * The tall scroll track lives in ScrollytellingScreen (so react-scrollama
 * can measure it); Scene only renders the pinned frame inside it.
 *
 * layout:
 *   'text'  — centred single column, full screen (scenes 1, 6, 7)
 *   'split' — text left / chart right, stacks under 900px (scenes 2, 4)
 *   'wide'  — full-width chart with copy above and below (scenes 3, 5)
 * ------------------------------------------------------------------ */

export function Scene({
  layout = 'text',
  beat,
  isActive,
  label,
  left,
  right,
  children,
  align = 'center',
  maxWidth = 1100,
  splitColumns,  // override default '5fr 7fr'
}) {
  const reduced = useReducedMotion()
  const narrow = useIsNarrow()

  const frame = {
    position: 'sticky',
    top: 0,
    // Inside a fixed overflow:scroll container, 100vh = container height.
    // Use minHeight so scenes with lots of beats can grow past one screen.
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: narrow ? '72px 20px' : '96px 40px',
    boxSizing: 'border-box',
    // No overflow:hidden — lets taller beat stacks breathe
    overflow: 'visible',
  }

  const inner = {
    width: '100%',
    maxWidth,
    margin: '0 auto',
  }

  let body

  if (layout === 'split') {
    body = (
      <div
        style={{
          ...inner,
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : (splitColumns || 'minmax(280px, 5fr) minmax(320px, 7fr)'),
          gap: narrow ? 32 : 56,
          alignItems: 'center',
        }}
      >
        <div style={{ minWidth: 0 }}>{left}</div>
        <div style={{ minWidth: 0 }}>{right}</div>
      </div>
    )
  } else if (layout === 'wide') {
    body = <div style={{ ...inner, display: 'grid', gap: narrow ? 24 : 32 }}>{children}</div>
  } else {
    body = (
      <div
        style={{
          ...inner,
          maxWidth: Math.min(maxWidth, 720),
          textAlign: align,
          display: 'grid',
          gap: narrow ? 18 : 24,
          justifyItems: align === 'center' ? 'center' : 'start',
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <SceneContext.Provider value={{ beat, isActive, reduced }}>
      <div style={frame}>
        <section
          aria-label={label}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          {body}
        </section>
      </div>
    </SceneContext.Provider>
  )
}

export default Scene