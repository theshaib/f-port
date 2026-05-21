import { memo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ExternalLink, Layers3, PanelsTopLeft, ShoppingBag, Workflow } from 'lucide-react'
import { FadeReveal, SplitText } from '../../components/animations/index.js'
import { fadeInDown, fadeInUp, revealViewport, staggerReveal } from '../../components/Animation/Animation.jsx'
import { motion } from '../../lib/motion.jsx'
import { FEATURED_PROJECTS } from '../../constants/featuredProjects.js'
import './ProjectDetail.css'

const TECH_ICON_URLS = {
  Axios: 'https://cdn.simpleicons.org/axios/5A29E4',
  'Axios 1.13': 'https://cdn.simpleicons.org/axios/5A29E4',
  bcrypt: 'https://cdn.simpleicons.org/letsencrypt/003A70',
  bcryptjs: 'https://cdn.simpleicons.org/letsencrypt/003A70',
  CrewAI: 'https://cdn.simpleicons.org/crewai/FFFFFF',
  'CSS3': 'https://cdn.simpleicons.org/css3/1572B6',
  Docker: 'https://cdn.simpleicons.org/docker/2496ED',
  Express: 'https://cdn.simpleicons.org/express/FFFFFF',
  'Express 5.2': 'https://cdn.simpleicons.org/express/FFFFFF',
  FastAPI: 'https://cdn.simpleicons.org/fastapi/009688',
  'Framer Motion': 'https://cdn.simpleicons.org/framer/0055FF',
  JWT: 'https://cdn.simpleicons.org/jsonwebtokens/000000',
  LangChain: 'https://cdn.simpleicons.org/langchain/1C3C3C',
  MongoDB: 'https://cdn.simpleicons.org/mongodb/47A248',
  Mongoose: 'https://cdn.simpleicons.org/mongoose/880000',
  'Mongoose 9.2': 'https://cdn.simpleicons.org/mongoose/880000',
  'Next.js 16': 'https://cdn.simpleicons.org/nextdotjs/FFFFFF',
  'Node.js': 'https://cdn.simpleicons.org/nodedotjs/5FA04E',
  OpenAI: 'https://cdn.simpleicons.org/openai/FFFFFF',
  Pandas: 'https://cdn.simpleicons.org/pandas/150458',
  Pytest: 'https://cdn.simpleicons.org/pytest/0A9EDC',
  Python: 'https://cdn.simpleicons.org/python/3776AB',
  'Python 3.10+': 'https://cdn.simpleicons.org/python/3776AB',
  React: 'https://cdn.simpleicons.org/react/61DAFB',
  'React 19': 'https://cdn.simpleicons.org/react/61DAFB',
  'React Router 7': 'https://cdn.simpleicons.org/reactrouter/CA4245',
  'TanStack Query': 'https://cdn.simpleicons.org/reactquery/FF4154',
  'Tailwind CSS': 'https://cdn.simpleicons.org/tailwindcss/06B6D4',
  TypeScript: 'https://cdn.simpleicons.org/typescript/3178C6',
  Vite: 'https://cdn.simpleicons.org/vite/646CFF',
  'Vite 7.3': 'https://cdn.simpleicons.org/vite/646CFF',
}

function getTechIconUrl(stackName) {
  const exact = TECH_ICON_URLS[stackName]

  if (exact) return exact

  return TECH_ICON_URLS[String(stackName).replace(/\s+\d+(?:\.\d+)?$/, '')] ?? null
}

function ArchitectureNode({ item, className = '', tone = '' }) {
  return (
    <div className={`architecture-node ${tone ? `architecture-node-${tone}` : ''} ${className}`}>
      <strong>{item.title}</strong>
      <span>{item.subtitle}</span>
    </div>
  )
}

function ProjectArchitecture({ architecture }) {
  if (!architecture) return null

  const architectureSteps =
    architecture.steps ??
    [architecture.frontend, architecture.api, { title: 'Services', subtitle: 'Products - Orders - Auth - Settings' }, architecture.persistence?.[0], architecture.deploy].filter(
      Boolean,
    )

  return (
    <motion.section
      className="project-architecture"
      variants={fadeInUp(0.08, 0.78)}
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
    >
      <div className="project-detail-panel-heading project-architecture-heading">
        <Workflow size={20} strokeWidth={1.9} aria-hidden="true" />
        <SplitText as="h2" text="Architecture" animateBy="chars" delay={26} direction="top" stepDuration={0.5} />
      </div>

      <div className="architecture-map" aria-label="Project application architecture">
        {architectureSteps.map((item, index) => (
          <div className="architecture-step" key={item.title}>
            <ArchitectureNode
              item={item}
              className={index === 0 ? 'architecture-node-top' : index === architectureSteps.length - 1 ? 'architecture-node-deploy' : ''}
              tone={index === 0 ? 'purple' : index === 1 || index === 2 ? 'green' : item.tone}
            />
            {index < architectureSteps.length - 1 ? <span className="architecture-arrow" aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
    </motion.section>
  )
}

function ProjectDetail() {
  const { slug } = useParams()
  const project = FEATURED_PROJECTS.find((item) => item.slug === slug)

  if (!project) {
    return (
      <section className="status-page">
        <div className="status-card glass">
          <span className="eyebrow">Project</span>
          <SplitText
            as="h1"
            text="This project is not available."
            animateBy="chars"
            delay={24}
            direction="top"
            stepDuration={0.42}
            className="status-title"
          />
          <p className="status-copy">Choose one of the featured projects from the home page.</p>
          <div className="status-actions">
            <Link className="button primary" to="/#projects">
              Back to projects
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const demoHref = project.demo && project.demo !== '#' ? project.demo : null
  const repoHref = project.repo && project.repo !== '#' ? project.repo : null
  const hasExtendedDetails = Boolean(project.highlights || project.adminFeatures)

  return (
    <section className="project-detail-page">
      <motion.div className="project-detail-hero" variants={staggerReveal(0.12, 0.04)} initial="hidden" animate="show">
        <div className="project-detail-hero-media" aria-hidden="true">
          <img
            src={project.image}
            alt=""
            width={project.width}
            height={project.height}
            sizes="100vw"
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="project-detail-hero-shade" aria-hidden="true" />

        <motion.div className="project-detail-hero-copy" variants={fadeInUp(0.04, 0.7)}>
          <motion.div className="eyebrow" variants={fadeInDown(0.02, 0.62)}>
            {project.tag}
          </motion.div>
          <SplitText
            as="h1"
            text={project.title}
            delay={28}
            animateBy="chars"
            direction="top"
            stepDuration={0.48}
            className="project-detail-title project-title-system"
          />
          <FadeReveal as="p" className="project-detail-lead" delay={0.08} duration={0.72} distance={18}>
            {project.details}
          </FadeReveal>
          <motion.div className="project-detail-actions" variants={fadeInUp(0.18, 0.68)}>
            {demoHref ? (
              <a className="button primary" href={demoHref} target="_blank" rel="noreferrer">
                <ExternalLink size={18} strokeWidth={1.9} aria-hidden="true" />
                Live Demo
              </a>
            ) : null}
            {repoHref ? (
              <a className="button" href={repoHref} target="_blank" rel="noreferrer">
                <i className="bi bi-github" aria-hidden="true" />
                Repo
              </a>
            ) : null}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="project-detail-content"
        variants={staggerReveal(0.14, 0.08)}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
      >
        <motion.article className="project-detail-panel" variants={fadeInUp(0.02, 0.72)}>
          <div className="project-detail-panel-heading">
            <Workflow size={20} strokeWidth={1.9} aria-hidden="true" />
            <SplitText as="h2" text="Product Flow" animateBy="chars" delay={26} direction="top" stepDuration={0.5} />
          </div>
          <p>{project.build}</p>
        </motion.article>

        <motion.article className="project-detail-panel" variants={fadeInUp(0.08, 0.72)}>
          <div className="project-detail-panel-heading">
            <Layers3 size={20} strokeWidth={1.9} aria-hidden="true" />
            <SplitText as="h2" text="Stack" animateBy="chars" delay={26} direction="top" stepDuration={0.5} />
          </div>
          <div className="project-detail-stack">
            {project.stack.map((item) => {
              const iconUrl = getTechIconUrl(item)

              return (
                <span className="project-detail-tech-chip" key={item}>
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt=""
                      width="18"
                      height="18"
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : null}
                  {item}
                </span>
              )
            })}
          </div>
          <ul className="project-detail-notes">
            {project.stackNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </motion.article>
      </motion.div>

      <ProjectArchitecture architecture={project.architecture} />

      {hasExtendedDetails ? (
        <motion.div
          className="project-detail-extended"
          variants={staggerReveal(0.12, 0.06)}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
        >
          {project.highlights ? (
            <motion.article className="project-detail-panel" variants={fadeInUp(0.02, 0.72)}>
              <div className="project-detail-panel-heading">
                <ShoppingBag size={20} strokeWidth={1.9} aria-hidden="true" />
                <SplitText
                  as="h2"
                  text={project.highlightsTitle ?? 'Customer Experience'}
                  animateBy="chars"
                  delay={24}
                  direction="top"
                  stepDuration={0.5}
                />
              </div>
              <ul className="project-detail-notes">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.article>
          ) : null}

          {project.adminFeatures ? (
            <motion.article className="project-detail-panel" variants={fadeInUp(0.08, 0.72)}>
              <div className="project-detail-panel-heading">
                <PanelsTopLeft size={20} strokeWidth={1.9} aria-hidden="true" />
                <SplitText
                  as="h2"
                  text={project.adminFeaturesTitle ?? 'Admin Dashboard'}
                  animateBy="chars"
                  delay={24}
                  direction="top"
                  stepDuration={0.5}
                />
              </div>
              <ul className="project-detail-notes">
                {project.adminFeatures.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.article>
          ) : null}

        </motion.div>
      ) : null}
    </section>
  )
}

export default memo(ProjectDetail)
