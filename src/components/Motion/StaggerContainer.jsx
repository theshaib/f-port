import { createElement } from 'react'
import clsx from 'clsx'

function StaggerContainer({ as = 'div', children, className, ...props }) {
  const cleanProps = { ...props }
  delete cleanProps.delayChildren
  delete cleanProps.staggerChildren
  delete cleanProps.viewport

  return createElement(as, { className: clsx('motion-stagger', className), ...cleanProps }, children)
}

export default StaggerContainer
