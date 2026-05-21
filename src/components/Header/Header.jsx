import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from '../../lib/motion.jsx'
import { fadeInDown, fadeInUp, staggerReveal } from '../Animation/Animation.jsx'
import { APP_ROUTES } from '../../lib/app-config.js'
import { useHeaderScrollState } from '../../hooks/useHeaderScrollState.js'
import './Header.css'

const HEADER_MENU_ID = 'header-quick-menu'

const headerReveal = {
  hidden: { opacity: 0, y: -28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.82,
      delay: 0.04,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

function Header({ contactInfo, theme = 'light', onToggleTheme }) {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const { isScrolled } = useHeaderScrollState(12)

  const cards = useMemo(
    () => [
      {
        label: 'Explore',
        tone: 'tone-home',
        links: [
          { label: 'Blog', type: 'internal', path: APP_ROUTES.blog },
          { label: 'Contact', type: 'internal', path: APP_ROUTES.contact },
        ],
      },
      {
        label: 'Work',
        tone: 'tone-projects',
        links: [
          { label: 'AI builds', type: 'internal', path: APP_ROUTES.aiProject },
          { label: 'Web products', type: 'internal', path: APP_ROUTES.webProject },
          { label: 'Certifications', type: 'internal', path: APP_ROUTES.certifications },
        ],
      },
      {
        label: 'Connect',
        tone: 'tone-contact',
        links: [
          { label: 'GitHub', type: 'external', href: contactInfo?.github ?? '#' },
          { label: 'Email', type: 'external', href: `mailto:${contactInfo?.email ?? ''}` },
          { label: 'LinkedIn', type: 'external', href: contactInfo?.linkedin ?? '#' },
        ],
      },
    ],
    [contactInfo],
  )

  const closeMenu = useCallback(({ restoreFocus = false } = {}) => {
    setIsOpen(false)

    if (restoreFocus) {
      window.requestAnimationFrame(() => {
        menuButtonRef.current?.focus()
      })
    }
  }, [])

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsOpen(false)
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [location.hash, location.pathname])

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      closeMenu({ restoreFocus: true })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeMenu, isOpen])

  return (
    <motion.header
      className={clsx('site-header', {
        'is-open': isOpen,
        'is-scrolled': isScrolled,
      })}
      variants={headerReveal}
      initial="hidden"
      animate="show"
    >
      <div className="container header-shell">
        <div
          className={clsx('header-card-nav', 'animated-border', {
            'is-open': isOpen,
            'is-scrolled': isScrolled,
          })}
        >
          <motion.div className="header-card-top" variants={staggerReveal(0.1, 0.04)} initial="hidden" animate="show">
            <Link className="header-brand" aria-label="theShaib home" to={APP_ROUTES.home} onClick={() => closeMenu()}>
              <motion.span className="header-brand-wordmark" variants={fadeInDown(0.08, 0.62)}>
                THESHAIB
              </motion.span>
            </Link>

            <motion.div className="header-actions" variants={fadeInUp(0.12, 0.64)}>
              <button
                type="button"
                className="header-theme-toggle"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={onToggleTheme}
              >
                <i className={theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars-fill'} aria-hidden="true" />
              </button>

              <button
                type="button"
                className={`header-hamburger ${isOpen ? 'is-open' : ''}`}
                ref={menuButtonRef}
                aria-controls={HEADER_MENU_ID}
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
                onClick={() => setIsOpen((current) => !current)}
              >
                <span className="header-hamburger-line" />
                <span className="header-hamburger-line" />
              </button>
            </motion.div>
          </motion.div>

          <div className="header-card-expand" id={HEADER_MENU_ID} inert={!isOpen}>
            <motion.div
              className="header-card-content"
              initial={false}
              animate={isOpen ? 'show' : 'hidden'}
              variants={{
                hidden: { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
                show: { transition: { delayChildren: 0.12, staggerChildren: 0.14 } },
              }}
            >
              {cards.map((card) => (
                <motion.div key={card.label} className={`header-menu-card animated-border ${card.tone}`} variants={fadeInUp(0, 0.7)}>
                  <div className="header-menu-card-label">{card.label}</div>
                  <div className="header-menu-links">
                    {card.links.map((link) =>
                      link.type === 'internal' ? (
                        <NavLink
                          key={link.label}
                          to={link.path}
                          end={link.end}
                          className={({ isActive }) => `header-menu-link ${isActive ? 'is-active' : ''}`.trim()}
                          onClick={() => closeMenu({ restoreFocus: true })}
                        >
                          <i className="bi bi-arrow-up-right header-menu-link-arrow" aria-hidden="true" />
                          {link.label}
                        </NavLink>
                      ) : (
                        <a
                          key={link.label}
                          className="header-menu-link"
                          href={link.href}
                          target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                          rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                          onClick={() => closeMenu({ restoreFocus: true })}
                        >
                          <i className="bi bi-arrow-up-right header-menu-link-arrow" aria-hidden="true" />
                          {link.label}
                        </a>
                      ),
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default memo(Header)
