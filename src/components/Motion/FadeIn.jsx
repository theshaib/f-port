import clsx from 'clsx'

import { FadeReveal } from '../animations/index.js'

const defaultViewport = { once: true, amount: 0.16, margin: '0px 0px -8% 0px' }

function FadeIn({
  as = 'div',
  children,
  className,
  delay = 0,
  duration = 0.64,
  direction = 'up',
  distance = 24,
  viewport = defaultViewport,
  ...props
}) {
  return (
    <FadeReveal
      as={as}
      className={clsx('motion-fade-in', className)}
      delay={Math.min(delay, 0.24)}
      duration={Math.min(duration, 0.78)}
      direction={direction}
      distance={distance}
      threshold={viewport?.amount ?? defaultViewport.amount}
      rootMargin={viewport?.margin ?? defaultViewport.margin}
      once={viewport?.once ?? defaultViewport.once}
      {...props}
    >
      {children}
    </FadeReveal>
  )
}

export default FadeIn
