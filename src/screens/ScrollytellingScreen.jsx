import { useCallback, useEffect, useRef, useMemo, useState } from 'react'
import { Scrollama, Step } from 'react-scrollama'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

import SceneIndicator  from '../components/scrolly/SceneIndicator'
import Scene01Opening  from '../components/scrolly/scenes/yvonne/Scene01Opening'
import Scene02Heart    from '../components/scrolly/scenes/yvonne/Scene02Heart'
import Scene03Movement from '../components/scrolly/scenes/yvonne/Scene03Movement'
import Scene04Sports   from '../components/scrolly/scenes/yvonne/Scene04Sports'
import Scene05Sleep    from '../components/scrolly/scenes/yvonne/Scene05Sleep'

/* ── WIRING ─────────────────────────────────────────────────────────
   The one place charts and data are bound. If chart prop names
   differ from the guesses below, this is the only file to touch.   */
import QuarterlyArcChart from '../components/charts/QuarterlyArcChart'
import quarterlyData     from '../data/yvonne/quarterly.json'
// TODO: confirm the shape of calendar.json — each entry needs { day: 'YYYY-MM-DD', value: number }
// `value` should be activity minutes or any continuous metric; Nivo auto-scales colours.
import calendarData      from '../data/yvonne/calendar.json'

const charts = {
  // TODO confirm QuarterlyArcChart's prop names. `showHRV` is new.
  quarterlyArc: ({ showHRV }) => <QuarterlyArcChart data={quarterlyData} showHRV={showHRV} />,
}
/* ──────────────────────────────────────────────────────────────── */

/* ── STORY NUMBERS ──────────────────────────────────────────────────
   Copy-critical figures live here, not inside scene components.    */
const YVONNE_STORY = {
  startDate: 'March 3, 2022', // TODO confirm real first-tracked date
  heartbeats: 643000,         // TODO verify — see INTEGRATION.md note on this figure
  workouts: 1652,
  sportsWord: 'nine',
  sleepYears: '4+',
  pivotQuarter: 'Q4 2022',
  heart: {
    rhr: { from: 66, to: 59, perDay: 10080, perYear: '3.7 million' },
    hrv: { from: 33, to: 45, pctLabel: '37%' },
  },
  tennis: {
    sessions: 22,             // sessions tracked since 2025
  },
}

/* ── SCENE REGISTRY ─────────────────────────────────────────────────
   `beats` drives both the reveal sequence and the scroll track
   length, so adding a line of copy means bumping the count.

   Yvonne runs to 7 scenes and Robert to 4 — scenes 3–7 and the
   Robert set slot in here as they're built.                        */
const SCENES = {
  yvonne: [
    {
      id: 'opening',
      label: 'The beginning',
      beats: 5,
      render: (props) => <Scene01Opening {...props} story={YVONNE_STORY} />,
    },
    {
      id: 'heart',
      label: 'Your heart',
      beats: 5,
      render: (props) => (
        <Scene02Heart {...props} story={YVONNE_STORY} renderChart={charts.quarterlyArc} />
      ),
    },
    {
      id: 'movement',
      label: 'How you moved',
      beats: 5,  // 0 intro · 1 calendar · 2 fall · 3 Oct/Feb · 4 verification
      render: (props) => (
        <Scene03Movement {...props} story={YVONNE_STORY} calendarData={calendarData} />
      ),
    },
    {
      id: 'sports',
      label: 'What the data noticed',
      beats: 6,  // 0 intro · 1 skiing · 2 other sports · 3 tennis · 4 agency · 5 verification
      render: (props) => <Scene04Sports {...props} story={YVONNE_STORY} />,
    },
    {
      id: 'sleep',
      label: 'How you slept',
      beats: 7,  // 0 intro · 1 arch bars · 2 QQRT · 3 deep sleep copy · 4 weekly rhythm · 5 Mon/Sat copy · 6 verification
      render: (props) => <Scene05Sleep {...props} />,
    },
    // Scene06 (philosophical pause) and Scene07 (closing) → week 3
  ],
  robert: [],
  // Jamie and Alex scrollytelling → not specced yet
}

/* Where in a scene's scroll track the beats play out. The head and
   tail holds give the first and last line room to breathe. */
const HOLD_IN = 0.05       // very short hold before first beat fires
const HOLD_OUT = 0.08      // short tail after last beat
const SCROLL_OFFSET = 0.85 // trigger near bottom of viewport — beat fires as step enters view
const VH_PER_BEAT = 22     // tighter pacing

function beatFromProgress(progress, beats) {
  const span = 1 - HOLD_IN - HOLD_OUT
  const t = (progress - HOLD_IN) / span
  if (t <= 0) return 0
  if (t >= 1) return beats - 1
  return Math.min(beats - 1, Math.floor(t * beats))
}

export default function ScrollytellingScreen({ persona, onComplete, onBack }) {
  const scenes = useMemo(() => SCENES[persona] ?? [], [persona])
  const reduced = useReducedMotion()

  const [current, setCurrent] = useState(0)
  const [beats, setBeats] = useState({})
  const [responses, setResponses] = useState({})

  /* Personas without a story fall back to the compilation view. */
  useEffect(() => {
    if (scenes.length === 0) onBack?.()
  }, [scenes.length, onBack])

  // Scroll container ref — Scrollama watches this div, not the window.
  // We store the node in state so Scrollama re-renders with the real element
  // rather than the null ref value it would get on first render.
  const containerRef = useRef(null)
  const [scrollContainer, setScrollContainer] = useState(null)

  const containerCallbackRef = useCallback((node) => {
    containerRef.current = node
    setScrollContainer(node)
    if (node) node.scrollTop = 0
  }, [])

  const setBeat = useCallback((index, beat) => {
    setBeats((prev) => (prev[index] === beat ? prev : { ...prev, [index]: beat }))
  }, [])

  const onStepEnter = useCallback(
    ({ data, direction }) => {
      setCurrent(data)
      // Leave nothing half-revealed behind us.
      if (direction === 'down' && data > 0) {
        setBeat(data - 1, scenes[data - 1].beats - 1)
      }
    },
    [scenes, setBeat]
  )

  const onStepProgress = useCallback(
    ({ data, progress }) => setBeat(data, beatFromProgress(progress, scenes[data].beats)),
    [scenes, setBeat]
  )

  const jumpTo = useCallback(
    (index) => {
      const el = document.getElementById(`fluent-scene-${index}`)
      const container = containerRef.current
      if (!el || !container) return
      const top = el.offsetTop
      container.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
    },
    [reduced]
  )

  if (scenes.length === 0) return null

  return (
    <div
      ref={containerCallbackRef}
      style={{
        position: 'fixed',
        inset: 0,
        overflowY: 'scroll',
        overflowX: 'hidden',
        background: 'var(--color-base, #0F0F0E)',
        // Fixed+inset gives us a true viewport-sized scroll container.
        // Scrollama watches this div via the root prop, not the window.
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <style>{`
        .scrolly-focus:focus-visible {
          outline: 2px solid var(--color-accent, #0681fc);
          outline-offset: 3px;
          border-radius: 4px;
        }
        .scrolly-chip:hover { border-color: rgba(255,255,255,0.34); }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
        }
      `}</style>

      <button
        type="button"
        className="scrolly-focus"
        onClick={onBack}
        style={{
          position: 'sticky',
          top: 24,
          marginLeft: 24,
          zIndex: 40,
          background: 'transparent',
          border: 'none',
          color: 'var(--color-quiet, #888780)',
          fontFamily: 'inherit',
          fontSize: 14,
          cursor: 'pointer',
          padding: 6,
          display: 'block',
        }}
      >
        ← Back
      </button>

      <SceneIndicator labels={scenes.map((s) => s.label)} current={current} onJump={jumpTo} />

      {scrollContainer && (
      <Scrollama
        offset={SCROLL_OFFSET}
        progress
        threshold={24}
        onStepEnter={onStepEnter}
        onStepProgress={onStepProgress}
        root={scrollContainer}
      >
        {scenes.map((scene, i) => (
          <Step data={i} key={scene.id}>
            <div
              id={`fluent-scene-${i}`}
              style={{ height: `${100 + scene.beats * VH_PER_BEAT}vh`, position: 'relative', minHeight: '100vh' }}
            >
              {/* Hide scenes that are fully scrolled past — prevents sticky
                  frames from two adjacent scenes showing simultaneously */}
              <div style={{
                opacity: (current === i || current === i - 1) ? 1 : 0,
                transition: 'opacity 0.3s ease',
                height: '100%',
              }}>
                {scene.render({
                  beat: beats[i] ?? (i === 0 ? 0 : -1),
                  isActive: current === i,
                  response: responses[scene.id],
                  onRespond: (value) =>
                    setResponses((prev) => ({ ...prev, [scene.id]: value })),
                })}
              </div>
            </div>
          </Step>
        ))}
      </Scrollama>
      )}

      <AnimatePresence>
        {current >= 1 && (
          <motion.button
            type="button"
            className="scrolly-focus"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => onComplete?.(responses)}
            style={{
              position: 'fixed',
              bottom: 28,
              right: 28,
              zIndex: 40,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8,
              padding: '10px 18px',
              color: 'var(--color-quiet, #888780)',
              fontFamily: 'inherit',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            skip to explore →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}