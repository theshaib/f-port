import { memo, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from '../../lib/motion.jsx'
import { buildSocialItems, socialBrandIcons } from '../../constants/socialBrandIcons.js'
import { fadeInDown, fadeInUp, revealViewport, staggerReveal } from '../Animation/Animation.jsx'
import './Footer.css'

const CURRENT_YEAR = new Date().getFullYear()

function Footer({ contactInfo }) {
  const navigate = useNavigate()
  const socialItems = useMemo(() => buildSocialItems(contactInfo), [contactInfo])

  return (
    <motion.footer className="site-footer" initial="hidden" whileInView="show" viewport={revealViewport} variants={fadeInUp(0.04, 0.82)}>
      <div className="container footer-shell">
        <div className="footer-panel">
          <motion.div className="footer-inner" variants={staggerReveal(0.1, 0.06)}>
            <motion.div className="footer-brand" variants={fadeInUp(0.08, 0.7)}>
              <motion.div className="footer-wordmark" variants={fadeInDown(0.04, 0.56)}>
                theShaib
              </motion.div>
              <motion.div className="footer-muted" variants={fadeInUp(0.12, 0.62)}>
                Full-stack web products with modern design, strong systems, and practical AI integration.
              </motion.div>
              <motion.a className="footer-email icon-link" href={`mailto:${contactInfo.email}`} variants={fadeInUp(0.18, 0.62)}>
                <i className={`bi ${socialBrandIcons.email.icon}`} aria-hidden="true" />
                {contactInfo.email}
              </motion.a>
            </motion.div>

            <motion.div className="footer-column" variants={fadeInUp(0.14, 0.7)}>
              <div className="footer-label">Explore</div>
              <button type="button" className="footer-link-button" onClick={() => navigate('/')}>
                Home
              </button>
              <button type="button" className="footer-link-button" onClick={() => navigate('/contact')}>
                Contact
              </button>
              <button type="button" className="footer-link-button" onClick={() => navigate('/projects/web-project')}>
                Web Products
              </button>
              <button type="button" className="footer-link-button" onClick={() => navigate('/projects/ai-project')}>
                AI Builds
              </button>
            </motion.div>

            <motion.div className="footer-column" variants={fadeInUp(0.2, 0.7)}>
              <div className="footer-label">Connect</div>
              {socialItems.map((item) => (
                <a
                  key={item.key}
                  className="icon-link"
                  href={item.href}
                  target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                >
                  <i className={`bi ${item.icon}`} aria-hidden="true" />
                  {item.label}
                </a>
              ))}
            </motion.div>

            <motion.div className="footer-cta" variants={fadeInUp(0.26, 0.7)}>
              <div className="footer-label">Availability</div>
              <div className="footer-note">Available for freelance projects and product-focused collaborations.</div>
              <div className="footer-note">If you need a modern build with AI in the flow, let's talk.</div>
            </motion.div>
          </motion.div>

          <motion.div className="footer-bottom" variants={fadeInUp(0.3, 0.66)}>
            <span>{`Zakarya Chaib (c) ${CURRENT_YEAR}. Crafted for modern web and AI products.`}</span>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  )
}

export default memo(Footer)
