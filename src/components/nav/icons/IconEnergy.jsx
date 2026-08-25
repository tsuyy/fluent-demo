// Matches the existing solid-fill icon convention (fillRule/clipRule).
// Simple bolt shape — guessed style, compare against real nav icons
// and adjust stroke weight / corner rounding to match exactly.
export default function IconEnergy({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.5 2L4 14h6.5l-1 8L20 10h-6.5l1-8z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}