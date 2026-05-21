import { useEffect } from 'react'
import Lenis from 'lenis'

import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'

export function useLenisSmoothScroll({ enabled = true } = {}) {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!enabled || prefersReducedMotion || typeof window === 'undefined') {
      return undefined
    }

    const lenis = new Lenis({
      duration: 1.04,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    })

    let frameId = 0
    const raf = (time) => {
      lenis.raf(time)
      frameId = window.requestAnimationFrame(raf)
    }

    frameId = window.requestAnimationFrame(raf)

    return () => {
      window.cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [enabled, prefersReducedMotion])
}
