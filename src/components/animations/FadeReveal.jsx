import { memo, useMemo, useRef } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import {
  fadeRevealDefaults,
  getDirectionalOffset,
  getScrollStart,
  ScrollTrigger,
  gsap,
  registerAnimationPlugins,
  useGSAP,
} from '../../utils/animationConfig.js'

registerAnimationPlugins()

const isElementInInitialViewport = (element) => {
  if (typeof window === 'undefined') return false

  const bounds = element.getBoundingClientRect()
  return bounds.top < window.innerHeight * 0.98 && bounds.bottom > 0
}

function FadeReveal({
  as,
  tag,
  children,
  className = '',
  delay = fadeRevealDefaults.delay,
  duration = fadeRevealDefaults.duration,
  ease = fadeRevealDefaults.ease,
  direction = fadeRevealDefaults.direction,
  distance = fadeRevealDefaults.distance,
  threshold = fadeRevealDefaults.threshold,
  rootMargin = fadeRevealDefaults.rootMargin,
  once = true,
  style,
  ...rest
}) {
  const ref = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const Tag = tag || as || 'div'
  const fromVars = useMemo(
    () => ({
      opacity: 0,
      ...getDirectionalOffset(direction, distance),
    }),
    [direction, distance],
  )

  useGSAP(
    () => {
      const element = ref.current
      if (!element) return undefined

      if (prefersReducedMotion) {
        gsap.set(element, { opacity: 1, clearProps: 'transform' })
        return undefined
      }

      const toVars = {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease,
          force3D: true,
      }

      const tween = gsap.fromTo(
        element,
        fromVars,
        isElementInInitialViewport(element)
          ? toVars
          : {
              ...toVars,
              scrollTrigger: {
                trigger: element,
                start: getScrollStart(threshold, rootMargin),
                once,
                fastScrollEnd: true,
              },
            },
      )

      const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh())

      return () => {
        window.cancelAnimationFrame(refreshId)
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    },
    {
      dependencies: [delay, duration, ease, direction, distance, threshold, rootMargin, once, prefersReducedMotion],
      scope: ref,
    },
  )

  return (
    <Tag ref={ref} className={className} style={style} {...rest}>
      {children}
    </Tag>
  )
}

export default memo(FadeReveal)
