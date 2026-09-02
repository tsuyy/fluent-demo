export default function IconGolf({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="7" y1="21" x2="7" y2="3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 3l9 4-9 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <ellipse cx="7" cy="21.5" rx="5" ry="1.2" fill={color} opacity="0.3" />
    </svg>
  )
}