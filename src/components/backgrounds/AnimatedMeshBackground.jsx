import { useId } from 'react'

/**
 * AnimatedMeshBackground — direct port of the baunov/gradients-bg
 * technique (CSS animation + SVG goo filter), recolored to a warm
 * orange/yellow/green/violet/blue palette.
 *
 * Key things that make this read as soft blobs rather than solid
 * color panels (the two things the first version got wrong):
 *
 *   1. Each blob is a radial-gradient — opaque core fading to fully
 *      transparent by 50% of its own radius — not a hard-filled
 *      circle. It's soft by construction; blur just adds polish.
 *   2. The goo filter + blur(40px) apply ONCE to the whole group
 *      (.gradients-container), not per-blob. Chain: SVG goo filter
 *      first, then a CSS blur on top of that result.
 *
 * Large blobs (80% of container) orbit via an off-center
 * transform-origin — rotating a centered, oversized shape around a
 * point away from its own center produces a slow circular sweep
 * rather than a simple back-and-forth drift.
 */
const DEFAULT_PALETTE = {
  bg1: 'rgb(30, 14, 8)',    // warm dark base (was purple/navy in the reference)
  bg2: 'rgb(10, 10, 14)',   // near-black, matches --color-base
  c1: '6, 129, 252',        // blue
  c2: '139, 92, 246',       // violet
  c3: '126, 217, 87',       // green
  c4: '255, 122, 26',       // orange
  c5: '255, 201, 60',       // yellow
}

export default function AnimatedMeshBackground({
  palette = DEFAULT_PALETTE,
  circleSize = 80,     // % of container — reference default
  blending = 'hard-light',
  opacity = 10,         // overall wrapper opacity, tune down if it fights with text
}) {
  const uid = useId().replace(/:/g, '')
  const cls = (name) => `mesh-${uid}-${name}`

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      zIndex: 0, pointerEvents: 'none',
      background: `linear-gradient(40deg, ${palette.bg1}, ${palette.bg2})`,
      opacity,
    }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id={`goo-${uid}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
            result="goo"
          />
        </filter>
      </svg>

      <div className={cls('container')} style={{
        filter: `url(#goo-${uid}) blur(150px)`,
        width: '100%', height: '100%',
      }}>
        <div className={cls('g1')} />
        <div className={cls('g2')} />
        <div className={cls('g3')} />
        <div className={cls('g4')} />
        <div className={cls('g5')} />
      </div>

      <style>{`
        @keyframes ${cls('moveInCircle')} {
          0%   { transform: rotate(0deg); }
          50%  { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ${cls('moveVertical')} {
          0%, 100% { transform: translateY(-50%); }
          50%      { transform: translateY(50%); }
        }
        @keyframes ${cls('moveHorizontal')} {
          0%, 100% { transform: translateX(-50%) translateY(-10%); }
          50%      { transform: translateX(50%) translateY(10%); }
        }

        .${cls('g1')}, .${cls('g2')}, .${cls('g3')}, .${cls('g4')}, .${cls('g5')} {
          position: absolute;
          width: ${circleSize}%;
          height: ${circleSize}%;
          top: calc(50% - ${circleSize}% / 2);
          left: calc(50% - ${circleSize}% / 2);
          mix-blend-mode: ${blending};
        }

        .${cls('g1')} {
          background: radial-gradient(circle at center, rgba(${palette.c1}, 0.8) 0, rgba(${palette.c1}, 0) 50%) no-repeat;
          transform-origin: center center;
          animation: ${cls('moveVertical')} 30s ease infinite;
        }
        .${cls('g2')} {
          background: radial-gradient(circle at center, rgba(${palette.c2}, 0.8) 0, rgba(${palette.c2}, 0) 50%) no-repeat;
          transform-origin: calc(50% - 400px);
          animation: ${cls('moveInCircle')} 40s reverse infinite;
        }
        .${cls('g3')} {
          top: calc(50% - ${circleSize}% / 2 + 200px);
          left: calc(50% - ${circleSize}% / 2 - 500px);
          background: radial-gradient(circle at center, rgba(${palette.c3}, 0.8) 0, rgba(${palette.c3}, 0) 50%) no-repeat;
          transform-origin: calc(50% + 400px);
          animation: ${cls('moveInCircle')} 50s linear infinite;
        }
        .${cls('g4')} {
          background: radial-gradient(circle at center, rgba(${palette.c4}, 0.8) 0, rgba(${palette.c4}, 0) 50%) no-repeat;
          transform-origin: calc(50% - 200px);
          animation: ${cls('moveHorizontal')} 40s ease infinite;
          opacity: 0.7;
        }
        .${cls('g5')} {
          width: calc(${circleSize}% * 2);
          height: calc(${circleSize}% * 2);
          top: calc(50% - ${circleSize}%);
          left: calc(50% - ${circleSize}%);
          background: radial-gradient(circle at center, rgba(${palette.c5}, 0.8) 0, rgba(${palette.c5}, 0) 50%) no-repeat;
          transform-origin: calc(50% - 800px) calc(50% + 200px);
          animation: ${cls('moveInCircle')} 20s ease infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .${cls('g1')}, .${cls('g2')}, .${cls('g3')}, .${cls('g4')}, .${cls('g5')} {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}