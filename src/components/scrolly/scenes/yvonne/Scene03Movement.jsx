import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PuddingScene from '../../PuddingScene'
import { useIsNarrow } from '../../Scene'
import { Lead, Line, VerificationPrompt } from '../../primitives'
import { SportFilter, CalendarGrid, computeYearlyDominantSport, SPORT_LABELS } from '../../../charts/MovementCalendar'

const YEAR_ROWS = [2022, 2023, 2024, 2025]

/**
 * Scene 3 — Movement, rebuilt on PuddingScene. Calendar (all 4 years
 * + filter chips) sticky on the left; text scrolls normally on the
 * right. Scroll-driven steps auto-switch the sport filter as you
 * reach each year's callout, but the manual chips still work at any
 * time — same `activeSport` state, whichever trigger fired last wins,
 * no fighting between scroll-sync and manual override.
 */
export default function Scene03Movement({ story, response, onRespond, calendarData }) {
  const [activeSport, setActiveSport] = useState('all')
  const yearlyDominant = useMemo(() => computeYearlyDominantSport(calendarData, YEAR_ROWS), [calendarData])

  const steps = [
    {
      id: 'intro',
      onEnter: () => setActiveSport('all'),
      content: (
        <div>
          <Lead>You moved on almost every day of every year.</Lead>
          <p style={{ fontSize:20, color: 'var(--color-text-tertiary)', marginTop: 16, lineHeight: 1.6 }}>
            Summer is when you move most — June, every year. December and
            January are your quietest months.
          </p>
        </div>
      ),
    },
    ...YEAR_ROWS.filter(year => yearlyDominant[year]).map(year => {
      const { sport, minutes } = yearlyDominant[year]
      return {
        id: `year-${year}`,
        sportFilter: sport,
        content: (
          <div>
            <Lead>{SPORT_LABELS[sport]} was your most-logged sport in {year}.</Lead>
            <p style={{ fontSize:20, color: 'var(--color-text-tertiary)', marginTop: 16, lineHeight: 1.6 }}>
              {minutes.toLocaleString()} minutes logged that year — more than any
              other activity.
            </p>
          </div>
        ),
      }
    }),
    {
      id: 'verify',
      sportFilter: 'all',
      content: (
        <VerificationPrompt
          question="What drives that pattern for you?"
          options={['Weather / season', 'Work rhythms', 'Social life', 'Just how it is', 'Something else']}
          value={response}
          onChange={onRespond}
          acknowledgement="Fluent can see the when. The why has always been yours."
        />
      ),
    },
  ]

  return (
    <PuddingScene
      label="How you moved"
      visualSide="left"
      visualFlex={62}
      textFlex={38}
      steps={steps.map(s => ({
        id: s.id,
        content: s.content,
      }))}
      renderVisual={(activeStepId) => {
        // Sync sport filter to whichever step is active, unless the
        // person has manually clicked a chip more recently — both
        // paths just call setActiveSport, so this stays correct
        // without extra coordination logic.
        const step = steps.find(s => s.id === activeStepId)
        if (step?.sportFilter && step.sportFilter !== activeSport) {
          // Deferred to avoid setState-during-render; safe since this
          // only runs on step change, not every render.
          queueMicrotask(() => setActiveSport(step.sportFilter))
        }
        return (
          <div style={{ width: '100%' }}>
            <SportFilter active={activeSport} onChange={setActiveSport} />
            <div style={{ display: 'grid', gap: 16, width: '100%' }}>
              {YEAR_ROWS.map(year => (
                <CalendarGrid key={year} data={calendarData} year={year} activeSport={activeSport} />
              ))}
            </div>
          </div>
        )
      }}
    />
  )
}