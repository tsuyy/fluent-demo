export default function IconPhone({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="2.5" width="12" height="19" rx="2.2" stroke={color} strokeWidth="1.8" />
      <line x1="10.5" y1="19" x2="13.5" y2="19" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}