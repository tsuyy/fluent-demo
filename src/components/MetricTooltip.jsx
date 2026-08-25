import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Metric definitions ────────────────────────────────────────────────────
const METRICS = {
  hrv: {
    label: 'HRV',
    unit: 'milliseconds (ms)',
    what: 'Heart Rate Variability — the variation in time between consecutive heartbeats, measured overnight.',
    why: 'Higher HRV generally reflects a more adaptable, regulated nervous system. It tends to rise with recovery and fall under stress, illness, or high training load.',
    caveat: "HRV is personal — your 38ms may be healthier than someone else's 55ms. Fluent compares you to your own baseline, not a population range. A single night means almost nothing; a week-long trend means more.",
  },
  rhr: {
    label: 'RHR',
    unit: 'beats per minute (bpm)',
    what: 'Resting Heart Rate — the rate your heart settles into when nothing is being asked of it, read from your overnight data.',
    why: 'A lower resting rate typically reflects greater cardiovascular efficiency. It tends to fall as fitness improves and rise with illness, stress, alcohol, or disrupted sleep.',
    caveat: "RHR moves for many reasons — a falling trend over months is meaningful; a single elevated night usually isn't. Fluent tracks the arc, not the spike.",
  },
  deep_sleep: {
    label: 'Deep Sleep',
    unit: 'minutes / % of total sleep',
    what: 'The slowest-wave stage of sleep — when your body does most of its physical repair.',
    why: 'Deep sleep is when growth hormone is released, tissue repairs, and your immune system consolidates. More deep sleep generally means better physical recovery.',
    caveat: "Deep sleep naturally decreases with age and varies night to night. Your tracker estimates sleep stages from movement and heart rate — it's a reasonable proxy, not a clinical measurement.",
  },
  rem: {
    label: 'REM Sleep',
    unit: 'minutes / % of total sleep',
    what: 'Rapid Eye Movement sleep — the stage most associated with dreaming, memory consolidation, and emotional processing.',
    why: 'REM sleep is linked to learning, emotional regulation, and cognitive performance.',
    caveat: "Tracker-estimated REM is less accurate than deep sleep estimation. Use it as a relative indicator across your own data rather than a precise figure.",
  },
  respiratory_rate: {
    label: 'Respiratory Rate',
    unit: 'breaths per minute',
    what: "How many times you breathe per minute while asleep — measured passively by your wearable overnight.",
    why: "Respiratory rate is stable when healthy and tends to rise with illness, high stress, or alcohol. It's one of the earliest signals of oncoming sickness.",
    caveat: "Small fluctuations are normal. A sustained elevation across several nights is more meaningful than a single high reading.",
  },
  vo2max: {
    label: 'VO₂ Max',
    unit: 'ml/kg/min',
    what: "An estimate of your maximum oxygen uptake — how efficiently your body uses oxygen during intense exercise.",
    why: "VO₂ Max is one of the stronger predictors of long-term cardiovascular health. Rising VO₂ Max typically reflects improving aerobic fitness.",
    caveat: "Wearable VO₂ Max estimates are calculated from heart rate and pace — they're directionally useful but not clinically precise. Treat trends as signal; treat exact numbers as approximate.",
  },
  spo2: {
    label: 'SpO₂',
    unit: '% blood oxygen saturation',
    what: "An estimate of how much oxygen your red blood cells are carrying, measured by your wearable's optical sensor.",
    why: "Most healthy adults maintain SpO₂ above 95% during sleep. Sustained dips can indicate disrupted breathing or altitude effects.",
    caveat: "Consumer wearable SpO₂ readings are estimates, not medical-grade measurements. If you see consistent low readings alongside symptoms, that's worth discussing with a doctor.",
  },
  awake_time: {
    label: 'Awake Time',
    unit: 'minutes per night',
    what: 'Total minutes spent awake after initially falling asleep — brief wake-ups your tracker detects but you may not remember.',
    why: 'Some awake time overnight is normal; everyone wakes briefly between sleep cycles. Falling awake time generally means fewer or shorter disruptions and more continuous sleep.',
    caveat: "Short micro-awakenings are usually invisible to the person sleeping and are not themselves a problem. This is more useful as a trend across weeks than as a nightly target to minimize.",
  },
}

export { METRICS }

const SURFACE   = '#1A1A18'
const ACCENT    = 'var(--color-accent, #0681fc)'
const TEXT      = 'var(--color-text, rgba(255,255,255,0.92))'
const SECONDARY = 'var(--color-text-secondary, rgba(255,255,255,0.62))'
const QUIET     = 'var(--color-quiet, #888780)'
const HAIRLINE  = 'rgba(255,255,255,0.1)'

// ── Shared panel content ──────────────────────────────────────────────────
function PanelContent({ def, onClose }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{def.label}</span>
        <span style={{ fontSize: 11, color: QUIET }}>{def.unit}</span>
      </div>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: SECONDARY }}>{def.what}</p>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: SECONDARY }}>{def.why}</p>
      <p style={{
        margin: 0, fontSize: 12, lineHeight: 1.6, color: QUIET,
        borderTop: `1px solid ${HAIRLINE}`, paddingTop: 10, fontStyle: 'italic',
      }}>
        {def.caveat}
      </p>
      <button
        type="button"
        onClick={onClose}
        style={{
          alignSelf: 'flex-start', background: 'transparent', border: 'none',
          padding: 0, fontSize: 12, color: QUIET, cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        close ×
      </button>
    </>
  )
}

// ── Variant A: Inline (scrollytelling) ───────────────────────────────────
// Expands in place below the trigger. Uses marker prop (①, ②, etc.)
// Label shown next to marker as a text link.
export function InlineMetricTooltip({ metric, marker = '＊', label }) {
  const [open, setOpen] = useState(false)
  const def = METRICS[metric]
  if (!def) return null

  return (
    <div style={{ display: 'grid', gap: 0 }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: 'none', padding: '4px 0',
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        <span style={{ color: ACCENT, fontSize: 13 }}>{marker}</span>
        <span style={{
          fontSize: 13, color: SECONDARY,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}>
          {label || `What is ${def.label}?`}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: 8, padding: 16, borderRadius: 10,
              background: SURFACE, border: `1px solid ${HAIRLINE}`,
              display: 'grid', gap: 10,
            }}>
              <PanelContent def={def} onClose={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Variant B: Floating (metric cards) ───────────────────────────────────
// Fixed-position panel on click. Uses ＊ symbol. No layout disruption.
export default function MetricTooltip({ metric }) {
  const [open, setOpen] = useState(false)
  const [pos,  setPos]  = useState({ top: 0, left: 0 })
  const triggerRef      = useRef(null)
  const panelRef        = useRef(null)
  const def             = METRICS[metric]
  if (!def) return null

  const reposition = useCallback(() => {
    if (!triggerRef.current) return
    const tr     = triggerRef.current.getBoundingClientRect()
    const panelW = 320
    const panelH = 280
    const vw     = window.innerWidth
    const vh     = window.innerHeight
    let left = tr.left
    let top  = tr.bottom + 8
    if (left + panelW > vw - 16) left = vw - panelW - 16
    if (top  + panelH > vh - 16) top  = tr.top - panelH - 8
    setPos({ top, left })
  }, [])

  const handleToggle = useCallback((e) => {
    e.stopPropagation()
    if (!open) reposition()
    setOpen(v => !v)
  }, [open, reposition])

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (!panelRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target))
        setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = () => setOpen(false)
    window.addEventListener('scroll', handler, true)
    return () => window.removeEventListener('scroll', handler, true)
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-label={`What is ${def.label}?`}
        style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'transparent', border: 'none',
          padding: '1px 2px', margin: 0,
          fontSize: 13, color: open ? ACCENT : QUIET,
          cursor: 'pointer', fontFamily: 'inherit',
          lineHeight: 1, transition: 'color 0.15s ease',
          flexShrink: 0,
        }}
      >
        ＊
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            style={{
              position: 'fixed',
              top: pos.top, left: pos.left,
              width: 320,
              background: SURFACE,
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 12, padding: 18,
              zIndex: 1000,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              display: 'grid', gap: 10,
            }}
            onClick={e => e.stopPropagation()}
          >
            <PanelContent def={def} onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}