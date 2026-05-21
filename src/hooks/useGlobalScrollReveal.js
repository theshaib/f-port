import { useEffect } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'

const BLOCK_SELECTOR = [
  '.app-shell .page-shell [data-reveal]',
  '.app-shell .page-shell form',
  '.app-shell .page-shell .glass',
  '.app-shell .page-shell [class*="card"]',
  '.app-shell .page-shell [class*="panel"]',
  '.app-shell .page-shell [class*="list-item"]',
  '.app-shell .page-shell .projects-header',
  '.app-shell .page-shell .home-stack',
  '.app-shell .page-shell .about-story',
  '.app-shell .page-shell .contact-socials',
  '.app-shell .page-shell .project-grid-simple',
  '.app-shell .page-shell .certifications-grid',
].join(', ')

const MAX_STAGGER_INDEX = 12

const shouldSkip = (node) => {
  if (!(node instanceof HTMLElement)) return true
  if (
    node.matches(
      [
        '[aria-hidden="true"]',
        '.sr-only',
        '.split-text',
        '.split-parent',
        '.creative-cursor',
        '.route-loader-shell',
        '.stack-chip',
        '.button',
        'a',
        'button',
        'img',
        'picture',
        'svg',
        'canvas',
        'video',
        'i',
        'span',
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'input',
        'textarea',
        'select',
        'label',
      ].join(', '),
    )
  ) {
    return true
  }

  if (node.closest('[data-no-scroll-reveal], .split-text, .split-parent, .route-loader-shell, .site-header, .site-footer, .chatbot')) {
    return true
  }

  if (
    node.closest('[data-scroll-reveal]') &&
    !node.matches('[data-reveal], form, [class*="card"], [class*="panel"], [class*="list-item"], .projects-header, .home-stack, .about-story, .contact-socials')
  ) {
    return true
  }

  return false
}

export function useGlobalScrollReveal({ enabled = true, pageKey = '' } = {}) {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return undefined

    const root = document.querySelector('.app-shell')
    if (!root) return undefined

    let orderIndex = 0
    const tracked = new WeakSet()
    const observed = new Set()
    const observer = prefersReducedMotion
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return
              entry.target.classList.add('is-visible')
              observer?.unobserve(entry.target)
              observed.delete(entry.target)
            })
          },
          { threshold: 0.08, rootMargin: '0px 0px -5% 0px' },
        )

    const registerTarget = (node) => {
      if (!(node instanceof HTMLElement) || shouldSkip(node) || tracked.has(node)) return

      tracked.add(node)
      node.setAttribute('data-scroll-reveal', '')
      node.style.setProperty('--scroll-reveal-order', `${Math.min(orderIndex, MAX_STAGGER_INDEX)}`)
      orderIndex += 1

      if (prefersReducedMotion) {
        node.classList.add('is-visible')
        return
      }

      observer?.observe(node)
      observed.add(node)
    }

    const scanTargets = (container = root) => {
      if (!(container instanceof HTMLElement)) return

      if (container.matches(BLOCK_SELECTOR)) {
        registerTarget(container)
      }

      container.querySelectorAll(BLOCK_SELECTOR).forEach(registerTarget)
    }

    scanTargets(root)

    if (!prefersReducedMotion) {
      window.requestAnimationFrame(() => {
        Array.from(observed).forEach((node) => {
          if (!(node instanceof HTMLElement)) return

          const bounds = node.getBoundingClientRect()
          if (bounds.top <= window.innerHeight * 0.9) {
            node.classList.add('is-visible')
            observer?.unobserve(node)
            observed.delete(node)
          }
        })
      })
    }

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((addedNode) => {
          if (!(addedNode instanceof HTMLElement)) return
          scanTargets(addedNode)
        })
      })
    })

    mutationObserver.observe(root, { childList: true, subtree: true })

    return () => {
      mutationObserver.disconnect()
      observer?.disconnect()
    }
  }, [enabled, pageKey, prefersReducedMotion])
}
