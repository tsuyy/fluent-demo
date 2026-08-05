/**
 * Timeframe filtering for How I've Changed.
 *
 * Two entry points depending on what the series is keyed by:
 *   sliceQuarterly(rows, tf)  — quarterly.json and anything like it
 *   sliceByDate(rows, tf, getDate) — daily / weekly / monthly series
 */

export const TIMEFRAMES = [
  { id: '3m', label: '3m', months: 3, quarters: 1 },
  { id: '6m', label: '6m', months: 6, quarters: 2 },
  { id: '1y', label: '1yr', months: 12, quarters: 4 },
  { id: 'all', label: 'All', months: null, quarters: null },
]

export const DEFAULT_TIMEFRAME = 'all'

const byId = (id) => TIMEFRAMES.find((t) => t.id === id) ?? TIMEFRAMES[TIMEFRAMES.length - 1]

/* ------------------------------------------------------------------ *
 * Quarter labels — accepts "Q4 2022", "2022 Q4", "2022-Q4", "2022Q4".
 * Returns a sortable integer (year * 4 + quarter) or null.
 * ------------------------------------------------------------------ */

export function parseQuarterLabel(label) {
  if (typeof label !== 'string') return null
  const year = label.match(/(19|20)\d{2}/)
  const quarter = label.match(/Q\s*([1-4])/i)
  if (!year || !quarter) return null
  return Number(year[0]) * 4 + Number(quarter[1])
}

/**
 * Last N quarters of a chronological series.
 * Rows are sorted by their quarter label when one can be parsed;
 * otherwise the existing array order is trusted.
 */
export function sliceQuarterly(rows, timeframeId, { key = 'quarter' } = {}) {
  if (!Array.isArray(rows) || rows.length === 0) return []

  const tf = byId(timeframeId)
  if (tf.quarters == null) return rows

  const sortable = rows.every((r) => parseQuarterLabel(r?.[key]) != null)
  const ordered = sortable
    ? [...rows].sort((a, b) => parseQuarterLabel(a[key]) - parseQuarterLabel(b[key]))
    : rows

  return ordered.slice(-tf.quarters)
}

/**
 * Rows falling within the timeframe, measured back from the most
 * recent row rather than from today — a demo dataset that ends in
 * June shouldn't come back empty in December.
 */
export function sliceByDate(rows, timeframeId, getDate = (r) => r.date) {
  if (!Array.isArray(rows) || rows.length === 0) return []

  const tf = byId(timeframeId)
  if (tf.months == null) return rows

  const stamped = rows
    .map((row) => ({ row, time: new Date(getDate(row)).getTime() }))
    .filter((r) => Number.isFinite(r.time))

  if (stamped.length === 0) return rows

  const latest = Math.max(...stamped.map((r) => r.time))
  const cutoff = new Date(latest)
  cutoff.setMonth(cutoff.getMonth() - tf.months)

  return stamped
    .filter((r) => r.time >= cutoff.getTime())
    .sort((a, b) => a.time - b.time)
    .map((r) => r.row)
}

/**
 * Which timeframes are worth offering for a given series. A window
 * holding one data point can't show a trend, so it's disabled rather
 * than quietly padded out to look like one.
 */
export function usableTimeframes(rows, { granularity = 'quarter', getDate, minPoints = 2 } = {}) {
  const disabled = new Set()

  TIMEFRAMES.forEach((tf) => {
    const slice =
      granularity === 'quarter'
        ? sliceQuarterly(rows, tf.id)
        : sliceByDate(rows, tf.id, getDate)
    if (slice.length < minPoints) disabled.add(tf.id)
  })

  return { disabled }
}
