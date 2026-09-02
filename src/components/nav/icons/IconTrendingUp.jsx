export default function IconTrendingUp({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17l6-6 4 4 8-9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M15 6h6v6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}