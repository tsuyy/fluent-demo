import { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scene, Beat } from '../../Scene'
import { useIsNarrow } from '../../useIsNarrow'
import { Lead, Line, VerificationPrompt } from '../../primitives'

const QUIET  = 'var(--color-quiet, #888780)'
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ── Sport colours ─────────────────────────────────────────────────────────
const SPORT_COLORS = {
  all:      null,   // uses minute-based scale below
  tennis:   '#27C48A',
  cycling:  '#0681fc',
  running:  '#6B9EFF',
  skiing:   '#E8504A',
  strength: '#9B8AFF',
}

const SPORTS = ['all', 'tennis', 'cycling', 'running', 'skiing', 'strength']
const SPORT_LABELS = {
  all: 'All', tennis: 'Tennis', cycling: 'Cycling',
  running: 'Running', skiing: 'Skiing', strength: 'Strength',
}

// ── Colour scale for "all" mode (minutes, capped at 120) ─────────────────
function minuteColor(minutes) {
  if (!minutes || minutes === 0) return '#1A1A18'
  if (minutes < 30)  return '#0E3D2A'
  if (minutes < 60)  return '#1A5C3A'
  if (minutes < 90)  return '#27C48A'
  return '#0681fc'   // 90+ min = peak
}

// Solid sport colour at varying opacity by duration
function sportColor(sportName, minutes) {
  if (!minutes || minutes === 0) return '#1A1A18'
  const base = SPORT_COLORS[sportName]
  if (!base) return minuteColor(minutes)
  // opacity: 0.4 for <30min, 0.7 for 30-60, 1.0 for 60+
  const opacity = minutes < 30 ? 0.4 : minutes < 60 ? 0.7 : 1.0
  // Convert hex to rgba
  const r = parseInt(base.slice(1,3), 16)
  const g = parseInt(base.slice(3,5), 16)
  const b = parseInt(base.slice(5,7), 16)
  return `rgba(${r},${g},${b},${opacity})`
}

function cellColor(day, activeSport) {
  if (!day || day.value === 0) return '#1A1A18'
  if (activeSport === 'all') return minuteColor(day.value)
  const sportMinutes = day.sports?.[activeSport] ?? 0
  return sportColor(activeSport, sportMinutes)
}

// ── Year grid builder ─────────────────────────────────────────────────────
function buildYearGrid(year, dayMap) {
  const jan1     = new Date(year, 0, 1)
  const startOff = (jan1.getDay() + 6) % 7
  const isLeap   = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  const days     = isLeap ? 366 : 365
  const total    = Math.ceil((days + startOff) / 7) * 7
  const weeks    = []
  let week       = []

  for (let i = 0; i < total; i++) {
    const idx = i - startOff
    if (idx < 0 || idx >= days) {
      week.push(null)
    } else {
      const d   = new Date(year, 0, idx + 1)
      const key = `${year}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      const entry = dayMap[key]
      week.push({
        date:   key,
        month:  d.getMonth(),
        value:  entry?.value  ?? 0,
        sports: entry?.sports ?? {},
      })
    }
    if (week.length === 7) { weeks.push(week); week = [] }
  }
  if (week.length) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
  return weeks
}

function getMonthStarts(weeks) {
  const seen = new Set()
  const result = []
  weeks.forEach((week, wi) => {
    week.forEach(day => {
      if (!day) return
      if (!seen.has(day.month)) {
        seen.add(day.month)
        result.push({ label: MONTH_NAMES[day.month], weekIndex: wi })
      }
    })
  })
  return result
}

// ── Sport filter pills ────────────────────────────────────────────────────
function SportFilter({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
      {SPORTS.map(sport => {
        const isActive = active === sport
        const color = SPORT_COLORS[sport]
        return (
          <motion.button
            key={sport}
            type="button"
            onClick={() => onChange(sport)}
            whileHover={{ opacity: 0.85 }}
            style={{
              background: isActive
                ? (color ? `${color}22` : 'rgba(255,255,255,0.1)')
                : 'transparent',
              border: `1px solid ${isActive ? (color || 'rgba(255,255,255,0.4)') : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 999,
              padding: '5px 12px',
              fontSize: 12,
              fontFamily: 'inherit',
              cursor: 'pointer',
              color: isActive ? (color || 'rgba(255,255,255,0.9)') : 'var(--color-quiet, #888780)',
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

// ── Single year calendar ──────────────────────────────────────────────────
function CalendarGrid({ data, year, activeSport }) {
  const [tip, setTip]   = useState(null)
  const wrapperRef      = useRef(null)
  const gridRef         = useRef(null)
  const [colW, setColW] = useState(0)

  const dayMap = useMemo(() => {
    const m = {}
    data?.forEach(d => { m[d.day] = d })
    return m
  }, [data])

  const weeks       = useMemo(() => buildYearGrid(year, dayMap), [year, dayMap])
  const monthStarts = useMemo(() => getMonthStarts(weeks), [weeks])
  const numWeeks    = weeks.length

  useEffect(() => {
    if (!wrapperRef.current) return
    const obs = new ResizeObserver(([e]) => setColW(e.contentRect.width))
    obs.observe(wrapperRef.current)
    return () => obs.disconnect()
  }, [])

  const cellSize = colW > 0 ? Math.floor(colW / numWeeks) : 9
  const cell     = Math.max(cellSize - 1, 4)
  const gap      = 1
  const cs       = cell + gap
  const gridH    = 7 * cs - gap

  const handleMouseMove = useCallback((e) => {
    if (!gridRef.current) return
    const el = e.target.closest('[data-date]')
    if (!el) { setTip(null); return }
    const date  = el.getAttribute('data-date')
    const value = parseInt(el.getAttribute('data-value') || '0')
    const sport = el.getAttribute('data-sport') || ''
    if (!date || value === 0) { setTip(null); return }
    const cr = gridRef.current.getBoundingClientRect()
    setTip({ x: e.clientX - cr.left, y: e.clientY - cr.top, date, value, sport })
  }, [])

  return (
    <div ref={wrapperRef} style={{ width: '100%' }}>
      <div style={{
        fontSize: 10, color: QUIET, letterSpacing: '0.05em', marginBottom: 3,
        fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
      }}>
        {year}
      </div>

      {colW > 0 && (
        <div style={{ position: 'relative', height: 12, marginBottom: 3 }}>
          {monthStarts.map(({ label, weekIndex }) => (
            <span key={label} style={{
              position: 'absolute', left: weekIndex * cs,
              fontSize: 8, color: QUIET, letterSpacing: '0.03em',
              fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
              whiteSpace: 'nowrap',
            }}>
              {label}
            </span>
          ))}
        </div>
      )}

      {colW > 0 && (
        <div
          ref={gridRef}
          style={{ position: 'relative', width: numWeeks * cs, height: gridH }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTip(null)}
        >
          {weeks.map((week, wi) => (
            <div key={wi} style={{ position: 'absolute', left: wi * cs, top: 0 }}>
              {week.map((day, di) => {
                if (!day) return (
                  <div key={di} style={{ width: cell, height: cell, marginBottom: gap }} />
                )
                const sportMins = activeSport !== 'all' ? (day.sports?.[activeSport] ?? 0) : day.value
                const bg = cellColor(day, activeSport)
                return (
                  <div
                    key={di}
                    data-date={day.date}
                    data-value={sportMins}
                    data-sport={activeSport}
                    style={{
                      width: cell, height: cell, marginBottom: gap,
                      borderRadius: '0px',
                      background: bg,
                      transition: 'background 0.3s ease',
                    }}
                  />
                )
              })}
            </div>
          ))}

          {tip && (() => {
            const [y, m, d] = tip.date.split('-').map(Number)
            const label = new Date(y, m-1, d).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            })
            const sportLabel = tip.sport !== 'all' ? ` (${SPORT_LABELS[tip.sport]})` : ''
            return (
              <div style={{
                position: 'absolute',
                left: Math.min(tip.x + 8, numWeeks * cs - 170),
                top:  Math.max(tip.y - 36, 0),
                background: 'rgba(20,20,18,0.95)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 6, padding: '5px 10px',
                fontSize: 11, color: 'rgba(255,255,255,0.85)',
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

// ── Scene 3 ───────────────────────────────────────────────────────────────
const YEAR_ROWS = [2022, 2023, 2024, 2025]

export default function Scene03Movement({ beat, isActive, story, response, onRespond, calendarData }) {
  const narrow = useIsNarrow()
  const [activeSport, setActiveSport] = useState('all')

  return (
    <Scene
      layout="split"
      beat={beat}
      isActive={isActive}
      label="How you moved"
      maxWidth={1300}
      splitColumns="minmax(300px, 7fr) minmax(260px, 5fr)"
      left={
        <Beat at={1} delay={0.2}>
          <div style={{ width: '100%' }}>
            <SportFilter active={activeSport} onChange={setActiveSport} />
            <div style={{ display: 'grid', gap: narrow ? 16 : 20, width: '100%' }}>
              {YEAR_ROWS.map(year => (
                <CalendarGrid
                  key={year}
                  data={calendarData}
                  year={year}
                  activeSport={activeSport}
                />
              ))}
            </div>
          </div>
        </Beat>
      }
      right={
        <div style={{ display: 'grid', gap: narrow ? 16 : 24 }}>
          <Beat at={0}>
            <Lead>You moved on almost every day.</Lead>
          </Beat>
          <Beat at={1} delay={0.1}>
            <Line tone="secondary">Of every year.</Line>
          </Beat>
          <Beat at={2}>
            <Line>Summer is when you move most.</Line>
          </Beat>
          <Beat at={3}>
            <div style={{ display: 'grid', gap: 6 }}>
              <Line>June — every year.</Line>
              <Line tone="secondary">December and January, your quietest.</Line>
            </div>
          </Beat>
          <Beat at={4}>
            <VerificationPrompt
              question="What drives that pattern for you?"
              options={['Weather / season', 'Work rhythms', 'Social life', 'Just how it is', 'Something else']}
              value={response}
              onChange={onRespond}
              acknowledgement="Fluent can see the when. The why has always been yours."
            />
          </Beat>
        </div>
      }
    />
  )
}