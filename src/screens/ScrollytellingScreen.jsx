import { useCallback, useEffect, useRef, useMemo, useState } from 'react'
import { Scrollama, Step } from 'react-scrollama'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

import SceneIndicator  from '../components/scrolly/SceneIndicator'
import Scene01Opening    from '../components/scrolly/scenes/yvonne/Scene01Opening'
import Scene02Heart      from '../components/scrolly/scenes/yvonne/Scene02Heart'
import Scene03Movement   from '../components/scrolly/scenes/yvonne/Scene03Movement'
import Scene04Sports     from '../components/scrolly/scenes/yvonne/Scene04Sports'
import Scene05Sleep      from '../components/scrolly/scenes/yvonne/Scene05Sleep'
import Scene06Reflection from '../components/scrolly/scenes/yvonne/Scene06Reflection'
import Scene07CannotSee  from '../components/scrolly/scenes/yvonne/Scene07CannotSee'
import Scene08Closing    from '../components/scrolly/scenes/yvonne/Scene08Closing'

/* ── WIRING ─────────────────────────────────────────────────────────
   The one place charts and data are bound. If chart prop names
   differ from the guesses below, this is the only file to touch.   */
import QuarterlyArcChart from '../components/charts/QuarterlyArcChart'
// Switched from quarterly.json → quarterly_arc.json: the new file has
// `resp` (breathing rate) and `has_sleep` fields that quarterly.json
// doesn't, and Scene02Heart's new breathing-rate step needs `resp`.
// This is the same file Heart & Nervous System screen already uses.
import quarterlyArcData  from '../data/yvonne/quarterly_arc.json'
import calendarData      from '../data/yvonne/calendar.json'
import sleepMonthlyData from '../data/yvonne/sleep_monthly.json'

const charts = {
  // highlightLine drives which line QuarterlyArcChart emphasizes;
  // hideChrome drops the standalone-screen annotations/legend/stat
  // callouts, which would just compete with the scrolling prose here.
      quarterlyArc: ({ highlightLine }) => (
      <QuarterlyArcChart data={quarterlyArcData} highlightLine={highlightLine} hideAnnotations height={420} />
    ),
}
/* ──────────────────────────────────────────────────────────────── */

/* ── STORY NUMBERS ──────────────────────────────────────────────────
   Copy-critical figures live here, not inside scene components.    */
const YVONNE_STORY = {
  startDate: 'January 7, 2022',
  heartbeats: 147246480,
  workouts: 1763,
  sleepHours: '2,445',
  pivotQuarter: 'Q4 2022',
  heart: {
    rhr: { from: 62.7, to: 57.6, perDay: 10080, perYear: '3.7 million' },
    hrv: { from: 39.2, to: 51.9, pctLabel: '32%' },
    // Added for Scene02's new breathing-rate step — previously
    // missing from story data entirely, which is why the chart
    // showed a resp line with no accompanying content.
    resp: { from: 21.5, to: 15.4 },
  },
  tennis: { sessions: 22 },
}

/* ── SCENE REGISTRY ─────────────────────────────────────────────────
   `beats` (fixed-height, discrete reveal) is the OLD architecture.
   `migrated: true` scenes use PuddingScene instead — natural content
   height, no beat prop, internal scroll-sync handled by the scene
   itself. Both can coexist; only migrated scenes skip the height
   formula and the beat-based opacity hiding below.                 */
const SCENES = {
  yvonne: [
    { id: 'opening', label: 'The beginning', migrated: true,
      render: (props) => <Scene01Opening {...props} story={YVONNE_STORY} /> },
    { id: 'heart', label: 'Your heart', migrated: true,
      render: (props) => <Scene02Heart {...props} story={YVONNE_STORY} renderChart={charts.quarterlyArc} /> },
    { id: 'movement', label: 'How you moved', migrated: true,
      render: (props) => <Scene03Movement {...props} story={YVONNE_STORY} calendarData={calendarData} /> },
    { id: 'sports', label: 'What the data noticed', migrated: true,
      render: (props) => <Scene04Sports {...props} story={YVONNE_STORY} /> },
     { id: 'sleep', label: 'How you slept', migrated: true,
       render: (props) => <Scene05Sleep {...props} sleepMonthlyData={sleepMonthlyData} /> },
    { id: 'reflection', label: 'What stands out', beats: 5,
      render: (props) => <Scene06Reflection {...props} /> },
    { id: 'cannotsee', label: "What the data can't see", beats: 3,
      render: (props) => <Scene07CannotSee {...props} /> },
    { id: 'closing', label: "What's yours", beats: 4,
      render: (props) => (
        <Scene08Closing
          {...props}
          onComplete={() => props.onNavigate?.('home')}
          onRestart={() => props.onNavigate?.('thesis')}
        />
      ) },
  ],
  robert: [],
}

const HOLD_IN = 0.04
const HOLD_OUT = 0.06
const SCROLL_OFFSET = 0.9
const VH_PER_BEAT = 18

function beatFromProgress(progress, beats) {
  const span = 1 - HOLD_IN - HOLD_OUT
  const t = (progress - HOLD_IN) / span
  if (t <= 0) return 0
  if (t >= 1) return beats - 1
  return Math.min(beats - 1, Math.floor(t * beats))
}

export default function ScrollytellingScreen({ persona, onComplete, onBack, onNavigate: onNavigateProp }) {
  const scenes = useMemo(() => SCENES[persona] ?? [], [persona])

  const onNavigate = useCallback((target) => {
    if (target === 'home')   { onComplete?.(); return }
    if (target === 'thesis') { onBack?.();     return }
    onNavigateProp?.(target)
  }, [onComplete, onBack, onNavigateProp])
  const reduced = useReducedMotion()

  const [current, setCurrent] = useState(0)
  const [beats, setBeats] = useState({})
  const [responses, setResponses] = useState({})

  useEffect(() => {
    if (scenes.length === 0) onBack?.()
  }, [scenes.length, onBack])

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
      // Only non-migrated scenes use the beat-based "leave nothing
      // half-revealed behind us" reset — migrated scenes manage their
      // own internal reveal state via PuddingScene, nothing to reset here.
      if (direction === 'down' && data > 0 && !scenes[data - 1].migrated) {
        setBeat(data - 1, scenes[data - 1].beats - 1)
      }
    },
    [scenes, setBeat]
  )

  const onStepProgress = useCallback(
    ({ data, progress }) => {
      if (scenes[data].migrated) return // no beat concept for these
      setBeat(data, beatFromProgress(progress, scenes[data].beats))
    },
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
        position: 'fixed', inset: 0,
        overflowY: 'scroll', overflowX: 'hidden',
        background: 'var(--color-base, #0F0F0E)',
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
        type="button" className="scrolly-focus" onClick={onBack}
        style={{
          position: 'sticky', top: 24, marginLeft: 24, zIndex: 40,
          background: 'transparent', border: 'none',
          color: 'var(--color-quiet, #888780)', fontFamily: 'inherit',
          fontSize: 14, cursor: 'pointer', padding: 6, display: 'block',
        }}
      >
        ← Back
      </button>

      <SceneIndicator labels={scenes.map((s) => s.label)} current={current} onJump={jumpTo} />

      {scrollContainer && (
        <Scrollama
          offset={SCROLL_OFFSET} progress threshold={24}
          onStepEnter={onStepEnter} onStepProgress={onStepProgress}
          root={scrollContainer}
        >
          {scenes.map((scene, i) => (
            <Step data={i} key={scene.id}>
              {scene.migrated ? (
                // Natural height — no beat formula, PuddingScene's own
                // position:sticky is self-contained to this section,
                // so no manual opacity-hiding hack is needed either.
                <div id={`fluent-scene-${i}`} style={{ position: 'relative', minHeight: '100vh' }}>
                  {scene.render({
                    isActive: current === i,
                    response: responses[scene.id],
                    onRespond: (value) => setResponses((prev) => ({ ...prev, [scene.id]: value })),
                    onNavigate,
                    onJumpToScene: jumpTo,
                  })}
                </div>
              ) : (
                <div
                  id={`fluent-scene-${i}`}
                  style={{ height: `${100 + scene.beats * VH_PER_BEAT}vh`, position: 'relative', minHeight: '100vh' }}
                >
                  <div style={{
                    opacity: (current === i || current === i - 1) ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    height: '100%',
                  }}>
                    {scene.render({
                      beat: beats[i] ?? (i === 0 ? 0 : -1),
                      isActive: current === i,
                      response: responses[scene.id],
                      onRespond: (value) => setResponses((prev) => ({ ...prev, [scene.id]: value })),
                      onNavigate,
                    })}
                  </div>
                </div>
              )}
            </Step>
          ))}
        </Scrollama>
      )}
    </div>
  )
}