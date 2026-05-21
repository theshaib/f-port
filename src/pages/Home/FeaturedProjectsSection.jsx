import { memo } from 'react'
import { ArrowUpRight, Clock3, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from '../../lib/motion.jsx'
import { fadeInDown, fadeInUp, revealViewport, staggerReveal } from '../../components/Animation/Animation.jsx'
import { SplitText } from '../../components/animations/index.js'
import { useFeaturedProjects } from './useFeaturedProjects.js'

const getProjectIcon = (project) => {
  const slug = String(project?.slug ?? '').toLowerCase()
  const tag = String(project?.tag ?? '').toLowerCase()

  if (slug.includes('clinic') || tag.includes('health')) {
    return 'bi-heart-pulse'
  }

  if (slug.includes('analyz') || tag.includes('admin')) {
    return 'bi-bar-chart-line'
  }

  return 'bi-bag-check'
}

function FeaturedProjectsSection() {
  const { projects } = useFeaturedProjects()

  return (
    <section id="projects" className="projects deferred-section">
      <div className="projects-header projects-header-simple">
        <motion.div
          className="eyebrow projects-eyebrow"
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
          variants={fadeInDown(0.02, 0.62)}
        >
          <i className="bi bi-stars" aria-hidden="true" />
          Selected Work
        </motion.div>
        <SplitText
          as="h2"
          text="Selected Builds With Real Product Logic"
          animateBy="chars"
          delay={24}
          direction="top"
          stepDuration={0.96}
          className="projects-clean-title"
          textAlign="left"
        />
      </div>

      <motion.div
        className="project-grid-simple"
        variants={staggerReveal(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {projects.map((project, index) => {
          const liveHref = project.demo && project.demo !== '#' ? project.demo : project.repo && project.repo !== '#' ? project.repo : null
          const detailHref = `/projects/${project.slug}`

          return (
            <motion.article
              className="project-card-simple"
              key={project.title}
              variants={fadeInUp(index * 0.08, 0.68)}
              style={{ '--project-delay': `${index * 90}ms` }}
            >
              <div className="project-card-simple-media" aria-hidden="true">
                <img
                  src={project.image}
                  alt=""
                  width={project.width}
                  height={project.height}
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="project-card-simple-body">
                <h3 className="project-card-simple-title project-title-system">
                  <i className={`bi ${getProjectIcon(project)} project-card-title-icon`} aria-hidden="true" />
                  <span className="project-card-title-text">{project.title}</span>
                </h3>
                <p className="project-card-simple-description">{project.description}</p>
                <div className="project-card-simple-stack" aria-label={`${project.title} stack`}>
                  {(project.stack ?? []).slice(0, 3).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>

                <div className="project-card-simple-links">
                  <Link className="project-simple-link project-simple-link-primary" to={detailHref}>
                    <span>Explore more</span>
                    <ArrowUpRight size={16} strokeWidth={1.9} aria-hidden="true" />
                  </Link>

                  {liveHref ? (
                    <a className="project-simple-link" href={liveHref} target="_blank" rel="noreferrer">
                      <ExternalLink size={16} strokeWidth={1.9} aria-hidden="true" />
                      <span>Live preview</span>
                    </a>
                  ) : (
                    <span className="project-simple-link-disabled">
                      <Clock3 size={16} strokeWidth={1.9} aria-hidden="true" />
                      <span>Coming soon</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          )
        })}
      </motion.div>
    </section>
  )
}

export default memo(FeaturedProjectsSection)
