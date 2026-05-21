import './RouteLoader.css'

export default function RouteLoader({ active = true, mode = 'inline' }) {
  if (!active) {
    return null
  }

  return (
    <div className={`route-loader route-loader--${mode}`} aria-busy="true" aria-live="polite">
      <div className="route-loader-progress" />

      {mode === 'page' ? (
        <div className="route-loader-shell glass">
          <span className="route-loader-chip" />
          <span className="route-loader-line route-loader-line--lg" />
          <span className="route-loader-line" />
          <span className="route-loader-line route-loader-line--sm" />
        </div>
      ) : null}

      <span className="sr-only">Loading page</span>
    </div>
  )
}

