import { motion } from 'framer-motion'
import IconHome      from './icons/IconHome'
import IconDifferent from './icons/IconDifferent'
import IconChanged   from './icons/IconChanged'
import IconActivity  from './icons/IconActivity'
import IconCardio    from './icons/IconCardio'
import IconSleep     from './icons/IconSleep'
import IconMoments   from './icons/IconMoments'
import { useIsNarrow } from '../scrolly/useIsNarrow'

const NAV_ITEMS = [
  { id: 'different', Icon: IconDifferent, label: 'Something feels different' },
  { id: 'changed',   Icon: IconChanged,   label: "How I've changed" },
  { id: 'activity',  Icon: IconActivity,  label: 'Movement & Recovery' },
  { id: 'cardio',    Icon: IconCardio,    label: 'Heart & Nervous System' },
  { id: 'sleep',     Icon: IconSleep,     label: 'Sleep' },
  { id: 'moments',   Icon: IconMoments,   label: 'Moments' },
]

/**
 * FloatingNav.
 *
 * Centering: previously used `left: 50%; transform: translateX(-50%)`
 * on the pill itself. `position: fixed` stops being relative to the
 * viewport if ANY ancestor has a CSS transform/filter/will-change
 * property — and this build now uses `filter` fairly widely
 * (AnimatedMeshBackground's blur/goo, various chart containers), so
 * that offset math could easily be computing against the wrong box.
 * Switched to a full-width fixed wrapper (`left:0, right:0`) that
 * centers its child via flexbox instead — this doesn't depend on
 * knowing the pill's own width, so it can't be thrown off the same
 * way regardless of what's filtering an ancestor somewhere upstream.
 *
 * Sizing is bigger across the board per request; narrow-viewport
 * values are chosen so the full bar (Home + divider + 6 categories)
 * comfortably fits a 390px screen without needing horizontal scroll.
 */
export default function FloatingNav({ active, onNavigate }) {
  const narrow = useIsNarrow()

  const idleSize   = narrow ? 24 : 40
  const activeSize = narrow ? 28 : 44
  const gap        = narrow ? 4 : 8
  const padY       = narrow ? 8 : 14
  const padX       = narrow ? 12 : 26

  return (
    <div style={{
      position: 'fixed',
      bottom: narrow ? 16 : 28,
      left: 0, right: 0,
      display: 'flex', justifyContent: 'center',
      zIndex: 200, pointerEvents: 'none',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        style={{
          pointerEvents: 'auto',
          background: 'rgba(20,20,18,0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 40,
          padding: `${padY}px ${padX}px`,
          display: 'flex',
          alignItems: 'center',
          gap,
          maxWidth: 'calc(100vw - 20px)',
        }}
      >
        <NavItem
          item={{ id: 'home', Icon: IconHome, label: 'Home' }}
          isActive={false}
          onNavigate={onNavigate}
          idleSize={idleSize}
          activeSize={activeSize}
        />
        <div style={{
          width: 1, alignSelf: 'stretch', margin: `0 ${narrow ? 4 : 6}px`,
          background: 'rgba(255,255,255,0.12)',
        }} />

        {NAV_ITEMS.map(item => (
          <NavItem
            key={item.id}
            item={item}
            isActive={active === item.id}
            onNavigate={onNavigate}
            idleSize={idleSize}
            activeSize={activeSize}
          />
        ))}
      </motion.div>
    </div>
  )
}

function NavItem({ item, isActive, onNavigate, idleSize, activeSize }) {
  const iconSize = isActive ? activeSize : idleSize
  const boxSize  = iconSize + 10
  return (
    <motion.button
      onClick={() => onNavigate(item.id)}
      title={item.label}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: isActive ? 'rgba(6,129,252,0.2)' : 'transparent',
        border: 'none',
        borderRadius: isActive ? 10 : 24,
        width: boxSize, height: boxSize,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        transition: 'all 0.2s',
      }}
    >
      <item.Icon size={iconSize} color={isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.5)'} />
    </motion.button>
  )
}