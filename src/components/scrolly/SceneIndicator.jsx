import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useIsNarrow } from './Scene'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT = 'var(--color-text, rgba(255,255,255,0.92))'
const SURFACE = 'var(--color-surface, #1A1A18)'

/**
 * Vertical scene tracker, fixed to the right edge.
 * Active scene renders as a square, the rest as circles.
 * The final scene fills slowly (1s) so the closing lands differently.
 */
export default function SceneIndicator({ labels, current, onJump }) {
  const [hovered, setHovered] = useState(null)
  const reduced = useReducedMotion()
  const narrow = useIsNarrow()

  const lastIndex = labels.length - 1

  return (
    <nav
      aria-label="Scene navigation"
      style={{
        position: 'fixed',
        right: narrow ? 14 : 32,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: narrow ? 12 : 14,
        zIndex: 40,
      }}
    >
      {labels.map((label, i) => {
        const active = current === i
        const seen = current >= i
        const isLast = i === lastIndex

        return (
          <div
            key={label}
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <AnimatePresence>
              {hovered === i && !narrow && (
                <motion.span
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'absolute',
                    right: 22,
                    whiteSpace: 'nowrap',
                    fontSize: 12,
                    letterSpacing: '-0.01em',
                    color: TEXT,
                    background: SURFACE,
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 6,
                    padding: '4px 9px',
                    pointerEvents: 'none',
                  }}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>

            <button
              type="button"
              className="scrolly-focus"
              onClick={() => onJump(i)}
              aria-label={`Scene ${i + 1}: ${label}`}
              aria-current={active ? 'step' : undefined}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 6,
                margin: -6,
                cursor: 'pointer',
                lineHeight: 0,
              }}
            >
              <motion.span
                animate={{
                  width: active ? 9 : 7,
                  height: active ? 9 : 7,
                  borderRadius: active ? 2 : 999,
                  opacity: seen ? 1 : 0.32,
                  backgroundColor: seen ? TEXT : QUIET,
                }}
                transition={{
                  duration: reduced ? 0 : isLast && active ? 1 : 0.28,
                  ease: 'easeOut',
                }}
                style={{ display: 'block' }}
              />
            </button>
          </div>
        )
      })}
    </nav>
  )
}
