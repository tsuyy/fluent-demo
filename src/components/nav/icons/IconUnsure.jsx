// Question mark — swapped from magnifying glass per feedback.
// Simple, matches the solid-fill convention of the other icons.
export default function IconUnsure({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2a6 6 0 0 0-6 6h2.4a3.6 3.6 0 1 1 5.7 2.94c-1.16.87-2.1 1.7-2.1 3.06v.5h2.4v-.3c0-.86.5-1.35 1.5-2.1A6 6 0 0 0 12 2z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <circle cx="12" cy="19.5" r="1.5" fill={color} />
    </svg>
  )
}