import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Scene, Beat, useScene, useIsNarrow } from '../../Scene'
import { Lead, Line, BigNumber, VerificationPrompt } from '../../primitives'
 
const QUIET   = 'var(--color-quiet, #888780)'
const ACCENT  = 'var(--color-accent, #0681fc)'
const RECOVER = 'var(--color-recovery, #27C48A)'
const STRESS  = 'var(--color-stress, #E8504A)'
const TEXT    = 'var(--color-text, rgba(255,255,255,0.92))'
 
// ── Sports ordered by spec: negative sports first, then positive ──────────
// The scene reveals skiing's cost first, then tennis's gain.
// Values are delta-HRV in ms relative to baseline.
const SPORTS = [
  { id: 'skiing',   label: 'Skiing',   delta: -10.4, days: 4,  note: '4 days to recover' },
  { id: 'cycling',  label: 'Cycling',  delta: -1.2,  days: 1,  note: null },
  { id: 'running',  label: 'Running',  delta: +1.8,  days: null, note: null },
  { id: 'strength', label: 'Strength', delta: +2.3,  days: null, note: null },
  { id: 'tennis',   label: 'Tennis',   delta: +5.5,  days: 2,  note: '+5.5ms two days after' },
]
 
const MAX_ABS = Math.max(...SPORTS.map(s => Math.abs(s.delta)))
 
// ── Single sport bar ──────────────────────────────────────────────────────
function SportBar({ sport, revealed, narrow }) {
  const { reduced } = useScene()
  const isNeg  = sport.delta < 0
  const color  = isNeg ? STRESS : RECOVER
  const pct    = (Math.abs(sport.delta) / MAX_ABS) * 100
 
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: narrow ? '72px 1fr auto' : '96px 1fr auto',
      alignItems: 'center',
      gap: narrow ? 10 : 16,
      opacity: revealed ? 1 : 0,
      transition: reduced ? 'none' : 'opacity 0.4s ease',
    }}>
      {/* Label */}
      <span style={{
        fontSize: narrow ? 13 : 14,
        color: revealed ? TEXT : QUIET,
        textAlign: 'right',
        transition: 'color 0.3s',
      }}>
        {sport.label}
      </span>
 
      {/* Bar track */}
      <div style={{
        height: narrow ? 8 : 10,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 999,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: revealed ? `${pct}%` : 0 }}
          transition={{ duration: reduced ? 0 : 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: isNeg ? 'auto' : 0,
            right: isNeg ? 0 : 'auto',
            background: color,
            borderRadius: 999,
          }}
        />
      </div>
 
      {/* Delta value */}
      <span style={{
        fontSize: narrow ? 12 : 13,
        color: revealed ? color : 'transparent',
        fontVariantNumeric: 'tabular-nums',
        minWidth: 52,
        textAlign: 'right',
        transition: 'color 0.3s',
      }}>
        {sport.delta > 0 ? '+' : ''}{sport.delta}ms
      </span>
    </div>
  )
}
 
// ── Scene 4 ───────────────────────────────────────────────────────────────
// Beat sequence:
//   0 — intro copy
//   1 — skiing bar + cost copy
//   2 — cycling + running + strength bars appear
//   3 — tennis bar + gain copy
//   4 — closing stat cards ("agency" line)
//   5 — verification
 
export default function Scene04Sports({ beat, isActive, story, response, onRespond }) {
  const narrow = useIsNarrow()
 
  // Which sports are revealed at each beat
  const revealed = {
    skiing:   beat >= 1,
    cycling:  beat >= 2,
    running:  beat >= 2,
    strength: beat >= 2,
    tennis:   beat >= 3,
  }
 
  return (
    <Scene
      layout="split"
      beat={beat}
      isActive={isActive}
      label="What the data noticed"
      left={
        <div style={{ display: 'grid', gap: narrow ? 14 : 20 }}>
          <Beat at={0}>
            <Lead>The data noticed something about what you do.</Lead>
          </Beat>
 
          <Beat at={1}>
            <Line>Skiing costs the most.</Line>
            <Line tone="secondary">
              −10.4ms the day you ski. Four days to fully recover.
            </Line>
          </Beat>
 
          <Beat at={3}>
            <Line>Tennis gives the most back.</Line>
            <Line tone="secondary">
              +5.5ms two days after. More than cycling or running.
            </Line>
          </Beat>
 
          <Beat at={4}>
            <div style={{
              padding: '16px 0',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'grid',
              gap: 8,
            }}>
              <Line>Skiing costs the most. You ski anyway.</Line>
              <Line tone="quiet" style={{ fontStyle: 'italic' }}>
                That's not optimization. That's agency.
              </Line>
            </div>
          </Beat>
 
          <Beat at={5}>
            <VerificationPrompt
              question="Did you know tennis was doing this for your recovery?"
              options={["Yes, I've noticed", 'No — this is new', 'I play for other reasons']}
              value={response}
              onChange={onRespond}
              acknowledgement={(v) =>
                v === "Yes, I've noticed"
                  ? "Your intuition was picking up something real."
                  : v === 'I play for other reasons'
                  ? "The data noticed something you weren't tracking. Both things are true."
                  : "Now you have a name for something you've been feeling."
              }
            />
          </Beat>
        </div>
      }
      right={
        <Beat at={0} delay={0.4}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
            padding: narrow ? '20px 16px' : '28px 24px',
            display: 'grid',
            gap: narrow ? 14 : 18,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: QUIET, letterSpacing: '0.05em' }}>
                HRV DELTA AFTER ACTIVITY
              </span>
              <span style={{ fontSize: 11, color: QUIET }}>ms</span>
            </div>
 
            {/* Divider at zero */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                right: 0, left: 0,
                top: '50%',
                height: 1,
                background: 'rgba(255,255,255,0.06)',
              }} />
            </div>
 
            <div style={{ display: 'grid', gap: narrow ? 12 : 16 }}>
              {SPORTS.map(sport => (
                <SportBar
                  key={sport.id}
                  sport={sport}
                  revealed={revealed[sport.id]}
                  narrow={narrow}
                />
              ))}
            </div>
 
            <p style={{ fontSize: 11, color: QUIET, marginTop: 4, lineHeight: 1.5 }}>
              Based on {story?.tennis?.sessions ?? 22} tennis sessions since 2025.
              Compared against your personal HRV baseline.
            </p>
          </div>
        </Beat>
      }
    />
  )
}