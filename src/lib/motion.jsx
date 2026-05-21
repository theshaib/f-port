import { createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { useStableLayout } from '../hooks/useStableLayout.js'

const DEFAULT_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const MOTION_DURATION_MULTIPLIER = 1
const MOTION_DELAY_MULTIPLIER = 1
const DEFAULT_VIEWPORT = { once: true, amount: 0.08, rootMargin: '0px 0px -10% 0px' }
const MotionVariantContext = createContext(null)

const assignRef = (ref, value) => {
  if (!ref) return
  if (typeof ref === 'function') {
    ref(value)
    return
  }
  ref.current = value
}

const resolveVariantState = (value, variants) => {
  if (!value || value === false) return null
  if (typeof value === 'string') return variants?.[value] ?? null
  if (typeof value === 'object') return value
  return null
}

const resolveVariantLabel = (value) => (typeof value === 'string' ? value : null)

const buildTransform = (state = {}) => {
  const transforms = []
  const hasTranslate = state.x != null || state.y != null

  if (hasTranslate) {
    transforms.push(`translate3d(${state.x ?? 0}px, ${state.y ?? 0}px, 0)`)
  }

  if (state.scale != null) {
    transforms.push(`scale(${state.scale})`)
  }

  if (state.transform) {
    transforms.push(state.transform)
  }

  return transforms.length ? transforms.join(' ') : undefined
}

const toCssState = (state = {}) => {
  const { transition: _transition, x, y, scale, ...style } = state
  const transform = buildTransform({ x, y, scale, transform: style.transform })

  if (transform) {
    style.transform = transform
  }

  return style
}

const toCssEase = (ease) => {
  if (Array.isArray(ease)) {
    return `cubic-bezier(${ease.join(', ')})`
  }

  return typeof ease === 'string' ? ease : DEFAULT_EASE
}

const toCssTransition = (state = {}, stateTransition = {}, propTransition = {}) => {
  const merged = {
    ...propTransition,
    ...stateTransition,
  }

  const rawDuration = merged.duration ?? 0.4
  const rawDelay = merged.delay ?? 0
  const duration =
    rawDuration === 0 ? 0 : Math.max(0.5, Math.min(rawDuration * MOTION_DURATION_MULTIPLIER, 0.8))
  const delay = rawDelay === 0 ? 0 : Math.min(rawDelay * MOTION_DELAY_MULTIPLIER, 0.16)
  const easing = toCssEase(merged.ease)
  const cssState = toCssState(state)
  const properties = ['opacity']

  if (cssState.transform) {
    properties.push('transform')
  }

  return properties.map((property) => `${property} ${duration}s ${easing} ${delay}s`).join(', ')
}

const useInView = (enabled, viewport, nodeRef, setVisible) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isLayoutReady = useStableLayout()

  useEffect(() => {
    if (!enabled || !nodeRef.current) return undefined

    if (prefersReducedMotion) {
      const frameId = window.requestAnimationFrame(() => setVisible(true))
      return () => window.cancelAnimationFrame(frameId)
    }

    if (!isLayoutReady) return undefined

    const node = nodeRef.current
    const once = viewport?.once !== false
    const threshold = viewport?.amount ?? DEFAULT_VIEWPORT.amount
    const rootMargin = viewport?.rootMargin ?? viewport?.margin ?? DEFAULT_VIEWPORT.rootMargin

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return

        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(node)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [enabled, isLayoutReady, nodeRef, prefersReducedMotion, setVisible, viewport])
}

const createMotionComponent = (tag) =>
  forwardRef(function MotionComponent(props, ref) {
    const {
      variants,
      initial,
      animate,
      whileInView,
      viewport,
      transition,
      style,
      onAnimationComplete,
      ...rest
    } = props

    const localRef = useRef(null)
    const childCounterRef = useRef(0)
    const prefersReducedMotion = usePrefersReducedMotion()
    const isLayoutReady = useStableLayout()
    const parentContext = useContext(MotionVariantContext)
    const controlledBySelf = Boolean(whileInView || animate)
    const inheritsVariantState = !controlledBySelf && Boolean(variants) && Boolean(parentContext?.activeLabel || parentContext?.initialLabel)
    const parentVisible = parentContext?.isVisible ?? true
    const inheritedInitialLabel = inheritsVariantState ? parentContext?.initialLabel : null
    const inheritedActiveLabel = inheritsVariantState ? parentContext?.activeLabel : null
    const selfInitialLabel = resolveVariantLabel(initial)
    const selfActiveLabel = resolveVariantLabel(whileInView ?? animate)
    const initialDescriptor = initial ?? inheritedInitialLabel
    const activeDescriptor = whileInView ?? animate ?? inheritedActiveLabel
    const [visible, setVisible] = useState(() => prefersReducedMotion || !(controlledBySelf || inheritsVariantState))
    const [childOrder, setChildOrder] = useState(null)
    const initialState = useMemo(() => resolveVariantState(initialDescriptor, variants) ?? {}, [initialDescriptor, variants])
    const activeState = useMemo(() => resolveVariantState(activeDescriptor, variants) ?? {}, [activeDescriptor, variants])
    const inheritedDelay = useMemo(() => {
      if (!inheritsVariantState || !parentContext || childOrder == null) return 0

      return (parentContext.delayChildren ?? 0) + (parentContext.staggerChildren ?? 0) * childOrder
    }, [childOrder, inheritsVariantState, parentContext])
    const effectiveTransition = useMemo(() => {
      if (!inheritsVariantState || inheritedDelay === 0) return transition

      return {
        ...(transition ?? {}),
        delay: (transition?.delay ?? 0) + inheritedDelay,
      }
    }, [inheritedDelay, inheritsVariantState, transition])
    const setRefs = useCallback(
      (node) => {
        localRef.current = node
        assignRef(ref, node)
      },
      [ref],
    )

    useInView(controlledBySelf, controlledBySelf ? viewport ?? DEFAULT_VIEWPORT : viewport, localRef, setVisible)

    useEffect(() => {
      let frameId = 0

      if (!inheritsVariantState || !parentContext) {
        frameId = window.requestAnimationFrame(() => setChildOrder(null))
        return () => window.cancelAnimationFrame(frameId)
      }

      frameId = window.requestAnimationFrame(() => {
        setChildOrder((current) => {
          if (current != null) return current
          return parentContext.registerChild?.() ?? 0
        })
      })

      return () => window.cancelAnimationFrame(frameId)
    }, [inheritsVariantState, parentContext])

    useEffect(() => {
      let frameId = 0

      if (prefersReducedMotion) {
        frameId = window.requestAnimationFrame(() => setVisible(true))
        return () => window.cancelAnimationFrame(frameId)
      }

      if (inheritsVariantState) {
        frameId = window.requestAnimationFrame(() => setVisible(parentVisible))
        return () => window.cancelAnimationFrame(frameId)
      }

      if (controlledBySelf || !isLayoutReady) return undefined

      frameId = window.requestAnimationFrame(() => setVisible(true))
      return () => window.cancelAnimationFrame(frameId)
    }, [controlledBySelf, inheritsVariantState, isLayoutReady, parentVisible, prefersReducedMotion])

    useEffect(() => {
      if (!visible || !onAnimationComplete) return undefined

      const delay = (activeState.transition?.delay ?? effectiveTransition?.delay ?? 0) * 1000
      const duration = (activeState.transition?.duration ?? effectiveTransition?.duration ?? 0.46) * 1000
      const timeoutId = window.setTimeout(() => onAnimationComplete(), delay + duration)

      return () => window.clearTimeout(timeoutId)
    }, [
      activeState.transition?.delay,
      activeState.transition?.duration,
      effectiveTransition?.delay,
      effectiveTransition?.duration,
      onAnimationComplete,
      visible,
    ])

    const shouldApplyMotion = controlledBySelf || inheritsVariantState
    const motionStyle = shouldApplyMotion
      ? {
          ...style,
          ...(visible ? toCssState(activeState) : toCssState(initialState)),
          transition: toCssTransition(activeState, activeState.transition, effectiveTransition),
        }
      : style
    const registerChild = useCallback(() => {
      const index = childCounterRef.current
      childCounterRef.current += 1
      return index
    }, [])
    const providerValue = useMemo(
      () => ({
        initialLabel: selfInitialLabel ?? inheritedInitialLabel,
        activeLabel: selfActiveLabel ?? inheritedActiveLabel,
        isVisible: parentVisible && visible,
        staggerChildren: activeState.transition?.staggerChildren ?? 0,
        delayChildren: activeState.transition?.delayChildren ?? 0,
        registerChild,
      }),
      [
        activeState.transition?.delayChildren,
        activeState.transition?.staggerChildren,
        inheritedActiveLabel,
        inheritedInitialLabel,
        parentVisible,
        registerChild,
        selfActiveLabel,
        selfInitialLabel,
        visible,
      ],
    )

    const Element = tag

    return (
      <MotionVariantContext.Provider value={providerValue}>
        <Element {...rest} ref={setRefs} style={motionStyle} />
      </MotionVariantContext.Provider>
    )
  })

export const motion = new Proxy(
  {},
  {
    get: (cache, tag) => {
      if (!cache[tag]) {
        cache[tag] = createMotionComponent(tag)
      }

      return cache[tag]
    },
  },
)
