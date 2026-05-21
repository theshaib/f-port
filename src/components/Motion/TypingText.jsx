import { memo, useEffect, useMemo, useRef, useState } from 'react'

import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import './TypingText.css'

function TypingText({
  phrases = [],
  className = '',
  speed = 34,
  startDelay = 160,
  loop = false,
  cursor = true,
  as = 'span',
}) {
  const Component = as
  const ref = useRef(null)
  const normalizedPhrases = useMemo(() => phrases.filter(Boolean), [phrases])
  const prefersReducedMotion = usePrefersReducedMotion()
  const [inView, setInView] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [letterIndex, setLetterIndex] = useState(0)
  const currentPhrase = normalizedPhrases[phraseIndex] ?? ''

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      const frameId = window.requestAnimationFrame(() => setInView(true))
      return () => window.cancelAnimationFrame(frameId)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setInView(true)
        if (!loop) observer.disconnect()
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [loop])

  useEffect(() => {
    if (!normalizedPhrases.length) return undefined

    if (prefersReducedMotion || !inView) return undefined

    if (letterIndex < currentPhrase.length) {
      const timeoutId = window.setTimeout(
        () => setLetterIndex((current) => current + 1),
        letterIndex === 0 ? startDelay : speed,
      )
      return () => window.clearTimeout(timeoutId)
    }

    if (!loop || normalizedPhrases.length === 1) return undefined

    const timeoutId = window.setTimeout(() => {
      setPhraseIndex((current) => (current + 1) % normalizedPhrases.length)
      setLetterIndex(0)
    }, 1400)

    return () => window.clearTimeout(timeoutId)
  }, [
    currentPhrase,
    inView,
    letterIndex,
    loop,
    normalizedPhrases.length,
    prefersReducedMotion,
    speed,
    startDelay,
  ])

  const visibleText = currentPhrase.slice(0, prefersReducedMotion ? currentPhrase.length : letterIndex)

  return (
    <Component ref={ref} className={`typing-text ${className}`.trim()}>
      <span>{visibleText}</span>
      {cursor ? <span className="typing-text__cursor" aria-hidden="true" /> : null}
    </Component>
  )
}

export default memo(TypingText)
