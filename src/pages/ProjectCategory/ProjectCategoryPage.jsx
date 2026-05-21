import { memo, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Bot, Code2, Layers3, MessageCircle, Sparkles } from 'lucide-react'
import { motion } from '../../lib/motion.jsx'
import { fadeInDown, fadeInScale, fadeInUp, staggerReveal } from '../../components/Animation/Animation.jsx'
import { FadeReveal, SplitText } from '../../components/animations/index.js'
import { usePortfolioContext } from '../../context/PortfolioContext.jsx'
import { APP_ROUTES } from '../../lib/app-config.js'
import './ProjectCategoryPage.css'

const PAGE_ICONS = {
  web: Code2,
  ai: Bot,
}

function getLiveHref(project) {
  if (project.demo && project.demo !== '#') return project.demo
  if (project.repo && project.repo !== '#') return project.repo
  return null
}

function ProjectCategoryPage({
  eyebrow,
  title,
  description,
  projects,
  tone = 'web',
  switchLabel,
  switchTo,
}) {
  const { contactInfo } = usePortfolioContext()
  const navigate = useNavigate()
  const [scrollProgress, setScrollProgress] = useState(0)
  const PageIcon = PAGE_ICONS[tone] ?? Layers3

  useEffect(() => {
    let frameId = 0

    const syncProgress = () => {
      const root = document.documentElement
      const scrollTop = window.scrollY || root.scrollTop || 0
      const maxScrollable = Math.max(root.scrollHeight - window.innerHeight, 1)
      setScrollProgress(Math.min(Math.max(scrollTop / maxScrollable, 0), 1))
      frameId = 0
    }

    const onScroll = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(syncProgress)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      <div
        className="project-scroll-progress"
        aria-hidden="true"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
      <section className={`project-category project-category-${tone}`}>
        <motion.div className="project-category-hero" variants={staggerReveal(0.1, 0.04)} initial="hidden" animate="show">
          <motion.div className="project-category-eyebrow eyebrow" variants={fadeInDown(0.02, 0.62)}>
            <PageIcon size={18} strokeWidth={1.9} aria-hidden="true" />
            {eyebrow}
          </motion.div>
          <SplitText
            as="h1"
            text={title}
            delay={16}
            animateBy="words"
            direction="top"
            stepDuration={0.52}
            className="project-category-title"
          />
          <FadeReveal as="p" className="project-category-description" delay={0.08} duration={0.66} distance={16}>
            {description}
          </FadeReveal>
          <motion.div className="project-category-nav" variants={fadeInUp(0.14, 0.64)}>
            {switchTo ? (
              <Link className="project-category-switch" to={switchTo}>
                <Sparkles size={16} strokeWidth={1.9} aria-hidden="true" />
                {switchLabel}
              </Link>
            ) : null}
          </motion.div>
        </motion.div>

        <motion.div className="project-category-grid" variants={staggerReveal(0.11, 0.08)} initial="hidden" animate="show">
          {projects.map((project, index) => {
            const liveHref = getLiveHref(project)
            const detailHref = `/projects/${project.slug}`
            const visibleStack = project.stack?.slice(0, 4) ?? []

            return (
              <motion.article
                key={project.slug}
                className="project-category-card"
                variants={fadeInUp(index * 0.06, 0.7)}
              >
                <div className="project-category-card-media" aria-hidden="true">
                  <img src={project.image} alt="" loading="lazy" decoding="async" />
                </div>

                <div className="project-category-card-copy">
                  <div className="project-category-card-meta">
                    <span>{project.tag}</span>
                    <span>{visibleStack[0]}</span>
                  </div>
                  <h2 className="project-category-card-title project-title-system">{project.title}</h2>
                  <p>{project.description}</p>
                  <div className="project-category-stack" aria-label={`${project.title} stack`}>
                    {visibleStack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>

                <div className="project-category-actions">
                  <Link className="project-category-action project-category-action-primary" to={detailHref}>
                    <span>Explore more</span>
                    <ArrowUpRight size={16} strokeWidth={1.9} aria-hidden="true" />
                  </Link>
                  {liveHref ? (
                    <a className="project-category-icon-action" href={liveHref} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}>
                      <ArrowUpRight size={17} strokeWidth={1.9} aria-hidden="true" />
                    </a>
                  ) : null}
                  {project.repo ? (
                    <a className="project-category-icon-action" href={project.repo} target="_blank" rel="noreferrer" aria-label={`GitHub repo for ${project.title}`}>
                      <i className="bi bi-github" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </motion.article>
            )
          })}
        </motion.div>

        <motion.div className="project-category-footer" initial="hidden" animate="show" variants={staggerReveal(0.09, 0.08)}>
          <motion.button type="button" className="button primary" onClick={() => navigate(APP_ROUTES.contact)} variants={fadeInScale(0.08, 0.66)}>
            <MessageCircle size={17} strokeWidth={1.9} aria-hidden="true" />
            Start your build
          </motion.button>
          <motion.a className="button" href={contactInfo?.github} target="_blank" rel="noreferrer" variants={fadeInScale(0.13, 0.66)}>
            <i className="bi bi-github" aria-hidden="true" />
            GitHub
          </motion.a>
        </motion.div>
      </section>
    </>
  )
}

export default memo(ProjectCategoryPage)
