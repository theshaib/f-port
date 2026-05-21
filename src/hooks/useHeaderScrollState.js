import { useEffect, useState } from 'react'

const resolveScrollY = () => {
  if (typeof window === 'undefined') return 0
  return window.scrollY || document.documentElement.scrollTop || 0
}

export function useHeaderScrollState(offset = 12) {
  const [isScrolled, setIsScrolled] = useState(() => resolveScrollY() > offset)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    let frameId = 0

    const sync = () => {
      frameId = 0
      setIsScrolled(resolveScrollY() > offset)
    }

    const onScroll = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(sync)
    }

    sync()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [offset])

  return { isScrolled }
}

