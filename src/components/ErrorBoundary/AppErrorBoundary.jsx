import { Component } from 'react'
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { APP_ROUTES } from '../../lib/app-config.js'

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="status-page">
          <div className="status-card glass">
            <span className="eyebrow">Error Boundary</span>
            <h1 className="status-title">This page hit a rendering issue.</h1>
            <p className="status-copy">Refresh the page or return home. The problem was safely contained so the site stays usable.</p>
            <div className="status-actions">
              <Link className="button primary" to={APP_ROUTES.home}>
                Return home
              </Link>
              <button type="button" className="button" onClick={() => window.location.reload()}>
                Reload
              </button>
            </div>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}

export function RouteErrorState() {
  const error = useRouteError()
  let title = 'This page could not be loaded.'
  let description = 'Try returning home or refreshing once.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page not found.'
      description = 'The page may have moved or the link is outdated.'
    } else {
      title = `${error.status} ${error.statusText}`
    }
  } else if (error instanceof Error && error.message) {
    description = error.message
  }

  return (
    <section className="status-page">
      <div className="status-card glass">
        <span className="eyebrow">Page Status</span>
        <h1 className="status-title">{title}</h1>
        <p className="status-copy">{description}</p>
        <div className="status-actions">
          <Link className="button primary" to={APP_ROUTES.home}>
            Return home
          </Link>
          <button type="button" className="button" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      </div>
    </section>
  )
}
