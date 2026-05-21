import { Suspense, lazy, useEffect, useLayoutEffect, useState } from 'react'
import { Outlet, useLocation, useNavigation } from 'react-router-dom'
import Footer from './components/Footer/Footer.jsx'
import Header from './components/Header/Header.jsx'
import AppErrorBoundary from './components/ErrorBoundary/AppErrorBoundary.jsx'

import RouteLoader from './components/RouteLoader/RouteLoader.jsx'
import { PortfolioProvider } from './context/PortfolioContext.jsx'
import { useGlobalScrollReveal } from './hooks/useGlobalScrollReveal.js'
import { useIdleMount } from './hooks/useIdleMount.js'
import { useLenisSmoothScroll } from './hooks/useLenisSmoothScroll.js'
import { usePortfolio } from './hooks/usePortfolio.js'
import { useTheme } from './hooks/useTheme.js'
import { ScrollTrigger } from './utils/animationConfig.js'

const ChatBot = lazy(() => import('./components/ChatBot/ChatBot.jsx'))

const INTRO_ACTIVE_MS = 3000
const INTRO_EXIT_MS = 420
function isDesktopPointerDevice() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)').matches
}

function getScrollBehavior() {
  if (typeof window === 'undefined') {
    return 'auto'
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

function scrollToPageTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

export default function App() {
  const portfolioState = usePortfolio()
  const { contactInfo } = portfolioState
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigation = useNavigation()
  const isChatBotReady = useIdleMount()
  const [introPhase, setIntroPhase] = useState('active')
  const [showIntro, setShowIntro] = useState(false)
  const [isDesktopPointer, setIsDesktopPointer] = useState(isDesktopPointerDevice)
  const [cursorVisible, setCursorVisible] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  useLenisSmoothScroll({
    enabled: !showIntro,
  })

  useGlobalScrollReveal({
    enabled: !showIntro,
    pageKey: location.pathname,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)')
    const handleMedia = (event) => {
      setIsDesktopPointer(event.matches)
      if (!event.matches) {
        setCursorVisible(false)
      }
    }

    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', handleMedia)
      return () => mediaQuery.removeEventListener('change', handleMedia)
    }

    mediaQuery.addListener(handleMedia)
    return () => mediaQuery.removeListener(handleMedia)
  }, [])

  useEffect(() => {
    if (!isDesktopPointer) return undefined

    const handleMove = (event) => {
      setCursorVisible(true)
      setCursorPosition({ x: event.clientX, y: event.clientY })
    }
    const handleLeave = () => setCursorVisible(false)

    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerdown', handleMove, { passive: true })
    window.addEventListener('pointerleave', handleLeave)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerdown', handleMove)
      window.removeEventListener('pointerleave', handleLeave)
    }
  }, [isDesktopPointer])

  useLayoutEffect(() => {
    const targetId = location.hash.replace('#', '')

    if (targetId) {
      const node = document.getElementById(targetId)
      if (node) {
        node.scrollIntoView({ behavior: getScrollBehavior(), block: 'start' })
        window.requestAnimationFrame(() => ScrollTrigger.refresh())
        return
      }
    }

    scrollToPageTop()
    window.requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [location.hash, location.key, location.pathname])

  useEffect(() => {
    const activateExitTimer = window.setTimeout(() => {
      setIntroPhase('exit')
    }, INTRO_ACTIVE_MS)

    const unmountTimer = window.setTimeout(() => {
      setShowIntro(false)
    }, INTRO_ACTIVE_MS + INTRO_EXIT_MS)

    return () => {
      window.clearTimeout(activateExitTimer)
      window.clearTimeout(unmountTimer)
    }
  }, [])

  const isBusy = navigation.state !== 'idle'
  const shellStateClass = showIntro ? (introPhase === 'active' ? 'app-shell--active' : 'app-shell--exit') : 'app-shell--done'

  return (
    <AppErrorBoundary>
      <PortfolioProvider value={portfolioState}>
        <div className="app">
          {showIntro ? <IntroSplash phase={introPhase} variant="initial" /> : null}

          <div className="app-background" aria-hidden="true">
            <span className="app-bg-mesh" />
            <span className="app-bg-wave" />
            <span className="app-bg-particles" />
            <span className="app-bg-beams" />
          </div>

          {isDesktopPointer ? (
            <div
              className={`creative-cursor ${cursorVisible ? 'is-visible' : ''}`}
              style={{ transform: `translate3d(${cursorPosition.x}px, ${cursorPosition.y}px, 0)` }}
              aria-hidden="true"
            >
              <span className="creative-cursor-core" />
              <span className="creative-cursor-ring" />
            </div>
          ) : null}

          <div className={`app-shell ${shellStateClass}`}>
            <Header contactInfo={contactInfo} theme={theme} onToggleTheme={toggleTheme} />

            <main className="main container">
              <RouteLoader active={isBusy} mode="inline" />
              <div key={`${location.pathname}-${showIntro ? 'intro' : 'ready'}`} className="page-shell">
                {showIntro ? null : <Outlet />}
              </div>
            </main>

            <Footer contactInfo={contactInfo} />

            {isChatBotReady ? (
              <Suspense fallback={null}>
                <ChatBot />
              </Suspense>
            ) : null}
          </div>

        </div>
      </PortfolioProvider>
    </AppErrorBoundary>
  )
}
