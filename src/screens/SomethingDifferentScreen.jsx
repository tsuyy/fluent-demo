import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingNav from '../components/nav/FloatingNav'
import PageContainer from '../components/layout/PageContainer'
import IconSleep    from '../components/nav/icons/IconSleep'
import IconActivity from '../components/nav/icons/IconActivity'
import IconEnergy   from '../components/nav/icons/IconEnergy'
import IconPhysical from '../components/nav/icons/IconPhysical'
import IconUnsure   from '../components/nav/icons/IconUnsure'
import SignalRankingMini from '../components/charts/SignalRankingMini'
import { useIsNarrow } from '../components/scrolly/useIsNarrow'
import CurrentSnapshotCards from '../components/cards/CurrentSnapshotCards'
import currentSnapshot from '../data/yvonne/current_snapshot.json'

import RecentActivityChart from '../components/charts/RecentActivityChart'
import RecentRecoveryChart from '../components/charts/RecentRecoveryChart'
import RecentPhysicalChart from '../components/charts/RecentPhysicalChart'
import RecentSleepMini     from '../components/charts/RecentSleepMini'
import RecentEvidenceMini  from '../components/charts/RecentEvidenceMini'
import SleepHRVChart       from '../components/charts/SleepHRVChart'

// Yvonne — real exported data
import yvonneActivity from '../data/yvonne/recent_activity_14d.json'
import yvonneRecovery from '../data/yvonne/recent_recovery_14d.json'
import yvonnePhysical from '../data/yvonne/recent_physical_14d.json'
import sleepQQRT       from '../data/yvonne/sleep_qqrt.json'

const SIGNALS = [
  { id: 'energy',   label: 'My energy feels off',      Icon: IconEnergy },
  { id: 'sleep',    label: 'My sleep feels different',  Icon: IconSleep },
  { id: 'recovery', label: "I'm not recovering well",   Icon: IconActivity },
  { id: 'physical', label: 'Something feels physical',   Icon: IconPhysical },
]


const MODE3_GENERIC = "Most physical sensations aren't visible to a wrist sensor. Steps and HRV can catch some patterns — but pain, injury, or specific symptoms are information only you have right now."

// ─────────────────────────────────────────────────────────────────
// YVONNE — all five resolve to Mode 2 (calibrated silence). Real
// data now backs energy/recovery/physical/sleep; only 'unsure' still
// needs the signal-ranking logic before it can show a real chart.
// ─────────────────────────────────────────────────────────────────
const YVONNE_ROUTES = {
  energy: {
    mode: 2,
    body: "Nothing in your recovery or training-load data stands out over the past two weeks. Your HRV and activity levels are tracking close to your normal range.",
    chart: 'activity', chartData: yvonneActivity,
    chartCaption: 'Your HRV and activity — past two weeks',
  },
  sleep: {
    mode: 2,
    body: "Your sleep efficiency has stayed in its usual range. Deep sleep averaged about 13% below your 90-day average this week, and REM about 7% below.",
    chart: 'sleepMini', chartData: sleepQQRT,
    chartCaption: 'Your recent sleep efficiency',
  },
  recovery: {
    mode: 2,
    body: "Your HRV and resting heart rate are both close to their 90-day averages right now. A few single nights ran lower, which is common.",
    chart: 'recovery', chartData: yvonneRecovery,
    chartCaption: 'Your recovery signals this fortnight',
  },
  physical: {
    mode: 2,
    body: "Over the past two weeks, HRV and wrist temperature have not moved together the way they did in February. That says nothing about whether you are well. If something specific is going on, it may be outside what a wrist sensor can see.",
    chart: 'physical', chartData: yvonnePhysical,
    chartCaption: 'Not the February pattern',
    historicalNote: "Nothing like February's pattern (HRV down, wrist temperature up) is showing up right now. In February, the same signals had more than one explanation, so Fluent shows them next to what was going on rather than saying what they meant.",
    historicalLink: { label: 'See February →', cardId: 'illness_arc' },
  },
  unsure: {
    mode: 2,
    body: "Nothing in your data stands out right now — your HRV, sleep, and training load are all close to your normal range. Sometimes the most useful thing to know is that nothing unusual is happening.",
    chart: 'ranking',
    chartCaption: 'Your two most-watched signals, past two weeks',
  },
}

const SIGNAL_ROUTES = {
  yvonne: YVONNE_ROUTES,
}

// ── Chart dispatcher ──────────────────────────────────────────────
function RouteChart({ type, data }) {
  if (!type) return null
  if (type === 'activity')  return <RecentActivityChart data={data} height={110} compact />
  if (type === 'recovery')  return <RecentRecoveryChart data={data} height={110} compact />
  if (type === 'physical')  return <RecentPhysicalChart data={data} height={110} compact />
  if (type === 'sleepMini') return <RecentSleepMini data={data} height={64} />
  if (type === 'sleepHRV')  return <SleepHRVChart height={140} compact legendPosition="left" />
  if (type === 'placeholder') return null // handled separately, needs needsExport text
  return null
}

// ── Mode-aware content renderer ───────────────────────────────────
function RouteContent({ route, onInvestigate, onShowNoticed, onExplore }) {
  const [chipAnswer, setChipAnswer] = useState(null)

  // ── Mode 1 — observation → interpretation → chart → context chip → ack ──
  if (route.mode === 1) {
    return (
      <div style={{ paddingTop: 12 }} onClick={(e) => e.stopPropagation()}>
        {route.openingFraming && (
          <p style={{ fontSize: 14, fontStyle: 'italic', color: 'var(--color-text-tertiary)', marginBottom: 10 }}>
            {route.openingFraming}
          </p>
        )}
        {route.observation && (
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
            {route.observation}
          </p>
        )}
        {route.interpretation && (
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-text-tertiary)', marginBottom: 12 }}>
            {route.interpretation}
          </p>
        )}

        {route.statPair && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            {Object.values(route.statPair).map(s => (
              <div key={s.label} style={{
                flex: 1, background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8, padding: '8px 10px',
              }}>
                <p style={{ fontSize: 12, color: 'var(--color-quiet, #888780)', marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>HRV {s.hrv} · RHR {s.rhr}</p>
              </div>
            ))}
          </div>
        )}

        {route.chart && (
          <div style={{ marginBottom: 4 }}>
            {route.chart === 'placeholder' ? (
              <RecentEvidenceMini needsExport={route.needsExport} height={64} />
            ) : route.chart === 'ranking' ? (
              <SignalRankingMini
                activity={yvonneActivity}
                recovery={yvonneRecovery}
                physical={yvonnePhysical}
                sleep={sleepQQRT}
                height={56}
              />
            ) : (
              <RouteChart type={route.chart} data={route.chartData} />
            )}
          </div>
        )}
        {route.chartCaption && (
          <p style={{ fontSize: 12, color: 'var(--color-quiet, #888780)', marginBottom: 14 }}>{route.chartCaption}</p>
        )}

        {route.contextQuestion && (
          <>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 10 }}>
              {route.contextQuestion}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {route.chips.map(chip => (
                <motion.span
                  key={chip}
                  onClick={() => setChipAnswer(chip)}
                  whileHover={{ scale: chipAnswer ? 1 : 1.02 }}
                  style={{
                    background: chipAnswer === chip ? 'rgba(6,129,252,0.15)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${chipAnswer === chip ? 'rgba(6,129,252,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 20, padding: '6px 14px', fontSize: 13,
                    cursor: 'pointer', color: chipAnswer === chip ? '#0681fc' : 'var(--color-text-secondary)',
                    opacity: chipAnswer && chipAnswer !== chip ? 0.4 : 1,
                    transition: 'all 0.15s',
                  }}
                >
                  {chip}
                </motion.span>
              ))}
            </div>
            <AnimatePresence>
              {chipAnswer && chipAnswer !== 'Skip' && route.acknowledgment && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontSize: 13, color: 'var(--color-text-tertiary)', lineHeight: 1.6,
                    borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 10,
                  }}
                >
                  {route.acknowledgment}
                </motion.p>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    )
  }

  // ── Mode 2 — calibrated silence, evidence chart, shared closing CTA ──
  if (route.mode === 2) {
    return (
      <div style={{ paddingTop: 12 }} onClick={(e) => e.stopPropagation()}>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
          {route.body}
        </p>

        <div style={{ marginBottom: 4 }}>
          {route.chart === 'placeholder'
            ? <RecentEvidenceMini needsExport={route.needsExport} height={64} />
            : <RouteChart type={route.chart} data={route.chartData} />}
        </div>
        {route.chartCaption && (
          <p style={{ fontSize: 12, color: 'var(--color-quiet, #888780)', marginBottom: 14 }}>{route.chartCaption}</p>
        )}

        {route.historicalNote && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12, marginBottom: 14 }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', lineHeight: 1.6, marginBottom: 8 }}>
              {route.historicalNote}
            </p>
            {route.historicalLink && (
              <motion.span
                onClick={() => onInvestigate(route.historicalLink.cardId)}
                whileHover={{ opacity: 0.8 }}
                style={{ color: 'var(--color-accent)', fontSize: 13, cursor: 'pointer', display: 'inline-block' }}
              >
                {route.historicalLink.label}
              </motion.span>
            )}
          </div>
        )}

        <motion.span
          onClick={onExplore}
          whileHover={{ opacity: 0.8 }}
          style={{ color: 'var(--color-accent)', fontSize: 14, cursor: 'pointer', display: 'inline-block' }}
        >
          Explore your data →
        </motion.span>
      </div>
    )
  }

  // ── Mode 3 — structurally unanswerable ──
  if (route.mode === 3) {
    return (
      <div style={{ paddingTop: 12 }} onClick={(e) => e.stopPropagation()}>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: 10 }}>
          {route.body}
        </p>
        {route.chart && (
          <div style={{ marginBottom: 4 }}>
            <RouteChart type={route.chart} data={route.chartData} />
          </div>
        )}
        {route.chartCaption && (
          <p style={{ fontSize: 12, color: 'var(--color-quiet, #888780)', marginBottom: 10 }}>{route.chartCaption}</p>
        )}
        {route.mode3Note && (
          <p style={{
            fontSize: 13, color: 'var(--color-text-tertiary)', lineHeight: 1.6,
            borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 10,
          }}>
            {route.mode3Note}
          </p>
        )}
      </div>
    )
  }

  if (route.cardId) {
    return (
      <div style={{ paddingTop: 12 }} onClick={(e) => e.stopPropagation()}>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: 14 }}>
          {route.reason}
        </p>
        <motion.button
          onClick={() => onInvestigate(route.cardId)}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          style={{
            background: 'var(--color-accent)', border: 'none', borderRadius: 8,
            padding: '10px 20px', color: '#fff', fontSize: 14,
            fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Investigate this →
        </motion.button>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 12 }} onClick={(e) => e.stopPropagation()}>
      <motion.button
        onClick={onShowNoticed}
        whileHover={{ scale: 1.02 }}
        style={{
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, padding: '10px 20px', color: '#fff', fontSize: 14,
          fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        Show me what Fluent noticed →
      </motion.button>
    </div>
  )
}

export default function SomethingDifferentScreen({
  persona, onNavigate, onBack, onFlow2
}) {
  const [selected, setSelected] = useState(null)
  const narrow = useIsNarrow()
  const routes = SIGNAL_ROUTES.yvonne
  const SNAPSHOT_LABELS = ['HRV', 'RHR', 'Deep sleep', 'Active cal']
 
  const snapshotMetrics =
    SNAPSHOT_LABELS.map(label => currentSnapshot.metrics.find(m => m.label === label)).filter(Boolean)
 

  function handleSelect(id) {
    setSelected(prev => prev === id ? null : id)
  }

  function handleInvestigate(cardId) {
    onFlow2(cardId)
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--color-base)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      flex: 1,
    }}>

      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(6,129,252,0.08) 0%, transparent 60%)',
      }} />

      <div style={{
        position: 'fixed', top: 32, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', zIndex: 20,
      }}>
        <motion.span whileHover={{ opacity: 0.7 }} onClick={onBack}
          style={{ fontSize: 16, fontWeight: 500, cursor: 'pointer' }}>
          fluent
        </motion.span>
      </div>

      <div style={{
          flex: 1, overflowY: 'auto',
          padding: '100px 24px 120px',
          position: 'relative', zIndex: 1,
        }}>
      
        <PageContainer>
             <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 40 }}
              >
                <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, marginBottom: 12, lineHeight: 1.15 }}>
                  Something feels different lately.
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 16, lineHeight: 1.6 }}>
                  You bring the feeling. Fluent checks the data.
                </p>
              </motion.div>
              <CurrentSnapshotCards metrics={snapshotMetrics} />
              <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {SIGNALS.map((signal, i) => {
              const isSelected = selected === signal.id
              const { Icon } = signal
              const route = routes[signal.id]

              return (
                <motion.div
                  key={signal.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, layout: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] } }}
                  onClick={() => handleSelect(signal.id)}
                  whileHover={{ y: isSelected ? 0 : -2 }}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    gap: 14, padding: '20px 18px',
                    background: isSelected ? 'rgba(6,129,252,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isSelected ? 'rgba(6,129,252,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 14, cursor: 'pointer',
                    transition: 'background 0.2s, border-color 0.2s',
                    minHeight: 108,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Icon size={22} color={isSelected ? 'var(--color-accent)' : 'rgba(255,255,255,0.55)'} />
                    {isSelected && <span style={{ color: 'var(--color-accent)', fontSize: 14 }}>✓</span>}
                  </div>
                  <span style={{
                    fontSize: 15, lineHeight: 1.35,
                    color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    fontWeight: isSelected ? 500 : 400,
                  }}>
                    {signal.label}
                  </span>

                  <AnimatePresence>
                    {isSelected && route && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <RouteContent
                          route={route}
                          onInvestigate={handleInvestigate}
                          onShowNoticed={() => onNavigate('noticed')}
                          onExplore={() => onNavigate('home')}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, layout: { duration: 0.3 } }}
            style={{ marginBottom: 24 }}
          >
            <div
              onClick={() => handleSelect('unsure')}
              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 2px' }}
            >
              <IconUnsure size={16} color="rgba(255,255,255,0.35)" />
              <span style={{
                fontSize: 14,
                color: selected === 'unsure' ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.35)',
              }}>
                I'm not sure — show me
              </span>
              {selected === 'unsure' && <span style={{ color: 'var(--color-accent)', fontSize: 14 }}>✓</span>}
            </div>

            <AnimatePresence>
              {selected === 'unsure' && routes.unsure && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden', paddingLeft: 26 }}
                >
                  <RouteContent
                    route={routes.unsure}
                    onInvestigate={handleInvestigate}
                    onShowNoticed={() => onNavigate('noticed')}
                    onExplore={() => onNavigate('home')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </PageContainer>
      </div>

      <FloatingNav active="different" onNavigate={onNavigate} />
    </div>
  )
}