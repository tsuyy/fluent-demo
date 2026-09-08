import PuddingScene from '../../PuddingScene'
import { Lead } from '../../primitives'
import SleepMonthlyChart from '../../../charts/SleepMonthlyChart'
import SportSleepChart from '../../../charts/SportSleepChart'

const QUIET = 'var(--color-quiet, #888780)'

/**
 * Scene 5 — Sleep, fully rebuilt. Replaces the old weekly-architecture
 * bars + QQRT cards (removed per feedback — provided no real story)
 * with a monthly deep/REM trend, then a second section reusing the
 * existing interactive SportSleepChart radar, enlarged, with tennis/
 * skiing scroll-synced into focus while manual chips still work.
 */
export default function Scene05Sleep({ sleepMonthlyData }) {
  const monthlySteps = [
    {
      id: 'dip',
      content: (
        <div>
          <Lead>Your sleep isn't just a number.</Lead>
          <p style={{ fontSize: 'clamp(20px, 2.5vw, 30px)', lineHeight: 1.4, marginTop: 16 }}>
            Sep–Nov 2025 sat close to your baseline, with a real dip —{' '}
            <strong>November was your lowest deep-sleep month</strong>, just 31.6 minutes a night.
          </p>
        </div>
      ),
    },
    {
      id: 'climb',
      content: (
        <div>
          <Lead>Then it started climbing.</Lead>
          <p style={{ fontSize: 'clamp(20px, 2.5vw, 30px)', lineHeight: 1.4, marginTop: 16 }}>
            From December through May, both deep sleep and REM trended upward —
            gradually, month over month, not all at once.
          </p>
        </div>
      ),
    },
    {
      id: 'peak',
      content: (
        <div>
          <Lead>June through August was the best stretch on record.</Lead>
          <p style={{ fontSize: 'clamp(20px, 2.5vw, 30px)', lineHeight: 1.4, marginTop: 16 }}>
            June hit <strong>90.8 minutes of REM</strong> — a peak. August hit{' '}
            <strong>63.9 minutes of deep sleep</strong> — your best month ever recorded.
          </p>
          <p style={{ fontSize: 16, color: 'var(--color-text-tertiary)', marginTop: 20, lineHeight: 1.6 }}>
            Sleep data is directional guidance, not a score to optimize — a late
            night for something worth it isn't a health failure. It's a life
            decision the data can see but can't judge.
          </p>
        </div>
      ),
    },
  ]

  const sportSteps = [
    {
      id: 'intro',
      content: <Lead>What you do during the day shows up in how you sleep at night.</Lead>,
    },
    {
      id: 'tennis',
      focusSport: 'Tennis',
      content: (
        <div>
          <Lead>Tennis nights: deep sleep 61.5min.</Lead>
          <p style={{ fontSize: 16, color: 'var(--color-text-tertiary)', marginTop: 12, lineHeight: 1.6 }}>
            26% above your baseline — the same sport that gives your recovery
            the biggest boost also gives your sleep architecture the biggest boost.
          </p>
        </div>
      ),
    },
    {
      id: 'skiing',
      focusSport: 'Skiing',
      content: (
        <div>
          <Lead>Skiing nights: deep sleep 37.7min.</Lead>
          <p style={{ fontSize: 16, color: 'var(--color-text-tertiary)', marginTop: 12, lineHeight: 1.6 }}>
            23% below baseline — the same cost that shows up in next-day HRV
            shows up again overnight.
          </p>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PuddingScene
        label="How you slept — monthly trend"
        visualSide="left"
        visualFlex={58}
        textFlex={42}
        maxWidth={1300}
        steps={monthlySteps}
        renderVisual={(activeStepId) => (
          <SleepMonthlyChart
            data={sleepMonthlyData}
            height={380}
            hideAnnotations
            highlightLine={
              activeStepId === 'dip' ? 'deep'
              : activeStepId === 'peak' ? 'rem'
              : null
            }
          />
        )}
      />

      <PuddingScene
        label="Sleep and sport"
        visualSide="right"
        visualFlex={50}
        textFlex={50}
        maxWidth={1200}
        steps={sportSteps}
        renderVisual={(activeStepId) => {
          const step = sportSteps.find(s => s.id === activeStepId)
          return <SportSleepChart size={340} focusSport={step?.focusSport ?? null} />
        }}
      />
    </div>
  )
}