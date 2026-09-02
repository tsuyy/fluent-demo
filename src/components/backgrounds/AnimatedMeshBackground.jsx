import { useId, useState, useEffect, useRef } from 'react'

/**
 * AnimatedMeshBackground — port of baunov/gradients-bg, recolored,
 * varied blob shapes.
 *
 * `animated` (default false) controls whether the blobs move.
 * Static isn't a lesser version — after first paint it costs almost
 * nothing, since the expensive part is recomputing the blur+goo
 * filter every frame while children move, not the filter itself.
 * Reserve `animated` for screens with nothing else competing for
 * attention or render budget (thesis, persona picker, home) —
 * everywhere else, static gives the same look for near-zero ongoing
 * cost and keeps the background from pulling focus off charts.
 *
 * `pauseOnMouseMove` (default true when animated) freezes the blob
 * animation the instant the mouse moves, resuming after it's been
 * still for `idleDelay` ms. This matters most on HomeScreen, which
 * already runs its own mousemove-driven cursor tooltip — without
 * this, the browser would be recomputing the blur+goo filter AND
 * tracking cursor position in the same frame, exactly when the user
 * is actively engaging with the page rather than just looking at it.
 */
const DEFAULT_PALETTE = {
  bg1: 'rgb(30, 14, 8)',
  bg2: 'rgb(10, 10, 14)',
  c1: '6, 129, 252',
  c2: '139, 92, 246',
  c3: '126, 217, 87',
  c4: '255, 122, 26',
  c5: '255, 201, 60',
}

const DEFAULT_SHAPES = {
  g1: { widthPct: 100, heightPct: 100, gradientShape: 'circle',  borderRadius: '50%' },
  g2: { widthPct: 145, heightPct: 70,  gradientShape: 'ellipse', borderRadius: '50%' },
  g3: { widthPct: 65,  heightPct: 135, gradientShape: 'ellipse', borderRadius: '50%' },
  g4: { widthPct: 110, heightPct: 90,  gradientShape: 'ellipse', borderRadius: '58% 42% 35% 65% / 55% 40% 60% 45%' },
  g5: { widthPct: 100, heightPct: 100, gradientShape: 'ellipse', borderRadius: '62% 38% 55% 45% / 45% 60% 40% 55%' },
}

// Fixed rotation/offset each blob settles at in static mode — picked
// partway through each animation's range so the frozen frame still
// looks like an intentional composition, not just the 0% starting pose.
const STATIC_TRANSFORMS = {
  g1: 'translateY(-12%)',
  g2: 'rotate(70deg)',
  g3: 'rotate(140deg)',
  g4: 'translateX(-18%) translateY(4%)',
  g5: 'rotate(200deg)',
}

export default function AnimatedMeshBackground({
  palette = DEFAULT_PALETTE,
  shapes = DEFAULT_SHAPES,
  circleSize = 80,
  blending = 'hard-light',
  opacity = 1,
  animated = false, // reserve true for thesis / persona picker / home only
  pauseOnMouseMove = true,
  idleDelay = 400, // ms of no mouse movement before animation resumes
}) {
  const uid = useId().replace(/:/g, '')
  const cls = (name) => `mesh-${uid}-${name}`

  // Track mouse idle/moving state — only relevant when animated,
  // since static mode has nothing to pause in the first place.
  const [isMoving, setIsMoving] = useState(false)
  const idleTimer = useRef(null)

  useEffect(() => {
    if (!animated || !pauseOnMouseMove) return

    const handleMove = () => {
      setIsMoving(true)
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => setIsMoving(false), idleDelay)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [animated, pauseOnMouseMove, idleDelay])

  const shouldPause = animated && pauseOnMouseMove && isMoving

  const dim = (key) => ({
    w: (circleSize * shapes[key].widthPct) / 100,
    h: (circleSize * shapes[key].heightPct) / 100,
  })
  const g1 = dim('g1'), g2 = dim('g2'), g3 = dim('g3'), g4 = dim('g4'), g5 = dim('g5')

  // Each blob's animation-or-static rule, generated once per blob key
  const motionRule = (key, animationName, duration, direction = 'normal') =>
    animated
      ? `animation: ${cls(animationName)} ${duration} ${direction === 'reverse' ? 'reverse ' : ''}${direction === 'linear' ? 'linear' : 'ease'} infinite;`
      : `transform: ${STATIC_TRANSFORMS[key]}; will-change: auto;`

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

      <div
        className={`${cls('container')}${shouldPause ? ` ${cls('paused')}` : ''}`}
        style={{
          filter: `url(#goo-${uid}) blur(160px)`,
          width: '100%', height: '100%',
        }}
      >
        <div className={cls('g1')} />
        <div className={cls('g2')} />
        <div className={cls('g3')} />
        <div className={cls('g4')} />
        <div className={cls('g5')} />
      </div>

      <style>{`
        ${animated ? `
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
        ` : ''}

        .${cls('g1')} {
          position: absolute;
          width: ${g1.w}%; height: ${g1.h}%;
          top: calc(50% - ${g1.h}% / 2);
          left: calc(50% - ${g1.w}% / 2);
          border-radius: ${shapes.g1.borderRadius};
          background: radial-gradient(${shapes.g1.gradientShape} at center, rgba(${palette.c1}, 0.8) 0, rgba(${palette.c1}, 0) 50%) no-repeat;
          mix-blend-mode: ${blending};
          transform-origin: center center;
          ${motionRule('g1', 'moveVertical', '30s')}
        }
        .${cls('g2')} {
          position: absolute;
          width: ${g2.w}%; height: ${g2.h}%;
          top: calc(50% - ${g2.h}% / 2);
          left: calc(50% - ${g2.w}% / 2);
          border-radius: ${shapes.g2.borderRadius};
          background: radial-gradient(${shapes.g2.gradientShape} at center, rgba(${palette.c2}, 0.8) 0, rgba(${palette.c2}, 0) 50%) no-repeat;
          mix-blend-mode: ${blending};
          transform-origin: calc(50% - 400px);
          ${motionRule('g2', 'moveInCircle', '20s', 'reverse')}
        }
        .${cls('g3')} {
          position: absolute;
          width: ${g3.w}%; height: ${g3.h}%;
          top: calc(50% - ${g3.h}% / 2 + 200px);
          left: calc(50% - ${g3.w}% / 2 - 500px);
          border-radius: ${shapes.g3.borderRadius};
          background: radial-gradient(${shapes.g3.gradientShape} at center, rgba(${palette.c3}, 0.8) 0, rgba(${palette.c3}, 0) 50%) no-repeat;
          mix-blend-mode: ${blending};
          transform-origin: calc(50% + 400px);
          ${motionRule('g3', 'moveInCircle', '40s', 'linear')}
        }
        .${cls('g4')} {
          position: absolute;
          width: ${g4.w}%; height: ${g4.h}%;
          top: calc(50% - ${g4.h}% / 2);
          left: calc(50% - ${g4.w}% / 2);
          border-radius: ${shapes.g4.borderRadius};
          background: radial-gradient(${shapes.g4.gradientShape} at center, rgba(${palette.c4}, 0.8) 0, rgba(${palette.c4}, 0) 50%) no-repeat;
          mix-blend-mode: ${blending};
          transform-origin: calc(50% - 200px);
          opacity: 0.7;
          ${motionRule('g4', 'moveHorizontal', '40s')}
        }
        .${cls('g5')} {
          position: absolute;
          width: ${g5.w * 2}%; height: ${g5.h * 2}%;
          top: calc(50% - ${g5.h}%);
          left: calc(50% - ${g5.w}%);
          border-radius: ${shapes.g5.borderRadius};
          background: radial-gradient(${shapes.g5.gradientShape} at center, rgba(${palette.c5}, 0.8) 0, rgba(${palette.c5}, 0) 50%) no-repeat;
          mix-blend-mode: ${blending};
          transform-origin: calc(50% - 800px) calc(50% + 200px);
          ${motionRule('g5', 'moveInCircle', '20s')}
        }

        .${cls('paused')} .${cls('g1')},
        .${cls('paused')} .${cls('g2')},
        .${cls('paused')} .${cls('g3')},
        .${cls('paused')} .${cls('g4')},
        .${cls('paused')} .${cls('g5')} {
          animation-play-state: paused;
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