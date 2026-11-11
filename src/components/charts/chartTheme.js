// Shared Nivo theme — import in any chart component
export const CHART_THEME = {
  background: 'transparent',
  textColor: 'rgba(255,255,255,0.35)',
  fontSize: 12,
  fontFamily: 'var(--font-display, "DM Sans"), sans-serif',
  axis: {
    domain: { line: { stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 } },
    ticks: {
      line: { stroke: 'transparent' },
      text: { fill: 'rgba(255,255,255,0.6)', fontSize: 12 },
    },
    legend: {
      text: { fill: 'rgba(255,255,255,0.5)', fontSize: 11 },
    },
  },
  grid: {
    line: { stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 },
  },
  crosshair: {
    line: { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 },
  },
  legends: {
    text: { fill: 'rgba(255,255,255,0.6)', fontSize: 12 },
  },
  tooltip: {
    container: {
      background: '#1A1A18',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 8,
      padding: '6px 10px',
      fontSize: 11,
      color: 'rgba(255,255,255,0.85)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    },
  },
}

export const tooltipStyle = {
  background: '#1A1A18',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8,
  padding: '6px 10px',
  fontSize: 11,
  color: 'rgba(255,255,255,0.85)',
  lineHeight: 1.6,
}