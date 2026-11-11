// Shared layout for the fever-arc chart (demo React + site vanilla JS render the same primitives).
// Returns { prims, geom }. prims: [{ t:'rect'|'line'|'text'|'path', ...attrs }]
// Data shape: { days:[{date,hrv_dev,rhr_dev,wrist_dev,excluded,activities}], bands:[{id,label,from,to}], callouts:[...] }

const PINK = '#c450e8'
const BLUE = '#0681fc'
const INK = 'rgba(255,255,255,0.86)'
const QUIET = 'rgba(255,255,255,0.5)'
const HAIR = 'rgba(255,255,255,0.22)'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export function fmtDate(iso) {
  const [, m, d] = iso.split('-').map(Number)
  return `${MONTHS[m - 1]} ${d}`
}
const sgn = (v, dp) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(dp)}`

export function layoutFeverArc({ days, bands, callouts }, { width, height, compact }) {
  const narrow = width < 560
  const full = !compact
  const m = { l: 14, r: 14, t: compact ? 10 : 50, b: compact ? 10 : 50 }
  const plotW = width - m.l - m.r
  const plotH = height - m.t - m.b
  const midY = m.t + plotH / 2
  const n = days.length
  const dayW = plotW / n
  const barW = Math.max(dayW * 0.56, 2)
  const maxAbs = 30
  const xc = (i) => m.l + dayW * i + dayW / 2
  const ix = (date) => days.findIndex((d) => d.date === date)
  const hOf = (v) => (Math.abs(v) / maxAbs) * (plotH / 2)
  const prims = []

  // ── bands ────────────────────────────────────────────────
  bands.forEach((b) => {
    const i0 = ix(b.from)
    const i1 = ix(b.to)
    if (i0 < 0 || i1 < 0) return
    const x0 = xc(i0) - dayW / 2
    const x1 = xc(i1) + dayW / 2
    const fever = b.id === 'fever'
    prims.push({
      t: 'rect', x: x0, y: m.t, w: x1 - x0, h: plotH,
      fill: fever ? 'rgba(196,80,232,0.16)' : 'rgba(255,255,255,0.045)',
      stroke: fever ? 'none' : 'rgba(255,255,255,0.4)', dash: null, rx: 2,
      key: `band-${b.id}`,
    })
    if (full) {
      prims.push({
        t: 'text', x: (x0 + x1) / 2, y: m.t - 10, anchor: 'middle', size: 10, weight: 600,
        fill: fever ? '#e0a6f3' : INK, spacing: '0.06em', text: b.label.toUpperCase(), key: `bandlabel-${b.id}`,
      })
    }
  })

  // ── excluded (travel) days: small dashed boxes around the baseline ──
  days.forEach((d, i) => {
    if (!d.excluded) return
    prims.push({
      t: 'rect', x: xc(i) - dayW * 0.38, y: midY - 26, w: dayW * 0.76, h: 52,
      fill: 'none', stroke: 'rgba(255,255,255,0.35)', dash: '3 3', rx: 2, key: `ex-${d.date}`,
    })
  })

  // ── baseline ─────────────────────────────────────────────
  prims.push({ t: 'line', x1: m.l, x2: width - m.r, y1: midY, y2: midY, stroke: 'rgba(255,255,255,0.28)', sw: 1, key: 'baseline' })

  // ── HRV bars ─────────────────────────────────────────────
  days.forEach((d, i) => {
    if (d.excluded || d.hrv_dev == null) return
    const neg = d.hrv_dev < 0
    const h = hOf(d.hrv_dev)
    prims.push({
      t: 'rect', x: xc(i) - barW / 2, y: neg ? midY : midY - h, w: barW, h, rx: 1,
      fill: neg ? PINK : BLUE, opacity: 0.3 + (Math.abs(d.hrv_dev) / maxAbs) * 0.6, key: `bar-${d.date}`,
      bar: i,
    })
  })

  // Per-day notes for the tooltip (wrist call-outs, activity labels, windows, travel).
  const notes = days.map(() => [])
  callouts.forEach((c) => {
    if (c.type === 'activity' && ix(c.date) >= 0 && c.label && !(days[ix(c.date)].activities || []).length) notes[ix(c.date)].push(c.label.charAt(0).toUpperCase() + c.label.slice(1))
    if (c.type === 'note' && ix(c.date) >= 0) notes[ix(c.date)].push(c.label)
    if (c.type === 'avg') for (let i = ix(c.from); i <= ix(c.to); i++) if (i >= 0) notes[i].push(`Window avg ${sgn(c.value, 1)} ms HRV`)
  })
  bands.forEach((b) => { for (let i = ix(b.from); i <= ix(b.to); i++) if (i >= 0) notes[i].unshift(b.label) })
  const geom = { m, plotW, plotH, midY, dayW, xc, n, notes }
  if (!full) return { prims, geom }

  const text = (o) => prims.push({ t: 'text', size: 10, fill: INK, ...o })

  // small marker under the plot on days that have extra detail in the tooltip
  days.forEach((d, i) => {
    const hasExtra = d.excluded || callouts.some((c) => c.date === d.date && c.type !== 'avg')
    if (hasExtra) prims.push({ t: 'rect', x: xc(i) - 2, y: m.t + plotH + 4, w: 4, h: 4, rx: 2, fill: QUIET, key: `dot-${d.date}` })
  })

  // label the excluded days
  const ex = callouts.find((c) => c.type === 'excluded')
  if (ex) {
    const cx = (xc(ix(ex.from)) + xc(ix(ex.to))) / 2
    text({ x: cx, y: midY + 44, anchor: 'middle', size: 10, fill: QUIET, text: narrow ? 'travel' : 'travel days', key: 'ex-l1' })
    if (!narrow) text({ x: cx, y: midY + 56, anchor: 'middle', size: 10, fill: QUIET, text: 'excluded', key: 'ex-l2' })
  }

  // band averages under the plot
  callouts.filter((c) => c.type === 'avg').forEach((c) => {
    text({ x: (xc(ix(c.from)) + xc(ix(c.to))) / 2, y: m.t + plotH + 22, anchor: 'middle', text: `Avg ${sgn(c.value, 1)}ms`, weight: 600, key: `avg-${c.from}` })
  })

  // x axis: every day if room, else every 2nd (always the last day)
  const step = dayW >= 22 ? 1 : 2
  days.forEach((d, i) => {
    if (step === 2 && (i === n - 1 ? false : (i % 2 || i === n - 2))) return
    const [, mo, dd] = d.date.split('-').map(Number)
    const label = dd === 1 ? `${MONTHS[mo - 1]} 1` : `${dd}`
    text({ x: xc(i), y: height - 8, anchor: 'middle', size: 9, fill: QUIET, text: label, key: `tick-${d.date}` })
  })

  return { prims, geom }
}
