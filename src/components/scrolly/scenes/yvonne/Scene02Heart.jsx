import { Scene, Beat } from '../../Scene'
import { useIsNarrow } from '../../useIsNarrow'
import { Lead, Line, BigNumber, CountUp, InfoNote, VerificationPrompt } from '../../primitives'
import MetricTooltip from '../../../../components/MetricTooltip'

const QUIET = 'var(--color-quiet, #888780)'

const ACK = {
  'Yes, I know what this was':
    'Then the quarter has a name. Fluent only found the shift — the meaning was already yours.',
  'Not sure':
    'That happens. Fluent can mark a shift without being able to explain it.',
  Skip: null,
}

export default function Scene02Heart({ beat, isActive, story, response, onRespond, renderChart }) {
  const narrow = useIsNarrow()
  const { rhr, hrv } = story.heart

  return (
    <Scene
      layout="split"
      beat={beat}
      isActive={isActive}
      label="Your heart"
      left={
        <div style={{ display: 'grid', gap: narrow ? 14 : 20 }}>
          <Beat at={0}>
            <Lead>Let's start with the most fundamental signal.</Lead>
          </Beat>

          <Beat at={0} delay={0.3}>
            <BigNumber unit="bpm">
              <CountUp
                from={rhr.from}
                to={rhr.to}
                active={beat >= 1}
                duration={1800}
                format={(v) => Math.round(v)}
              />
            </BigNumber>
          </Beat>

          <Beat at={1}>
            <Line tone="secondary">
              Your resting heart rate has been declining ever since.
            </Line>
          </Beat>

          <Beat at={2}>
            <div style={{ display: 'grid', gap: 4 }}>
              <Line>{rhr.perDay.toLocaleString()} fewer beats every day.</Line>
              <Line>{rhr.perYear} fewer beats every year.</Line>
            </div>
          </Beat>

          <Beat at={2} delay={0.25}>
            <MetricTooltip metric="rhr" marker="＊" />
          </Beat>

          <Beat at={3}>
            <div style={{ display: 'grid', gap: 4 }}>
              <Line tone="secondary">Your nervous system recovered at the same time.</Line>
              <Line>
                HRV: {hrv.from}ms → {hrv.to}ms.{' '}
                <span style={{ color: QUIET }}>{hrv.pctLabel} more regulated.</span>
              </Line>
              <MetricTooltip metric="hrv" marker="＊" />
            </div>
          </Beat>

          <Beat at={4}>
            <VerificationPrompt
              question={`Something significant happened in ${story.pivotQuarter}. Do you remember this period?`}
              options={['Yes, I know what this was', 'Not sure', 'Skip']}
              value={response}
              onChange={onRespond}
              acknowledgement={(v) => ACK[v]}
            />
          </Beat>
        </div>
      }
      right={
        <Beat at={0} delay={0.5}>
          <div style={{ height: narrow ? 220 : 380, width: '100%' }}>
            {renderChart({ showHRV: beat >= 3 })}
          </div>
        </Beat>
      }
    />
  )
}