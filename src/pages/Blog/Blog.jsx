import { memo } from 'react'
import { motion } from '../../lib/motion.jsx'
import { fadeInDown, staggerReveal } from '../../components/Animation/Animation.jsx'
import { FadeReveal, SplitText } from '../../components/animations/index.js'
import './Blog.css'

function Blog() {
  return (
    <section className="blog-page blog-coming-page">
      <motion.div className="blog-head" variants={staggerReveal(0.12, 0.05)} initial="hidden" animate="show">
        <motion.span className="eyebrow" variants={fadeInDown(0.02, 0.58)}>
          Blog
        </motion.span>
        <SplitText
          as="h1"
          text="Notes on building better products."
          animateBy="chars"
          delay={24}
          direction="top"
          stepDuration={0.48}
          className="blog-title"
          textAlign="left"
        />
        <FadeReveal as="p" className="blog-description" delay={0.08} duration={0.72} distance={18}>
          Build notes, product thinking, and practical AI integration insights are coming soon.
        </FadeReveal>
      </motion.div>
    </section>
  )
}

export default memo(Blog)
