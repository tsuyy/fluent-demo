import { motion } from 'framer-motion'
import IconDifferent from './icons/IconDifferent'
import IconChanged   from './icons/IconChanged'
import IconActivity  from './icons/IconActivity'
import IconCardio    from './icons/IconCardio'
import IconSleep     from './icons/IconSleep'
import IconMoments   from './icons/IconMoments'

const NAV_ITEMS = [
  { id: 'different', Icon: IconDifferent, label: 'Something feels different' },
  { id: 'changed',   Icon: IconChanged,   label: "How I've changed"          },
  { id: 'activity',  Icon: IconActivity,  label: 'Movement & Recovery'       },
  { id: 'cardio',    Icon: IconCardio,    label: 'Heart & Nervous System'    },
  { id: 'sleep',     Icon: IconSleep,     label: 'Sleep'                     },
  { id: 'moments',   Icon: IconMoments,   label: 'Moments'                   },
]

export default function FloatingNav({ active, onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(20,20,18,0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 40,
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        zIndex: 200,
      }}
    >
      {NAV_ITEMS.map(item => {
        const isActive = active === item.id
        return (
          <NavItem
            key={item.id}
            item={item}
            isActive={isActive}
            onNavigate={onNavigate}
          />
        )
      })}
    </motion.div>
  )
}

function NavItem({ item, isActive, onNavigate }) {
  return (
    <motion.button
      onClick={() => onNavigate(item.id)}
      title={item.label}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: isActive
          ? 'rgba(6,129,252,0.2)'
          : 'transparent',
        border: 'none',
        borderRadius: 24,
        width: isActive ? 36 : 32,
        height: isActive ? 36 : 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: isActive
          ? 'var(--color-accent)'
          : 'rgba(255,255,255,0.4)',
        fontSize: isActive ? 14 : 12,
        fontWeight: isActive ? 600 : 400,
        transition: 'all 0.2s',
        // Active indicator: square vs circle
        borderRadius: isActive ? 8 : 24,
      }}
    >
      <item.Icon
        size={isActive ? 32 : 24}
        color={isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.4)'}
      />
    </motion.button>
  )
}