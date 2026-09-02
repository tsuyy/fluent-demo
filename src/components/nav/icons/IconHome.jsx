export default function IconHome({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3.2 3 10.8V21h6v-6.5h6V21h6V10.8L12 3.2z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}