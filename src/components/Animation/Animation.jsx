import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import { useStableLayout } from '../../hooks/useStableLayout.js'
import { INTERSECTION_DEFAULTS, MOTION_DURATION, MOTION_EASE, VIEWPORT_REVEAL } from '../../lib/animation/presets.js'

export const motionEase = MOTION_EASE

export const fadeInUp = (delay = 0, duration = MOTION_DURATION.base) => ({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration, delay, ease: motionEase } },
})

export const fadeInDown = (delay = 0, duration = MOTION_DURATION.base) => ({
  hidden: { opacity: 0, y: -24 },
  show: { opacity: 1, y: 0, transition: { duration, delay, ease: motionEase } },
})

export const fadeInScale = (delay = 0, duration = MOTION_DURATION.slow) => ({
  hidden: { opacity: 0, scale: 0.985, y: 24 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration, delay, ease: motionEase } },
})

export const staggerReveal = (stagger = 0.06, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
})

export const revealViewport = VIEWPORT_REVEAL

export const useScrollReveal = (options = {}) => {
  const containerRef = useRef(null)
  const threshold = options.threshold ?? INTERSECTION_DEFAULTS.threshold
  const rootMargin = options.rootMargin ?? INTERSECTION_DEFAULTS.rootMargin
  const prefersReducedMotion = usePrefersReducedMotion()
  const isLayoutReady = useStableLayout()

  useEffect(() => {
    const root = containerRef.current
    if (!root) return undefined

    const nodes = Array.from(root.querySelectorAll('[data-reveal]'))

    if (prefersReducedMotion) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return undefined
    }

    if (!isLayoutReady) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin },
    )

    nodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [isLayoutReady, prefersReducedMotion, rootMargin, threshold])

  return containerRef
}
