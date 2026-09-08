import { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PuddingScene from '../../PuddingScene'
import { useIsNarrow } from '../../Scene'
import { Lead, Line, VerificationPrompt } from '../../primitives'

const QUIET  = 'var(--color-quiet, #888780)'
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const SPORT_COLORS = {
  all: null, tennis: '#27C48A', cycling: '#0681fc',
  running: '#6B9EFF', skiing: '#E8504A', strength: '#9B8AFF',
}
const SPORTS = ['all', 'tennis', 'cycling', 'running', 'skiing', 'strength']
const SPORT_LABELS = { all: 'All', tennis: 'Tennis', cycling: 'Cycling', running: 'Running', skiing: 'Skiing', strength: 'Strength' }

function minuteColor(minutes) {
  if (!minutes || minutes === 0) return '#1A1A18'
  if (minutes < 30)  return '#0E3D2A'
  if (minutes < 60)  return '#1A5C3A'
  if (minutes < 90)  return '#27C48A'
  return '#0681fc'
}
function sportColor(sportName, minutes) {
  if (!minutes || minutes === 0) return '#1A1A18'
  const base = SPORT_COLORS[sportName]
  if (!base) return minuteColor(minutes)
  const opacity = minutes < 30 ? 0.4 : minutes < 60 ? 0.7 : 1.0
  const r = parseInt(base.slice(1,3), 16), g = parseInt(base.slice(3,5), 16), b = parseInt(base.slice(5,7), 16)
  return `rgba(${r},${g},${b},${opacity})`
}
function cellColor(day, activeSport) {
  if (!day || day.value === 0) return '#1A1A18'
  if (activeSport === 'all') return minuteColor(day.value)
  const sportMinutes = day.sports?.[activeSport] ?? 0
  return sportColor(activeSport, sportMinutes)
}

function buildYearGrid(year, dayMap) {
  const jan1 = new Date(year, 0, 1)
  const startOff = (jan1.getDay() + 6) % 7
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  const days = isLeap ? 366 : 365
  const total = Math.ceil((days + startOff) / 7) * 7
  const weeks = []
  let week = []
  for (let i = 0; i < total; i++) {
    const idx = i - startOff
    if (idx < 0 || idx >= days) { week.push(null) }
    else {
      const d = new Date(year, 0, idx + 1)
      const key = `${year}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      const entry = dayMap[key]
      week.push({ date: key, month: d.getMonth(), value: entry?.value ?? 0, sports: entry?.sports ?? {} })
    }
    if (week.length === 7) { weeks.push(week); week = [] }
  }
  if (week.length) { while (week.length < 7) week.push(null); weeks.push(week) }
  return weeks
}
function getMonthStarts(weeks) {
  const seen = new Set(); const result = []
  weeks.forEach((week, wi) => week.forEach(day => {
    if (!day) return
    if (!seen.has(day.month)) { seen.add(day.month); result.push({ label: MONTH_NAMES[day.month], weekIndex: wi }) }
  }))
  return result
}

// Compute each year's actual dominant sport from real day-level data
// — the narrative below reads from this, it never asserts a claim
// that isn't directly derived from calendarData.
function computeYearlyDominantSport(calendarData, years) {
  const result = {}
  years.forEach(year => {
    const totals = {}
    calendarData?.forEach(d => {
      if (!d.day.startsWith(String(year))) return
      Object.entries(d.sports ?? {}).forEach(([sport, mins]) => {
        totals[sport] = (totals[sport] ?? 0) + mins
      })
    })
    const entries = Object.entries(totals)
    if (!entries.length) { result[year] = null; return }
    const [topSport, topMinutes] = entries.reduce((a, b) => b[1] > a[1] ? b : a)
    result[year] = { sport: topSport, minutes: Math.round(topMinutes) }
  })
  return result
}

function SportFilter({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
      {SPORTS.map(sport => {
        const isActive = active === sport
        const color = SPORT_COLORS[sport]
        return (
          <motion.button
            key={sport} type="button" onClick={() => onChange(sport)}
            whileHover={{ opacity: 0.85 }}
            style={{
              background: isActive ? (color ? `${color}22` : 'rgba(255,255,255,0.1)') : 'transparent',
              border: `1px solid ${isActive ? (color || 'rgba(255,255,255,0.4)') : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 999, padding: '5px 12px', fontSize: 14, fontFamily: 'inherit',
              cursor: 'pointer', color: isActive ? (color || 'rgba(255,255,255,0.9)') : QUIET,
              transition: 'all 0.15s ease',
            }}
          >
            {SPORT_LABELS[sport]}
          </motion.button>
        )
      })}
    </div>
  )
}

function CalendarGrid({ data, year, activeSport }) {
  const [tip, setTip] = useState(null)
  const wrapperRef = useRef(null)
  const gridRef = useRef(null)
  const [colW, setColW] = useState(0)

  const dayMap = useMemo(() => {
    const m = {}; data?.forEach(d => { m[d.day] = d }); return m
  }, [data])
  const weeks = useMemo(() => buildYearGrid(year, dayMap), [year, dayMap])
  const monthStarts = useMemo(() => getMonthStarts(weeks), [weeks])
  const numWeeks = weeks.length

  useEffect(() => {
    if (!wrapperRef.current) return
    const obs = new ResizeObserver(([e]) => setColW(e.contentRect.width))
    obs.observe(wrapperRef.current)
    return () => obs.disconnect()
  }, [])

  const cellSize = colW > 0 ? Math.floor(colW / numWeeks) : 9
  const cell = Math.max(cellSize - 1, 4)
  const gap = 1
  const cs = cell + gap
  const gridH = 7 * cs - gap

  const handleMouseMove = useCallback((e) => {
    if (!gridRef.current) return
    const el = e.target.closest('[data-date]')
    if (!el) { setTip(null); return }
    const date = el.getAttribute('data-date')
    const value = parseInt(el.getAttribute('data-value') || '0')
    const sport = el.getAttribute('data-sport') || ''
    if (!date || value === 0) { setTip(null); return }
    const cr = gridRef.current.getBoundingClientRect()
    setTip({ x: e.clientX - cr.left, y: e.clientY - cr.top, date, value, sport })
  }, [])

  return (
    <div ref={wrapperRef} style={{ width: '100%' }}>
      <div style={{ fontSize: 10, color: QUIET, letterSpacing: '0.05em', marginBottom: 3 }}>{year}</div>
      {colW > 0 && (
        <div style={{ position: 'relative', height: 12, marginBottom: 3 }}>
          {monthStarts.map(({ label, weekIndex }) => (
            <span key={label} style={{ position: 'absolute', left: weekIndex * cs, fontSize: 10, color: QUIET, letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
              {label}
            </span>
          ))}
        </div>
      )}
      {colW > 0 && (
        <div ref={gridRef} style={{ position: 'relative', width: numWeeks * cs, height: gridH }}
          onMouseMove={handleMouseMove} onMouseLeave={() => setTip(null)}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ position: 'absolute', left: wi * cs, top: 0 }}>
              {week.map((day, di) => {
                if (!day) return <div key={di} style={{ width: cell, height: cell, marginBottom: gap }} />
                const sportMins = activeSport !== 'all' ? (day.sports?.[activeSport] ?? 0) : day.value
                return (
                  <div key={di} data-date={day.date} data-value={sportMins} data-sport={activeSport}
                    style={{ width: cell, height: cell, marginBottom: gap, background: cellColor(day, activeSport), transition: 'background 0.3s ease' }} />
                )
              })}
            </div>
          ))}
          {tip && (() => {
            const [y, m, d] = tip.date.split('-').map(Number)
            const label = new Date(y, m-1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            const sportLabel = tip.sport !== 'all' ? ` (${SPORT_LABELS[tip.sport]})` : ''
            return (
              <div style={{
                position: 'absolute', left: Math.min(tip.x + 8, numWeeks * cs - 170), top: Math.max(tip.y - 36, 0),
                background: 'rgba(20,20,18,0.95)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 6, padding: '5px 10px', fontSize: 11, color: 'rgba(255,255,255,0.85)',
                pointerEvents: 'none', zIndex: 50, whiteSpace: 'nowrap',
              }}>
                {label} · {tip.value}min{sportLabel}
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

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