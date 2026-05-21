import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText as GSAPSplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

let pluginsRegistered = false

export function registerAnimationPlugins() {
  if (pluginsRegistered) return

  gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP)
  pluginsRegistered = true
}

export const animationEase = 'power3.out'

export const splitTextDefaults = {
  delay: 48,
  duration: 1.22,
  ease: animationEase,
  splitType: 'chars',
  threshold: 0.12,
  rootMargin: '-80px',
}

export const fadeRevealDefaults = {
  delay: 0,
  duration: 0.76,
  ease: animationEase,
  direction: 'up',
  distance: 24,
  threshold: 0.12,
  rootMargin: '-80px',
}

export function getDirectionalOffset(direction = 'up', distance = fadeRevealDefaults.distance) {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y'
  const sign = direction === 'left' || direction === 'up' ? 1 : -1

  return { [axis]: distance * sign }
}

export function getScrollStart(threshold = splitTextDefaults.threshold, rootMargin = splitTextDefaults.rootMargin) {
  const startPct = (1 - threshold) * 100
  const match = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin)
  const value = match ? Number.parseFloat(match[1]) : 0
  const unit = match?.[2] || 'px'
  const offset = value === 0 ? '' : value < 0 ? `-=${Math.abs(value)}${unit}` : `+=${value}${unit}`

  return `top ${startPct}%${offset}`
}

export { gsap, ScrollTrigger, GSAPSplitText, useGSAP }
