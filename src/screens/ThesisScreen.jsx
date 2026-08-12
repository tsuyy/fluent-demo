import { motion } from 'framer-motion'

export default function ThesisScreen({ onContinue }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--color-base)',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Subtle ambient gradient */}
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 70% 30%, rgba(6,129,252,0.12) 0%, rgba(39,196,138,0.06) 50%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Nav */}
      <div style={{
        position: 'absolute', top: 32, left: 48,
      }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>fluent</span>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: 700, margin: '0 auto',
        padding: '0 48px',
        position: 'relative', zIndex: 1,
      }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 }}
          style={{
            fontSize: 'clamp(18px, 2.2vw, 26px)',
            lineHeight: 1.7,
            color: 'var(--color-text-primary)',
            marginBottom: 24,
          }}
        >
            I wanted to know what all this data was actually telling me.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontSize: 'clamp(18px, 2.2vw, 26px)',
            lineHeight: 1.7,
            color: 'var(--color-text-primary)',
            marginBottom: 24,
          }}
        >
            I'm active — running, tennis, strength training, skiing — but I had 
            no good way to see how those choices were affecting my body over time.        
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontSize: 'clamp(18px, 2.2vw, 26px)',
            lineHeight: 1.7,
            color: 'var(--color-text-primary)',
            marginBottom: 24,
          }}
        >
            Fluent isn't about optimizing your health or hitting goals. It's a way 
            to explore your own wearable data — connecting what your body is doing 
            to the life you're living.        
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            fontSize: 'clamp(18px, 2.2vw, 26px)',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
            marginBottom: 64,
          }}
        >
          This demo is built from four years of my own data.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <motion.button
            onClick={onContinue}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              padding: '14px 32px',
              color: 'var(--color-text-primary)',
              fontSize: 16,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 400,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
            onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
          >
            Explore my data →
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}