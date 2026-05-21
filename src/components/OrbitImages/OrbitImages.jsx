// Component created by Dominik Koch
// https://x.com/dominikkoch

import { memo, useEffect, useMemo, useRef, useState } from 'react'
import './OrbitImages.css'

function generateEllipsePath(cx, cy, rx, ry) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`
}

function generateCirclePath(cx, cy, r) {
  return generateEllipsePath(cx, cy, r, r)
}

function generateSquarePath(cx, cy, size) {
  const h = size / 2
  return `M ${cx - h} ${cy - h} L ${cx + h} ${cy - h} L ${cx + h} ${cy + h} L ${cx - h} ${cy + h} Z`
}

function generateRectanglePath(cx, cy, w, h) {
  const hw = w / 2
  const hh = h / 2
  return `M ${cx - hw} ${cy - hh} L ${cx + hw} ${cy - hh} L ${cx + hw} ${cy + hh} L ${cx - hw} ${cy + hh} Z`
}

function generateTrianglePath(cx, cy, size) {
  const height = (size * Math.sqrt(3)) / 2
  const hs = size / 2
  return `M ${cx} ${cy - height / 1.5} L ${cx + hs} ${cy + height / 3} L ${cx - hs} ${cy + height / 3} Z`
}

function generateStarPath(cx, cy, outerR, innerR, points) {
  const step = Math.PI / points
  let path = ''
  for (let i = 0; i < 2 * points; i += 1) {
    const r = i % 2 === 0 ? outerR : innerR
    const angle = i * step - Math.PI / 2
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  return `${path} Z`
}

function generateHeartPath(cx, cy, size) {
  const s = size / 30
  return `M ${cx} ${cy + 12 * s} C ${cx - 20 * s} ${cy - 5 * s}, ${cx - 12 * s} ${cy - 18 * s}, ${cx} ${cy - 8 * s} C ${cx + 12 * s} ${cy - 18 * s}, ${cx + 20 * s} ${cy - 5 * s}, ${cx} ${cy + 12 * s}`
}

function generateInfinityPath(cx, cy, w, h) {
  const hw = w / 2
  const hh = h / 2
  return `M ${cx} ${cy} C ${cx + hw * 0.5} ${cy - hh}, ${cx + hw} ${cy - hh}, ${cx + hw} ${cy} C ${cx + hw} ${cy + hh}, ${cx + hw * 0.5} ${cy + hh}, ${cx} ${cy} C ${cx - hw * 0.5} ${cy + hh}, ${cx - hw} ${cy + hh}, ${cx - hw} ${cy} C ${cx - hw} ${cy - hh}, ${cx - hw * 0.5} ${cy - hh}, ${cx} ${cy}`
}

function generateWavePath(cx, cy, w, amplitude, waves) {
  const pts = []
  const segs = waves * 20
  const hw = w / 2
  for (let i = 0; i <= segs; i += 1) {
    const x = cx - hw + (w * i) / segs
    const y = cy + Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude
    pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)
  }
  for (let i = segs; i >= 0; i -= 1) {
    const x = cx - hw + (w * i) / segs
    const y = cy - Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude
    pts.push(`L ${x} ${y}`)
  }
  return `${pts.join(' ')} Z`
}

const OrbitItem = memo(function OrbitItem({
  item,
  label,
  index,
  totalItems,
  path,
  itemSize,
  rotation,
  duration,
  direction,
  easing,
  fill,
  paused,
  active,
  onActivate,
  onDeactivate,
}) {
  const delay = fill ? -(duration * (index / totalItems)) : 0
  return (
    <div
      className={`orbit-item ${active ? 'is-active' : ''}`}
      style={{
        width: itemSize,
        height: itemSize,
        offsetPath: `path("${path}")`,
        offsetRotate: '0deg',
        offsetAnchor: 'center center',
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationDirection: direction === 'reverse' ? 'reverse' : 'normal',
        animationTimingFunction: easing,
        animationPlayState: paused ? 'paused' : 'running',
      }}
      onMouseEnter={() => onActivate(index)}
      onMouseLeave={onDeactivate}
      onFocus={() => onActivate(index)}
      onBlur={onDeactivate}
    >
      <div className="orbit-item-inner" style={{ transform: `rotate(${-rotation}deg)` }} tabIndex={label ? 0 : -1}>
        {item}
        {label ? <span className="orbit-item-label">{label}</span> : null}
      </div>
    </div>
  )
})

function OrbitImages({
  images = [],
  altPrefix = 'Orbiting image',
  shape = 'ellipse',
  customPath,
  baseWidth = 1200,
  radiusX = 600,
  radiusY = 160,
  radius = 260,
  starPoints = 5,
  starInnerRatio = 0.5,
  rotation = -8,
  duration = 36,
  itemSize = 64,
  direction = 'normal',
  fill = true,
  width = 100,
  height = 100,
  className = '',
  showPath = false,
  pathColor = 'rgba(0,0,0,0.1)',
  pathWidth = 2,
  easing = 'linear',
  paused = false,
  centerContent,
  responsive = false,
  mobileBreakpoint = 640,
  mobileBaseWidth,
  mobileRadiusX,
  mobileRadiusY,
  mobileRadius,
  mobileDuration,
  mobileItemSize,
}) {
  const containerRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)

  const activeBaseWidth = isMobile && mobileBaseWidth ? mobileBaseWidth : baseWidth
  const activeRadiusX = isMobile && mobileRadiusX ? mobileRadiusX : radiusX
  const activeRadiusY = isMobile && mobileRadiusY ? mobileRadiusY : radiusY
  const activeRadius = isMobile && mobileRadius ? mobileRadius : radius
  const activeDuration = isMobile && mobileDuration ? mobileDuration : duration
  const activeItemSize = isMobile && mobileItemSize ? mobileItemSize : itemSize

  const designCenterX = activeBaseWidth / 2
  const designCenterY = activeBaseWidth / 2

  const path = useMemo(() => {
    switch (shape) {
      case 'circle':
        return generateCirclePath(designCenterX, designCenterY, activeRadius)
      case 'ellipse':
        return generateEllipsePath(designCenterX, designCenterY, activeRadiusX, activeRadiusY)
      case 'square':
        return generateSquarePath(designCenterX, designCenterY, activeRadius * 2)
      case 'rectangle':
        return generateRectanglePath(designCenterX, designCenterY, activeRadiusX * 2, activeRadiusY * 2)
      case 'triangle':
        return generateTrianglePath(designCenterX, designCenterY, activeRadius * 2)
      case 'star':
        return generateStarPath(designCenterX, designCenterY, activeRadius, activeRadius * starInnerRatio, starPoints)
      case 'heart':
        return generateHeartPath(designCenterX, designCenterY, activeRadius * 2)
      case 'infinity':
        return generateInfinityPath(designCenterX, designCenterY, activeRadiusX * 2, activeRadiusY * 2)
      case 'wave':
        return generateWavePath(designCenterX, designCenterY, activeRadiusX * 2, activeRadiusY, 3)
      case 'custom':
        return customPath || generateCirclePath(designCenterX, designCenterY, activeRadius)
      default:
        return generateEllipsePath(designCenterX, designCenterY, activeRadiusX, activeRadiusY)
    }
  }, [shape, customPath, designCenterX, designCenterY, activeRadiusX, activeRadiusY, activeRadius, starPoints, starInnerRatio])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`)
    const syncMobileState = () => setIsMobile(mediaQuery.matches)

    syncMobileState()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncMobileState)
      return () => mediaQuery.removeEventListener('change', syncMobileState)
    }

    mediaQuery.addListener(syncMobileState)
    return () => mediaQuery.removeListener(syncMobileState)
  }, [mobileBreakpoint])

  useEffect(() => {
    if (!responsive || !containerRef.current) return undefined
    const updateScale = () => {
      if (!containerRef.current) return
      setScale(containerRef.current.clientWidth / activeBaseWidth)
    }
    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [responsive, activeBaseWidth])

  const containerWidth = responsive ? '100%' : typeof width === 'number' ? width : '100%'
  const containerHeight = responsive ? 'auto' : typeof height === 'number' ? height : typeof width === 'number' ? width : 'auto'

  const items = useMemo(
    () =>
      images
        .map((image, index) => {
          const src = typeof image === 'string' ? image : image?.src
          const label = typeof image === 'string' ? '' : image?.label || image?.name || ''

          if (!src) return null

          return {
            label,
            node: (
              <img
                key={`${src}-${index}`}
                src={src}
                alt={label || `${altPrefix} ${index + 1}`}
                draggable={false}
                loading="lazy"
                decoding="async"
                className="orbit-image"
              />
            ),
          }
        })
        .filter(Boolean),
    [altPrefix, images],
  )

  const hasInteractiveLabels = items.some((item) => item.label)

  return (
    <div
      ref={containerRef}
      className={`orbit-container ${className}`}
      style={{
        width: containerWidth,
        height: containerHeight,
        aspectRatio: responsive ? '1 / 1' : undefined,
      }}
      aria-hidden={hasInteractiveLabels ? undefined : true}
      aria-label={hasInteractiveLabels ? 'Interactive technology orbit' : undefined}
    >
      <div
        className={responsive ? 'orbit-scaling-container orbit-scaling-container--responsive' : 'orbit-scaling-container'}
        style={{
          width: responsive ? activeBaseWidth : '100%',
          height: responsive ? activeBaseWidth : '100%',
          transform: responsive ? `translate(-50%, -50%) scale(${scale})` : undefined,
        }}
      >
        <div className="orbit-rotation-wrapper" style={{ transform: `rotate(${rotation}deg)` }}>
          {showPath && (
            <svg width="100%" height="100%" viewBox={`0 0 ${activeBaseWidth} ${activeBaseWidth}`} className="orbit-path-svg">
              <path d={path} fill="none" stroke={pathColor} strokeWidth={pathWidth / scale} />
            </svg>
          )}

          {items.map((item, index) => (
            <OrbitItem
              key={index}
              item={item.node}
              label={item.label}
              index={index}
              totalItems={items.length}
              path={path}
              itemSize={activeItemSize}
              rotation={rotation}
              duration={activeDuration}
              direction={direction}
              easing={easing}
              fill={fill}
              paused={paused || activeIndex !== null}
              active={activeIndex === index}
              onActivate={setActiveIndex}
              onDeactivate={() => setActiveIndex(null)}
            />
          ))}
        </div>
      </div>

      {centerContent && <div className="orbit-center-content">{centerContent}</div>}
    </div>
  )
}

export default memo(OrbitImages)
