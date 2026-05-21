import { useEffect, useState } from 'react'

export function useIdleMount(delay = 120, timeout = 320) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let timeoutId
    let idleId

    const activate = () => setIsReady(true)

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(activate, { timeout })
    } else {
      timeoutId = window.setTimeout(activate, delay)
    }

    return () => {
      if (typeof window !== 'undefined' && idleId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [delay, timeout])

  return isReady
}
