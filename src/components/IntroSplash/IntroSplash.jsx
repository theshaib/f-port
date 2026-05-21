import { memo } from 'react'
import logoMark from '../../assets/logo.png'
import './IntroSplash.css'

function IntroSplash({ phase = 'active', variant = 'initial' }) {
  const isInitial = variant === 'initial'
  const statusLabel = isInitial ? 'Loading experience' : 'Loading next view'

  return (
    <div className={`intro-splash intro-splash--${phase} intro-splash--${variant}`} aria-hidden="true">
      <div className="intro-splash__veil" />
      <div className="intro-splash__halo intro-splash__halo--one" />
      <div className="intro-splash__halo intro-splash__halo--two" />
      <div className="intro-splash__halo intro-splash__halo--three" />

      <div className="intro-splash__stage">
        <div className="intro-splash__grid" />
        <span className="intro-splash__signal intro-splash__signal--one" />
        <span className="intro-splash__signal intro-splash__signal--two" />
        <span className="intro-splash__signal intro-splash__signal--three" />

        <div className="intro-splash__rings" aria-hidden="true">
          <span className="intro-splash__ring intro-splash__ring--one" />
          <span className="intro-splash__ring intro-splash__ring--two" />
          <span className="intro-splash__ring intro-splash__ring--three" />
        </div>

        <div className="intro-splash__brand">
          <div className="intro-splash__media">
            <span className="intro-splash__logo-glow" />
            <span className="intro-splash__orbit intro-splash__orbit--one" />
            <span className="intro-splash__orbit intro-splash__orbit--two" />
            <span className="intro-splash__orbit intro-splash__orbit--three" />
            <span className="intro-splash__logo-shell">
              <span className="intro-splash__logo-scan" />
              <img className="intro-splash__logo" src={logoMark} alt="" />
            </span>
          </div>

          <div className="intro-splash__wording">
            <span className="intro-splash__wordmark">THESHAIB</span>
            <div className="intro-splash__loader-container">
              <span className="intro-splash__loader" aria-hidden="true">
                <span className="intro-splash__loader-bg" />
                <span className="intro-splash__loader-bar" />
                <span className="intro-splash__loader-shine" />
              </span>
              <span className="intro-splash__loader-dots">
                <span className="intro-splash__loader-dot" />
                <span className="intro-splash__loader-dot" />
                <span className="intro-splash__loader-dot" />
              </span>
            </div>
            <span className="intro-splash__status">{statusLabel}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(IntroSplash)
