import PuddingScene from '../../PuddingScene'
import { Lead, BigNumber, CountUp } from '../../primitives'
import { InlineMetricTooltip } from '../../../../components/MetricTooltip'

/**
 * Scene 2 — Your Heart. Each metric now counts up from its start
 * value to its end value when its own step becomes active, instead
 * of showing both numbers stacked with an arrow between them.
 */
export default function Scene02Heart({ story, renderChart }) {
  const { rhr, hrv, resp } = story.heart

  const steps = [
    {
      id: 'rhr',
      content: (isActive) => (
        <div>
          <Lead>Let's start with the most fundamental signal.</Lead>
          <div style={{ marginTop: 16 }}>
            <BigNumber unit="bpm">
              <CountUp from={rhr.from} to={rhr.to} active={isActive} duration={1800} format={(v) => v.toFixed(1)} />
            </BigNumber>
          </div>
          <p style={{ fontSize: 20, color: 'var(--color-text-tertiary)', marginTop: 12, lineHeight: 1.6 }}>
            {rhr.perDay.toLocaleString()} fewer beats every day. {rhr.perYear} fewer beats every year.
          </p>
          <InlineMetricTooltip metric="rhr" marker="＊" />
        </div>
      ),
    },
    {
      id: 'hrv',
      content: (isActive) => (
        <div>
          <Lead>Your nervous system recovered at the same time.</Lead>
          <div style={{ marginTop: 16 }}>
            <BigNumber unit="ms">
              <CountUp from={hrv.from} to={hrv.to} active={isActive} duration={1800} format={(v) => v.toFixed(1)} />
            </BigNumber>
          </div>
          <p style={{ fontSize: 20, color: 'var(--color-text-tertiary)', marginTop: 12, lineHeight: 1.6 }}>
            <span style={{ color: 'var(--color-quiet, #888780)' }}>{hrv.pctLabel} more regulated.</span> RHR
            falling while HRV climbs isn't two separate improvements — it's the
            same shift, read two ways.
          </p>
          <InlineMetricTooltip metric="hrv" marker="＊" />
        </div>
      ),
    },
    {
      id: 'resp',
      content: (isActive) => (
        <div>
          <Lead>One signal that rarely gets attention.</Lead>
          <div style={{ marginTop: 16 }}>
            <BigNumber unit="br/min">
              <CountUp from={resp.from} to={resp.to} active={isActive} duration={1800} format={(v) => v.toFixed(1)} />
            </BigNumber>
          </div>
          <p style={{ fontSize: 20, color: 'var(--color-text-tertiary)', marginTop: 12, lineHeight: 1.6 }}>
            Most of that drop arrived around the same quarter your HRV started
            climbing fastest — three lines, one story: a resting body doing
            less work to stay ready.
          </p>
        </div>
      ),
    },
  ]

  return (
    <PuddingScene
      label="Your heart"
      visualSide="left"
      visualFlex={58}
      textFlex={42}
      maxWidth={1300}
      steps={steps}
      renderVisual={(activeStepId) => renderChart({ highlightLine: activeStepId })}
    />
  )
}