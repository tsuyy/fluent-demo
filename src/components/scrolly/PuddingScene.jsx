import { useState } from 'react'
import { Scrollama, Step } from 'react-scrollama'
import { useIsNarrow } from './Scene'

/**
 * PuddingScene — sticky visual column + normally-scrolling text
 * column. No Beat reveals, no fixed step count.
 *
 * `maxWidth` (default 1200) constrains the whole section and centers
 * it — without this, on a wide viewport the columns stretch edge to
 * edge, and anything that measures its own container width (like the
 * movement calendar) renders oversized as a direct consequence.
 *
 * `steps[].content` can be either plain JSX (unchanged from before)
 * OR a function `(isActive) => JSX` — use the function form when a
 * step needs to know whether IT specifically is the active one (e.g.
 * to gate a CountUp animation), since plain JSX has no way to ask
 * PuddingScene which step is current.
 */
export default function PuddingScene({
  steps,
  renderVisual,
  visualSide = 'left',
  visualFlex = 55,
  textFlex = 45,
  maxWidth = 1200,
  label,
}) {
  const narrow = useIsNarrow()
  const [activeStep, setActiveStep] = useState(steps[0]?.id)

  const handleStepEnter = ({ data }) => setActiveStep(data)

  const renderStepContent = (step) =>
    typeof step.content === 'function' ? step.content(activeStep === step.id) : step.content

  if (narrow) {
    return (
      <section aria-label={label} style={{ width: '100%', maxWidth, margin: '0 auto' }}>
        <div style={{ padding: '24px 24px', position: 'sticky', top: 0, zIndex: 1, background: 'var(--color-base)' }}>
          {renderVisual(activeStep)}
        </div>
        <Scrollama onStepEnter={handleStepEnter} offset={0.5}>
          {steps.map(step => (
            <Step data={step.id} key={step.id}>
              <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', padding: '24px' }}>
                {renderStepContent(step)}
              </div>
            </Step>
          ))}
        </Scrollama>
      </section>
    )
  }

  const visualColumn = (
    <div style={{
      flex: `0 0 ${visualFlex}%`,
      position: 'sticky', top: 0,
      height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 32px',
    }}>
      {renderVisual(activeStep)}
    </div>
  )

  const textColumn = (
    <div style={{ flex: `0 0 ${textFlex}%` }}>
      <Scrollama onStepEnter={handleStepEnter} offset={0.5}>
        {steps.map(step => (
          <Step data={step.id} key={step.id}>
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 32px' }}>
              {renderStepContent(step)}
            </div>
          </Step>
        ))}
      </Scrollama>
    </div>
  )

  return (
    <section
      aria-label={label}
      style={{ display: 'flex', width: '100%', maxWidth, margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }}
    >
      {visualSide === 'left' ? (<>{visualColumn}{textColumn}</>) : (<>{textColumn}{visualColumn}</>)}
    </section>
  )
}