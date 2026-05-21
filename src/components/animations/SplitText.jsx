import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import {
  GSAPSplitText,
  ScrollTrigger,
  getScrollStart,
  gsap,
  registerAnimationPlugins,
  splitTextDefaults,
  useGSAP,
} from '../../utils/animationConfig.js'
import './SplitText.css'

registerAnimationPlugins()

const normalizeSplitType = (value = splitTextDefaults.splitType) => {
  if (value.includes('lines')) return 'lines'
  if (value.includes('words')) return 'words'
  return 'chars'
}

const pickTargets = (split, splitType) => {
  if (splitType === 'chars' && split.chars?.length) return split.chars
  if (splitType === 'words' && split.words?.length) return split.words
  if (splitType === 'lines' && split.lines?.length) return split.lines
  return split.chars?.length ? split.chars : split.words?.length ? split.words : split.lines
}

const isElementInInitialViewport = (element) => {
  if (typeof window === 'undefined') return false

  const bounds = element.getBoundingClientRect()
  return bounds.top < window.innerHeight * 0.98 && bounds.bottom > 0
}

function SplitText({
  text,
  children,
  as,
  tag,
  className = '',
  delay = splitTextDefaults.delay,
  duration,
  stepDuration,
  ease = splitTextDefaults.ease,
  splitType,
  animateBy,
  direction = 'bottom',
  from,
  to = { opacity: 1, y: 0, filter: 'blur(0px)' },
  threshold = splitTextDefaults.threshold,
  rootMargin = splitTextDefaults.rootMargin,
  textAlign = 'inherit',
  once = true,
  onLetterAnimationComplete,
  onAnimationComplete,
  style,
  ...rest
}) {
  const ref = useRef(null)
  const completedRef = useRef(false)
  const callbackRef = useRef(onLetterAnimationComplete || onAnimationComplete)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [fontsLoaded, setFontsLoaded] = useState(() => {
    if (typeof document === 'undefined' || !document.fonts) return true
    return document.fonts.status === 'loaded'
  })
  const Tag = tag || as || 'p'
  const resolvedSplitType = normalizeSplitType(splitType || animateBy)
  const rawDuration = duration ?? stepDuration
  const minDuration = resolvedSplitType === 'chars' ? 0.92 : 0.72
  const resolvedDuration = rawDuration == null ? splitTextDefaults.duration : Math.max(rawDuration, minDuration)
  const resolvedFrom = useMemo(
    () =>
      from || {
        opacity: 0,
        y: direction === 'from-top' ? -34 : 38,
        filter: 'blur(8px)',
      },
    [direction, from],
  )

  useEffect(() => {
    callbackRef.current = onLetterAnimationComplete || onAnimationComplete
  }, [onAnimationComplete, onLetterAnimationComplete])

  useEffect(() => {
    if (fontsLoaded || typeof document === 'undefined' || !document.fonts) return undefined

    let cancelled = false
    document.fonts.ready.then(() => {
      if (!cancelled) setFontsLoaded(true)
    })

    return () => {
      cancelled = true
    }
  }, [fontsLoaded])

  useGSAP(
    () => {
      const element = ref.current
      if (!element || (!text && !children) || !fontsLoaded) return undefined

      if (prefersReducedMotion) {
        gsap.set(element, { opacity: 1, clearProps: 'transform,filter' })
        return undefined
      }

      if (completedRef.current && once) return undefined

      const split = new GSAPSplitText(element, {
        type: resolvedSplitType,
        tag: 'span',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        reduceWhiteSpace: false,
        smartWrap: true,
        autoSplit: resolvedSplitType === 'lines',
      })
      const targets = pickTargets(split, resolvedSplitType)

      if (!targets?.length) {
        return () => split.revert()
      }

      gsap.set(targets, { ...resolvedFrom, willChange: 'transform, opacity, filter' })

      const tweenConfig = {
        ...to,
        duration: resolvedDuration,
        ease,
        stagger: delay / 1000,
        force3D: true,
        clearProps: 'willChange',
        onComplete: () => {
          completedRef.current = true
          callbackRef.current?.()
        },
      }

      const tween = gsap.to(
        targets,
        isElementInInitialViewport(element)
          ? tweenConfig
          : {
              ...tweenConfig,
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
        tween.kill()
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === element) trigger.kill()
        })
        split.revert()
      }
    },
    {
      dependencies: [
        text,
        children,
        delay,
        resolvedDuration,
        ease,
        resolvedSplitType,
        JSON.stringify(resolvedFrom),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
        once,
        prefersReducedMotion,
      ],
      scope: ref,
    },
  )

  return (
    <Tag ref={ref} className={`split-text split-parent ${className}`.trim()} style={{ textAlign, ...style }} {...rest}>
      {children ?? text}
    </Tag>
  )
}

export default memo(SplitText)
