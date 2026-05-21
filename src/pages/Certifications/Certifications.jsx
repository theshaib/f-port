import { memo } from 'react'
import { ArrowUpRight, BadgeCheck } from 'lucide-react'
import { motion } from '../../lib/motion.jsx'
import { fadeInDown, fadeInScale, fadeInUp, revealViewport, staggerReveal } from '../../components/Animation/Animation.jsx'
import { FadeReveal, SplitText } from '../../components/animations/index.js'
import responsiveCertificate from '../../assets/certif/responsive.png'
import javascriptCertificate from '../../assets/certif/js.png'
import pythonCertificate from '../../assets/certif/py.png'
import './Certifications.css'

const CERTIFICATIONS = [
  {
    title: 'Responsive Web Design',
    issuer: 'freeCodeCamp',
    focus: 'Semantic HTML, CSS layout systems, accessibility, and responsive UI structure.',
    meta: ['HTML', 'CSS', 'Responsive UI'],
    verifyUrl: 'https://freecodecamp.org/certification/zakaryachaib22/responsive-web-design',
    image: responsiveCertificate,
  },
  {
    title: 'JavaScript Algorithms and Data Structures',
    issuer: 'freeCodeCamp',
    focus: 'Core JavaScript, data handling, problem solving, functions, objects, and algorithmic thinking.',
    meta: ['JavaScript', 'Algorithms', 'Data Structures'],
    verifyUrl: 'https://freecodecamp.org/certification/zakaryachaib22/javascript-algorithms-and-data-structures-v8',
    image: javascriptCertificate,
  },
  {
    title: 'Scientific Computing with Python',
    issuer: 'freeCodeCamp',
    focus: 'Python fundamentals, structured computation, data-oriented scripting, and practical automation logic.',
    meta: ['Python', 'Automation', 'Data'],
    verifyUrl: 'https://freecodecamp.org/certification/zakaryachaib22/scientific-computing-with-python-v7',
    image: pythonCertificate,
  },
]

function Certifications() {
  return (
    <section className="certifications-page">
      <motion.div className="certifications-head" variants={staggerReveal(0.12, 0.05)} initial="hidden" animate="show">
        <motion.span className="eyebrow certifications-eyebrow" variants={fadeInDown(0.02, 0.58)}>
          <BadgeCheck size={18} strokeWidth={1.9} aria-hidden="true" />
          Certifications
        </motion.span>
        <SplitText
          as="h1"
          text="Verified learning, applied in real product work."
          animateBy="chars"
          delay={22}
          direction="top"
          stepDuration={0.48}
          className="certifications-title"
        />
        <FadeReveal as="p" className="certifications-description" delay={0.08} duration={0.72} distance={18}>
          Each certificate is directly verifiable and supports the technical foundation behind the work I ship.
        </FadeReveal>
      </motion.div>

      <motion.div
        className="certifications-grid deferred-section"
        variants={staggerReveal(0.14, 0.08)}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
      >
        {CERTIFICATIONS.map((item, index) => (
          <motion.article
            key={item.title}
            className="certification-list-item animated-border"
            variants={fadeInUp(index * 0.08, 0.82)}
          >
            <div className="certification-mark" aria-hidden="true">
              <img src={item.image} alt="" loading="lazy" decoding="async" />
            </div>

            <div className="certification-copy">
              <span className="certification-issuer">{item.issuer}</span>
              <h2>{item.title}</h2>
              <p>{item.focus}</p>
              <div className="certification-tags" aria-label={`${item.title} focus areas`}>
                {item.meta.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            <motion.a
              href={item.verifyUrl}
              className="button certification-verify-btn"
              target="_blank"
              rel="noreferrer"
              aria-label={`Verify ${item.title} certificate`}
              variants={fadeInScale(0.12, 0.9)}
            >
              <span>View certificate</span>
              <ArrowUpRight size={16} strokeWidth={1.9} aria-hidden="true" />
            </motion.a>

          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}

export default memo(Certifications)
