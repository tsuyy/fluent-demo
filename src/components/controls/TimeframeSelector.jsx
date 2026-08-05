import { motion, useReducedMotion } from 'framer-motion'
import { TIMEFRAMES } from '../../utils/timeframe'

const QUIET = 'var(--color-quiet, #888780)'
const TEXT = 'var(--color-text, rgba(255,255,255,0.92))'

/**
 * Segmented control: 3m / 6m / 1yr / All.
 *
 * Options that would leave the chart with fewer than two points come
 * through in `disabled` — they stay visible so the range of the record
 * is legible, but they aren't selectable.
 */
export default function TimeframeSelector({
  value,
  onChange,
  disabled = new Set(),
  options = TIMEFRAMES,
  layoutId = 'timeframe-indicator',
}) {
  const reduced = useReducedMotion()

  return (
    <div
      role="radiogroup"
      aria-label="Timeframe"
      style={{
        display: 'inline-flex',
        gap: 2,
        padding: 3,
        borderRadius: 999,
        background: 'var(--color-surface, #1A1A18)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {options.map((tf) => {
        const selected = value === tf.id
        const isDisabled = disabled.has?.(tf.id) ?? false

        return (
          <button
            key={tf.id}
            type="button"
            role="radio"
            className="scrolly-focus"
            aria-checked={selected}
            disabled={isDisabled}
            title={isDisabled ? 'Not enough data in this window' : undefined}
            onClick={() => onChange(tf.id)}
            style={{
              position: 'relative',
              background: 'transparent',
              border: 'none',
              borderRadius: 999,
              padding: '7px 16px',
              fontFamily: 'inherit',
              fontSize: 13,
              letterSpacing: '-0.01em',
              color: isDisabled ? 'rgba(255,255,255,0.22)' : selected ? TEXT : QUIET,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              transition: reduced ? 'none' : 'color 0.2s ease',
            }}
          >
            {selected && (
              <motion.span
                layoutId={reduced ? undefined : layoutId}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.09)',
                }}
              />
            )}
            <span style={{ position: 'relative' }}>{tf.label}</span>
          </button>
        )
      })}
    </div>
  )
}
