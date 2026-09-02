// Reuses the pulse-line concept from IconPhysical for visual
// consistency between the two — a heartbeat fact and the "something
// feels physical" button are conceptually related, so sharing a
// visual language between them (rather than a literal heart glyph,
// which would clash with whatever IconCardio already uses) keeps the
// icon set from having two different "heart" symbols competing.
export default function IconHeartbeat({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 12h4l2-6 3 12 2.5-9 1.5 3h5"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </svg>
  )
}