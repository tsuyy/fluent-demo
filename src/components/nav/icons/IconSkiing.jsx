export default function IconSkiing({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 20L18 4" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path fill={color} d="M18.7285 18.9599C19.1749 19.5202 19.0587 20.3183 18.4688 20.7425C17.8787 21.1665 17.0383 21.0552 16.5917 20.4949L12.5 15.3158L14.1541 13.1743L18.7285 18.9599Z" />
      <path fill={color} d="M4.53106 3.25761C5.12115 2.83347 5.96257 2.94481 6.40925 3.50516L11 9.15789L9.3469 11.3004L4.27142 5.04019C3.82516 4.47989 3.94123 3.68172 4.53106 3.25761Z" />
    </svg>
  )
}