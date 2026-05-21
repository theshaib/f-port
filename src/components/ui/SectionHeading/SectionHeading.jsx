import { memo } from 'react'
import clsx from 'clsx'
import { SplitText } from '../../animations/index.js'
import './SectionHeading.css'

function SectionHeading({
  eyebrow,
  title,
  className,
  eyebrowClassName,
  titleClassName,
  titleTag = 'h2',
  titleDelay = 28,
  titleDirection = 'top',
  titleStepDuration = 0.58,
}) {
  return (
    <div className={clsx('section-heading', className)}>
      {eyebrow ? <div className={clsx('section-heading-eyebrow', eyebrowClassName)}>{eyebrow}</div> : null}
      <SplitText
        as={titleTag}
        text={title}
        animateBy="chars"
        delay={titleDelay}
        direction={titleDirection}
        stepDuration={titleStepDuration}
        className={clsx('section-heading-title', titleClassName)}
      />
    </div>
  )
}

export default memo(SectionHeading)
