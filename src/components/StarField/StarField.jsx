import { memo, useEffect, useRef } from 'react'
import './StarField.css'

function StarField() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let resizeTimer

    const buildStars = () => {
      const starCount = Math.min(
        Math.max(Math.floor(window.innerWidth * window.innerHeight / 10500), 72),
        170
      )

      container.innerHTML = ''

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div')
        star.className = 'starfield__star'

        const size = Math.random() * 2.9 + 0.85
        const opacity = Math.random() * 0.62 + 0.28
        const duration = Math.random() * 14 + 12
        const delay = Math.random() * 7
        const animationType = Math.floor(Math.random() * 5)
        const lineLength = Math.random() * 44 + 22

        star.style.setProperty('--star-size', `${size}px`)
        star.style.setProperty('--star-opacity', opacity)
        star.style.setProperty('--star-duration', `${duration}s`)
        star.style.setProperty('--star-delay', `${delay}s`)
        star.style.setProperty('--rotation-angle', `${Math.random() * 360}deg`)
        star.style.setProperty('--offset-x', `${Math.random() * 80 - 40}px`)
        star.style.setProperty('--offset-y', `${Math.random() * 80 - 40}px`)
        star.style.setProperty('--travel-y', `${Math.random() * 120 + 130}px`)
        star.style.setProperty('--line-length', `${lineLength}px`)
        star.style.setProperty('--line-angle', `${Math.random() * 140 - 70}deg`)

        star.style.left = `${Math.random() * 100}%`
        star.style.top = `${Math.random() * 100}%`

        star.classList.add(`starfield__star--anim-${animationType}`)

        if (Math.random() > 0.48) {
          star.classList.add('starfield__star--linked')
        }

        if (Math.random() > 0.62) {
          star.classList.add('starfield__star--intense')
        }

        container.appendChild(star)
      }
    }

    buildStars()

    const handleResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(buildStars, 180)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <div className="starfield" ref={containerRef} aria-hidden="true" />
}

export default memo(StarField)
