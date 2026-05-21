import { memo, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bot, Code2, Grid2X2, MessageCircle } from 'lucide-react'
import { motion } from '../../lib/motion.jsx'
import {
  fadeInDown,
  fadeInUp,
  revealViewport,
  staggerReveal,
  useScrollReveal,
} from '../../components/Animation/Animation.jsx'
import { SplitText } from '../../components/animations/index.js'
import OrbitImages from '../../components/OrbitImages/OrbitImages.jsx'
import { buildSocialItems } from '../../constants/socialBrandIcons.js'
import { ORBIT_IMAGES, STACK_ITEMS } from '../../constants/siteContent.js'
import { usePortfolioContext } from '../../context/PortfolioContext.jsx'
import aboutBackgroundImage from '../../assets/bg-about.png'
import portraitImage from '../../assets/home-optimized.jpg'
import FeaturedProjectsSection from './FeaturedProjectsSection.jsx'
import { SectionHeading } from '../../components/ui/index.js'
import './Home.css'

const PORTRAIT_IMAGE_SIZE = 577
const HERO_NAME_WORDS = ['Zakarya', 'Chaib']
const HERO_ROLE_ITEMS = [
  { label: 'Product-minded full-stack developer', icon: 'code' },
  { label: 'AI agent builder', icon: 'ai' },
]
const HERO_DESCRIPTION =
  'I build clean web products that connect sharp interfaces, reliable backends, and practical AI agents. The focus is simple: fast experiences, maintainable systems, and work that feels polished from first click to final handoff.'
const ABOUT_ORBIT_STACK_NAMES = ['React.js', 'Node.js', 'Python', 'Docker', 'Git', 'GitHub']

function Home() {
  const { contactInfo, personalInfo } = usePortfolioContext()
  const navigate = useNavigate()
  const revealRef = useScrollReveal()
  const stackSplitIndex = Math.ceil(STACK_ITEMS.length / 2)
  const stackRowA = useMemo(() => STACK_ITEMS.slice(0, stackSplitIndex), [stackSplitIndex])
  const stackRowB = useMemo(() => STACK_ITEMS.slice(stackSplitIndex), [stackSplitIndex])
  const aboutOrbitItems = useMemo(
    () =>
      ABOUT_ORBIT_STACK_NAMES.map((name) => {
        const stackItem = STACK_ITEMS.find((item) => item.name === name)
        return stackItem ? { src: stackItem.icon, label: stackItem.name } : null
      }).filter(Boolean),
    [],
  )
  const aboutSocialItems = useMemo(() => buildSocialItems(contactInfo), [contactInfo])
  const aboutSocialTrack = useMemo(() => [...aboutSocialItems, ...aboutSocialItems], [aboutSocialItems])
  const compactSocialItems = useMemo(
    () => aboutSocialItems.filter((item) => ['linkedin', 'whatsapp', 'email'].includes(item.key)),
    [aboutSocialItems],
  )
  const scrollToHomeSection = (sectionId) => (event) => {
    event.preventDefault()

    const target = document.getElementById(sectionId)
    if (!target) return

    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    window.history.pushState(null, '', `#${sectionId}`)
    target.scrollIntoView({ behavior, block: 'start' })
  }

  return (
    <section className="home" ref={revealRef}>
      <div className="home-hero">
        <div className="home-content">
          <div className="home-name-wrap">
            <h1 className="title-xl home-first-name" aria-label="Zakarya Chaib">
              {HERO_NAME_WORDS.map((word, wordIndex) => (
                <span className="home-name-word" key={word}>
                  {word.split('').map((char, charIndex) => (
                    <span
                      className="home-name-char"
                      key={`${word}-${charIndex}`}
                      style={{ '--char-index': wordIndex * 8 + charIndex }}
                      aria-hidden="true"
                    >
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
          </div>

          <p className="home-lead" aria-label="Product-minded full-stack developer and AI agent builder">
            {HERO_ROLE_ITEMS.map(({ label, icon }, index) => (
              <span key={label} className={index === HERO_ROLE_ITEMS.length - 1 ? 'home-lead-accent' : undefined}>
                {icon === 'code' ? (
                  <Code2 size={15} strokeWidth={1.9} aria-hidden="true" />
                ) : (
                  <Bot size={15} strokeWidth={1.9} aria-hidden="true" />
                )}
                {label}
              </span>
            ))}
          </p>
          <p className="home-description home-description-text muted">
            {HERO_DESCRIPTION}
          </p>

          <div className="home-actions">
            <a className="button primary" href="#projects" onClick={scrollToHomeSection('projects')}>
              <Grid2X2 size={17} strokeWidth={1.9} aria-hidden="true" />
              Explore Projects
            </a>
            <a className="button" href="#contact" onClick={scrollToHomeSection('contact')}>
              <MessageCircle size={17} strokeWidth={1.9} aria-hidden="true" />
              Contact
            </a>
          </div>
        </div>

        <div className="home-portrait">
          <div className="portrait-card">
            <span className="portrait-orbit portrait-orbit-one" aria-hidden="true" />
            <span className="portrait-orbit portrait-orbit-two" aria-hidden="true" />
            <div className="portrait-image">
              <img
                src={portraitImage}
                alt={`${personalInfo?.name ?? 'Zakarya Chaib'} portrait`}
                width={PORTRAIT_IMAGE_SIZE}
                height={PORTRAIT_IMAGE_SIZE}
                sizes="(max-width: 640px) 68vw, (max-width: 900px) 58vw, (max-width: 1200px) 290px, 340px"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="home-stack reveal" data-reveal>
        <motion.div
          className="home-stack-head"
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
          variants={staggerReveal(0.08, 0.04)}
        >
          <SectionHeading
            eyebrow="Stack"
            title="Stack Built For Shipping"
            eyebrowClassName="eyebrow"
            titleClassName="title-md home-stack-title"
            titleTag="h2"
            titleDelay={26}
            titleDirection="top"
            titleStepDuration={0.58}
          />
        </motion.div>

        <motion.div
          className="home-stack-marquee"
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
          variants={fadeInUp(0.04, 0.72)}
        >
          <div className="home-stack-track home-stack-track-left">
            {[...stackRowA, ...stackRowA].map((item, index) => (
              <a className="stack-chip" key={`${item.name}-left-${index}`} href={item.href} target="_blank" rel="noreferrer">
                <span className="stack-mark">
                  <img src={item.icon} alt={`${item.name} logo`} loading="lazy" decoding="async" />
                </span>
                <span className="stack-name">{item.name}</span>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="home-stack-marquee"
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
          variants={fadeInUp(0.12, 0.72)}
        >
          <div className="home-stack-track home-stack-track-right">
            {[...stackRowB, ...stackRowB].map((item, index) => (
              <a className="stack-chip" key={`${item.name}-right-${index}`} href={item.href} target="_blank" rel="noreferrer">
                <span className="stack-mark">
                  <img src={item.icon} alt={`${item.name} logo`} loading="lazy" decoding="async" />
                </span>
                <span className="stack-name">{item.name}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      <FeaturedProjectsSection />

      <div className="home-lower-stage deferred-section">
        <section id="about" className="about" style={{ '--about-bg-image': `url(${aboutBackgroundImage})` }}>
          <div className="about-card reveal" data-reveal>
            <div className="about-kicker">PORTFOLIO IDENTITY</div>

            <motion.div
              className="about-story"
              variants={staggerReveal(0.14, 0.05)}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              <motion.div className="about-story-copy about-story-main" variants={fadeInUp(0.08, 0.76)}>
                <div className="about-story-intro">
                  <motion.span className="about-role-pill" variants={fadeInDown(0.02, 0.56)}>
                    Software Developer | AI-Powered Applications
                  </motion.span>
                  <SplitText
                    as="h2"
                    text="A developer who builds useful digital systems."
                    animateBy="chars"
                    delay={30}
                    direction="top"
                    stepDuration={1.02}
                    className="about-display"
                  />
                </div>

                <div className="about-story-body">
                  <motion.p className="about-story-text" variants={fadeInUp(0.04, 0.62)}>
                    I am Zakarya Chaib, a software developer from Morocco focused on modern web products, backend logic, and AI-powered applications that solve real workflow problems.
                  </motion.p>
                  <motion.p className="about-story-text about-story-highlight" variants={fadeInUp(0.08, 0.62)}>
                    This portfolio is meant to present me like a person, not just a list of projects: how I think, what I can build, and the potential I bring when a product needs clarity, speed, and smart automation.
                  </motion.p>
                  <motion.p className="about-story-text" variants={fadeInUp(0.12, 0.62)}>
                    I work across React, Next.js, Node.js, Express, MongoDB, and practical AI integrations. I can build landing pages, dashboards, admin systems, chatbots, internal tools, and AI-assisted workflows.
                  </motion.p>
                  <motion.p className="about-story-text" variants={fadeInUp(0.16, 0.62)}>
                    Before writing code, I look for the real business need. Then I develop a solution that feels polished on the surface and solid underneath.
                  </motion.p>
                </div>
              </motion.div>

              <motion.div className="about-orbit-card" variants={fadeInUp(0.12, 0.76)}>
                <div className="about-orbit-visual">
                  <OrbitImages
                    images={aboutOrbitItems.length ? aboutOrbitItems : ORBIT_IMAGES}
                    shape="ellipse"
                    radiusX={220}
                    radiusY={70}
                    mobileRadiusX={170}
                    mobileRadiusY={88}
                    rotation={-8}
                    duration={42}
                    mobileDuration={30}
                    itemSize={64}
                    mobileItemSize={54}
                    responsive
                    baseWidth={520}
                    mobileBaseWidth={420}
                    direction="normal"
                    fill
                    showPath
                    pathColor="var(--surface-line)"
                    pathWidth={1.4}
                  />
                </div>
              </motion.div>

              <motion.div className="about-connect-card" variants={fadeInUp(0.14, 0.84)}>
                <motion.div className="about-connect-head" variants={staggerReveal(0.08, 0.04)}>
                  <motion.span className="about-connect-kicker" variants={fadeInDown(0.02, 0.56)}>
                    Connect
                  </motion.span>
                  <motion.h3 className="about-connect-title" variants={fadeInUp(0.06, 0.6)}>
                    Choose the fastest path to reach me and turn an idea into a working product.
                  </motion.h3>
                </motion.div>

                <motion.div className="about-social-marquee" variants={fadeInUp(0.08, 0.68)}>
                  <div className="about-social-track">
                    {aboutSocialTrack.map((item, index) => (
                      <a
                        key={`${item.label}-${index}`}
                        className="about-social-link"
                        href={item.href}
                        target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                        rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                      >
                        <span className="about-social-icon">
                          <i className={`bi ${item.icon}`} aria-hidden="true" />
                        </span>
                        <span className="about-social-label">{item.label}</span>
                        <i className="bi bi-arrow-up-right about-social-arrow" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="contact-card contact-card-compact reveal" data-reveal>
            <motion.div
              className="contact-compact-copy"
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              variants={staggerReveal(0.1, 0.04)}
            >
              <motion.span className="contact-compact-kicker" variants={fadeInDown(0.02, 0.62)}>
                Start a build
              </motion.span>
              <SplitText
                as="h2"
                text="Bring the idea. I will shape the system."
                animateBy="chars"
                delay={30}
                direction="top"
                stepDuration={1}
                className="contact-compact-title"
              />
              <motion.p className="contact-compact-text" variants={fadeInUp(0.08, 0.62)}>
                Share the product goal, the users, and the first milestone. I can help turn it into a web app, AI feature, automation flow, or full product build.
              </motion.p>
              <motion.div className="contact-compact-meta" variants={fadeInUp(0.12, 0.62)}>
                <span>AI integration</span>
                <span>Web development</span>
                <span>Automation</span>
              </motion.div>
            </motion.div>

            <motion.div
              className="contact-compact-actions"
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              variants={staggerReveal(0.08, 0.16)}
            >
              <motion.div className="contact-compact-signal" variants={fadeInUp(0.04, 0.64)}>
                <span className="contact-signal-icon">
                  <i className="bi bi-lightning-charge-fill" aria-hidden="true" />
                </span>
                <div>
                  <strong>Potential into product</strong>
                  <p>Clear scope, clean code, useful AI, and a polished user experience.</p>
                </div>
              </motion.div>
              <motion.button
                type="button"
                className="button primary contact-compact-cta"
                onClick={() => navigate('/contact')}
                variants={fadeInUp(0.08, 0.68)}
              >
                <i className="bi bi-send-fill" aria-hidden="true" />
                Go to contact
              </motion.button>
              <motion.div className="contact-compact-links" variants={fadeInUp(0.14, 0.66)}>
                {compactSocialItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                  >
                    <i className={`bi ${item.icon}`} aria-hidden="true" />
                    {item.label}
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </section>
  )
}

export default memo(Home)
