import { memo, useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from '../../lib/motion.jsx'
import { fadeInDown, fadeInUp, staggerReveal } from '../../components/Animation/Animation.jsx'
import { FadeReveal, SplitText } from '../../components/animations/index.js'
import { buildSocialItems } from '../../constants/socialBrandIcons.js'
import { usePortfolioContext } from '../../context/PortfolioContext.jsx'
import './Contact.css'

const EMAILJS_SERVICE_ID = 'service_6qma4wr'
const EMAILJS_TEMPLATE_ID = 'template_e25nuef'
const EMAILJS_PUBLIC_KEY = 'bM1aaEsXBR-lqLir1'

function Contact() {
  const { contactInfo } = usePortfolioContext()
  const navigate = useNavigate()
  const [isSending, setIsSending] = useState(false)
  const [formStatus, setFormStatus] = useState({ type: '', message: '', senderName: '' })
  const socialItems = useMemo(() => buildSocialItems(contactInfo), [contactInfo])
  const socialTrack = useMemo(() => [...socialItems, ...socialItems], [socialItems])
  const directContactItems = useMemo(
    () => socialItems.filter((item) => ['email', 'whatsapp', 'linkedin'].includes(item.key)),
    [socialItems],
  )
  const successFirstName = useMemo(() => {
    const [firstName = 'there'] = (formStatus.senderName || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)

    return firstName
  }, [formStatus.senderName])
  const isSuccessState = formStatus.type === 'success'

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()
      const formElement = event.currentTarget
      const formData = new FormData(formElement)
      const fullName = String(formData.get('full-name') || '').trim()
      const email = String(formData.get('email') || '').trim()
      const message = String(formData.get('message') || '').trim()

      if (!fullName || !email || !message) {
        setFormStatus({
          type: 'error',
          message: 'Please fill in your full name, email, and message.',
          senderName: '',
        })
        return
      }

      setIsSending(true)
      setFormStatus({ type: '', message: '', senderName: '' })

      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_ID,
            user_id: EMAILJS_PUBLIC_KEY,
            template_params: {
              title: 'New portfolio inquiry',
              subject: 'New portfolio inquiry',
              from_name: fullName,
              full_name: fullName,
              user_name: fullName,
              name: fullName,
              from_email: email,
              user_email: email,
              email,
              reply_to: email,
              message,
              user_message: message,
              project_message: message,
              details: message,
              to_email: contactInfo?.email || 'theshaib.contact@gmail.com',
            },
          }),
        })

        if (!response.ok) {
          throw new Error('Email service request failed')
        }

        formElement.reset()
        setFormStatus({
          type: 'success',
          message: 'Your brief is in. I will get back to you soon.',
          senderName: fullName,
        })
      } catch {
        setFormStatus({
          type: 'error',
          message: 'Sending failed. Please try again in a moment.',
          senderName: '',
        })
      } finally {
        setIsSending(false)
      }
    },
    [contactInfo?.email],
  )

  return (
    <section className="contact-page">
      <motion.div className="contact-page-hero" variants={staggerReveal(0.12, 0.04)} initial="hidden" animate="show">
        <motion.div className="eyebrow" variants={fadeInDown(0.02, 0.62)}>
          Contact
        </motion.div>
        <SplitText
          as="h1"
          text="Let's turn the idea into a product people can use."
          delay={22}
          animateBy="chars"
          direction="top"
          stepDuration={0.48}
          className="contact-page-title"
        />
        <FadeReveal as="p" className="contact-page-description" delay={0.08} duration={0.72} distance={18}>
          Send the goal, the audience, and the next milestone. I will help shape the path from there.
        </FadeReveal>
      </motion.div>

      <motion.div
        className="contact-shell"
        variants={staggerReveal(0.14, 0.08)}
        initial="hidden"
        animate="show"
      >
        <motion.div className="contact-side-panel" variants={fadeInUp(0.04, 0.82)}>
          <motion.div className="contact-side-copy" variants={staggerReveal(0.08, 0.04)}>
            <motion.span className="eyebrow" variants={fadeInDown(0.02, 0.56)}>
              Brief
            </motion.span>
            <SplitText
              as="h2"
              text="Clear beats complicated."
              animateBy="chars"
              delay={26}
              direction="top"
              stepDuration={0.42}
              className="contact-side-title"
            />
            <FadeReveal as="p" className="contact-side-description" delay={0.04} duration={0.68} distance={16}>
              A short overview is enough: what you are building, who it is for, and where AI or product logic needs to fit.
            </FadeReveal>
          </motion.div>

          {directContactItems.length ? (
            <motion.div className="contact-direct-links" variants={fadeInUp(0.14, 0.64)}>
              {directContactItems.map((item) => (
                <a
                  key={item.key}
                  className="contact-direct-link"
                  href={item.href}
                  target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                >
                  <span className="contact-direct-icon">
                    <i className={`bi ${item.icon}`} aria-hidden="true" />
                  </span>
                  <span className="contact-direct-copy">
                    <span className="contact-direct-label">{item.label}</span>
                    <span className="contact-direct-meta">
                      {item.key === 'email' ? 'Main inbox' : item.key === 'whatsapp' ? 'Fast reply' : 'Work profile'}
                    </span>
                  </span>
                  <i className="bi bi-arrow-up-right contact-direct-arrow" aria-hidden="true" />
                </a>
              ))}
            </motion.div>
          ) : null}
        </motion.div>

        <motion.form
          className={`contact-form-card ${isSuccessState ? 'is-success' : ''}`}
          onSubmit={handleSubmit}
          variants={fadeInUp(0.06, 0.82)}
        >
          {isSuccessState ? (
            <motion.div
              key="contact-success"
              className="contact-success-panel"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="contact-success-badge-wrap" aria-hidden="true">
                <span className="contact-success-ring" />
                <span className="contact-success-ring contact-success-ring--delayed" />
                <span className="contact-success-badge">
                  <i className="bi bi-check2" />
                </span>
              </div>

              <div className="contact-success-copy">
                <span className="eyebrow">Brief Sent</span>
                <SplitText
                  as="h2"
                  text={`Brief received, ${successFirstName}.`}
                  animateBy="chars"
                  delay={26}
                  direction="top"
                  stepDuration={0.4}
                  className="contact-success-title"
                />
                <p className="contact-success-text">{formStatus.message}</p>
              </div>

              <div className="contact-success-meta">
                <span>
                  <i className="bi bi-patch-check-fill" aria-hidden="true" />
                  Delivery confirmed
                </span>
                <span>
                  <i className="bi bi-reply-fill" aria-hidden="true" />
                  Reply on the way
                </span>
              </div>

              <div className="contact-actions contact-actions-success">
                <button type="button" className="button primary" onClick={() => setFormStatus({ type: '', message: '', senderName: '' })}>
                  <i className="bi bi-arrow-repeat" aria-hidden="true" />
                  Send another brief
                </button>
                <button type="button" className="button" onClick={() => navigate('/')}>
                  <i className="bi bi-arrow-left" aria-hidden="true" />
                  Return home
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div className="contact-form-head" variants={staggerReveal(0.08, 0.04)}>
                <motion.span className="eyebrow" variants={fadeInDown(0.02, 0.58)}>
                  Brief
                </motion.span>
                <SplitText
                  as="h2"
                  text="Share the essentials and the goal."
                  animateBy="chars"
                  delay={26}
                  direction="top"
                  stepDuration={0.42}
                />
              </motion.div>

              <motion.div className="contact-field-grid" variants={fadeInUp(0.1, 0.58)}>
                <div className="contact-field">
                  <input type="text" name="full-name" placeholder="Full name" aria-label="Full name" />
                </div>

                <div className="contact-field">
                  <input type="email" name="email" placeholder="Email address" aria-label="Email address" />
                </div>
              </motion.div>

              <motion.div className="contact-field contact-field-message" variants={fadeInUp(0.18, 0.58)}>
                <textarea
                  name="message"
                  rows="7"
                  placeholder="What are you building, who is it for, and where should AI or product logic help most?"
                  aria-label="Project message"
                />
              </motion.div>

              <motion.div className="contact-actions" variants={fadeInUp(0.22, 0.62)}>
                <button type="submit" className="button primary" disabled={isSending}>
                  <i className="bi bi-send-fill" aria-hidden="true" />
                  {isSending ? 'Sending...' : 'Send project brief'}
                </button>
                <button type="button" className="button" onClick={() => navigate('/')}>
                  <i className="bi bi-arrow-left" aria-hidden="true" />
                  Return home
                </button>
              </motion.div>

              {formStatus.message && formStatus.type === 'error' ? (
                <motion.p
                  key={formStatus.message}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="contact-form-status is-error"
                >
                  {formStatus.message}
                </motion.p>
              ) : null}
            </>
          )}
        </motion.form>

        {socialTrack.length ? (
          <motion.div className="contact-socials deferred-section" variants={fadeInUp(0.14, 0.82)}>
            <motion.div className="contact-socials-head" variants={fadeInDown(0.02, 0.56)}>
              <motion.span className="eyebrow" variants={fadeInDown(0.02, 0.56)}>
                Connect
              </motion.span>
            </motion.div>

            <motion.div className="contact-social-marquee" variants={fadeInUp(0.1, 0.68)}>
              <div className="contact-social-track">
                {socialTrack.map((item, index) => (
                  <a
                    key={`${item.label}-${index}`}
                    className="contact-social-link"
                    href={item.href}
                    target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                  >
                    <span className="contact-social-icon">
                      <i className={`bi ${item.icon}`} aria-hidden="true" />
                    </span>
                    <span className="contact-social-label">{item.label}</span>
                    <i className="bi bi-arrow-up-right contact-social-arrow" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  )
}

export default memo(Contact)
