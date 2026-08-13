import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useScene } from './Scene'
import { useIsNarrow } from './useIsNarrow'

/* Token fallbacks keep these components safe to drop in even if a
   given custom property isn't defined in tokens.css yet. */
const TEXT = 'var(--color-text, rgba(255,255,255,0.92))'
const SECONDARY = 'var(--color-text-secondary, rgba(255,255,255,0.62))'
const QUIET = 'var(--color-quiet, #888780)'
const SURFACE = 'var(--color-surface, #1A1A18)'
const ACCENT = 'var(--color-accent, #0681fc)'
const HAIRLINE = 'rgba(255,255,255,0.12)'

/* ------------------------------------------------------------------ *
 * Typography
 * ------------------------------------------------------------------ */

export function Lead({ children, style }) {
  const narrow = useIsNarrow()
  return (
    <p
      style={{
        margin: 0,
        fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
        fontSize: narrow ? 22 : 30,
        lineHeight: 1.3,
        letterSpacing: '-0.02em',
        fontWeight: 400,
        color: TEXT,
        ...style,
      }}
    >
      {children}
    </p>
  )
}

export function Line({ children, tone = 'primary', style }) {
  const narrow = useIsNarrow()
  return (
    <p
      style={{
        margin: 0,
        fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
        fontSize: narrow ? 16 : 18,
        lineHeight: 1.55,
        letterSpacing: '-0.01em',
        color: tone === 'quiet' ? QUIET : tone === 'secondary' ? SECONDARY : TEXT,
        ...style,
      }}
    >
      {children}
    </p>
  )
}

/* ------------------------------------------------------------------ *
 * CountUp — animates from → to when `active` flips true.
 * Reduced motion jumps straight to the destination value.
 * ------------------------------------------------------------------ */

export function CountUp({
  from,
  to,
  duration = 1600,
  active = true,
  format = (v) => Math.round(v).toLocaleString(),
}) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(from)
  const rafRef = useRef()

  useEffect(() => {
    if (!active) {
      setValue(from)
      return
    }
    if (reduced) {
      setValue(to)
      return
    }

    let start
    const step = (now) => {
      if (start === undefined) start = now
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setValue(from + (to - from) * eased)
      if (p < 1) rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, from, to, duration, reduced])

  return <>{format(value)}</>
}

/* ------------------------------------------------------------------ *
 * BigNumber — the large hero figure with a trailing unit.
 * ------------------------------------------------------------------ */

export function BigNumber({ children, unit, color = TEXT }) {
  const narrow = useIsNarrow()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 10,
        fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
      }}
    >
      <span
        style={{
          fontSize: narrow ? 68 : 104,
          lineHeight: 1,
          fontWeight: 500,
          letterSpacing: '-0.045em',
          color,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {children}
      </span>
      {unit && (
        <span style={{ fontSize: narrow ? 16 : 20, color: QUIET, letterSpacing: '-0.01em' }}>
          {unit}
        </span>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * PulseDot — scene 1's heartbeat.
 * ------------------------------------------------------------------ */

export function PulseDot({ size = 14, color = ACCENT }) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: '50%', background: color }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div style={{ position: 'relative', width: size, height: size }} aria-hidden="true">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.08, 1, 1.08, 1], opacity: 1 }}
        transition={{
          scale: { duration: 1.15, times: [0, 0.18, 0.34, 0.5, 0.72], repeat: Infinity, repeatDelay: 0.25 },
          opacity: { duration: 0.5 },
        }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: color,
        }}
      />
      <motion.div
        animate={{ scale: [1, 2.6], opacity: [0.35, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: color,
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * ScrollCue — the ↓ hint on scene 1, fades once scrolling starts.
 * ------------------------------------------------------------------ */

export function ScrollCue({ visible }) {
  const reduced = useReducedMotion()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: QUIET,
            fontSize: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
          }}
        >
          <span>Scroll</span>
          <motion.span
            animate={reduced ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: 16 }}
          >
            ↓
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ *
 * InfoNote — the ① metric explainer. Every one carries an epistemic
 * qualifier; the `caveat` prop is required for that reason.
 * ------------------------------------------------------------------ */

export function InfoNote({ marker = '①', label, body, caveat }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ maxWidth: 460 }}>
      <button
        type="button"
        className="scrolly-focus"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'transparent',
          border: 'none',
          padding: '4px 0',
          margin: 0,
          color: SECONDARY,
          font: 'inherit',
          fontSize: 14,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ color: ACCENT }}>{marker}</span>
        <span style={{ borderBottom: `1px solid ${HAIRLINE}` }}>{label}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                marginTop: 10,
                padding: 16,
                borderRadius: 10,
                background: SURFACE,
                border: `1px solid ${HAIRLINE}`,
                display: 'grid',
                gap: 10,
              }}
            >
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: SECONDARY }}>{body}</p>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: QUIET,
                  borderTop: `1px solid ${HAIRLINE}`,
                  paddingTop: 10,
                }}
              >
                {caveat}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * VerificationPrompt — the user supplies the why.
 * Single select, no right answer, no score. Once answered it collapses
 * to a quiet acknowledgement and stays changeable.
 * ------------------------------------------------------------------ */

export function VerificationPrompt({ question, options, value, onChange, acknowledgement }) {
  const { reduced } = useScene()

  return (
    <div
      style={{
        display: 'grid',
        gap: 12,
        padding: '18px 0 0',
        borderTop: `1px solid ${HAIRLINE}`,
        maxWidth: 560,
      }}
    >
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: SECONDARY }}>{question}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map((opt) => {
          const selected = value === opt
          return (
            <button
              key={opt}
              type="button"
              className="scrolly-focus scrolly-chip"
              aria-pressed={selected}
              onClick={() => onChange(selected ? null : opt)}
              style={{
                background: selected ? 'rgba(6,129,252,0.14)' : 'transparent',
                border: `1px solid ${selected ? ACCENT : HAIRLINE}`,
                color: selected ? TEXT : SECONDARY,
                borderRadius: 999,
                padding: '8px 16px',
                fontSize: 14,
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: reduced ? 'none' : 'all 0.2s ease',
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {value && acknowledgement && (
          <motion.p
            initial={{ opacity: 0, y: reduced ? 0 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: QUIET, fontStyle: 'italic' }}
          >
            {typeof acknowledgement === 'function' ? acknowledgement(value) : acknowledgement}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}