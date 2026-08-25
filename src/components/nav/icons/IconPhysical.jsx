// Deliberately NOT a heart — the Mode 3 copy for this button is about
// sensations a wrist sensor can't see at all (pain, injury, symptoms),
// not cardio specifically. Reusing IconCardio's heart here would claim
// something narrower than what this option actually means. A pulse
// line reads as "bodily signal" without over-specifying which one.
// This is the icon most likely to need adjustment — see note above.
export default function IconPhysical({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 12h4l2-6 3 12 2.5-9 1.5 3h5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}