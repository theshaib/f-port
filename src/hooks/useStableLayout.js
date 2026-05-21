import { useEffect, useRef, useState } from 'react'

export function useStableLayout() {
  const [isReady, setIsReady] = useState(() => typeof window === 'undefined')
  const settledRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    let cancelled = false
    let firstFrameId = 0
    let secondFrameId = 0

    async function waitForFonts() {
      try {
        if (document.fonts?.ready) {
          await document.fonts.ready
        }
      } catch {
        // Continue even if the Font Loading API is unavailable.
      }
    }

    async function settleLayout() {
      if (settledRef.current) {
        return
      }

      await waitForFonts()

      firstFrameId = window.requestAnimationFrame(() => {
        secondFrameId = window.requestAnimationFrame(() => {
          if (!cancelled) {
            settledRef.current = true
            setIsReady(true)
          }
        })
      })
    }

    void settleLayout()

    return () => {
      cancelled = true
      window.cancelAnimationFrame(firstFrameId)
      window.cancelAnimationFrame(secondFrameId)
    }
  }, [])

  return isReady
}
