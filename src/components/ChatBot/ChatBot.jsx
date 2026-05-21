import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './ChatBot.css'
import { fetchFromApi } from '../../lib/api.js'
import { getApiBaseCandidates } from '../../lib/app-config.js'
import { usePortfolioContext } from '../../context/PortfolioContext.jsx'

const assistantGreeting = "Hi, I'm Zakarya's portfolio agent. Tell me what you're building, or ask me to explain a project, stack, or contact path."
const AI_REPLY_DELAY_MS = 140
const placeholderPrompts = [
  'Ask about Zakarya...',
  'Ask about his skills...',
  'Ask for his social links...',
  'Ask how old is Zakarya...',
  'Ask what he can build with AI...',
]


const assistantIcon = <i className="bi bi-chat-dots-fill" aria-hidden="true" />
const userIcon = <i className="bi bi-person-fill" aria-hidden="true" />

const createWelcomeMessage = () => ({
  id: 'welcome',
  role: 'assistant',
  content: assistantGreeting,
})

const linkifyText = (text) => {
  const pattern = /(mailto:[^\s]+|https?:\/\/[^\s]+)/g
  const parts = String(text).split(pattern)

  return parts.map((part, index) => {
    if (!part) return null

    if (/^mailto:/i.test(part)) {
      const emailLabel = part.replace(/^mailto:/i, '')
      return (
        <a key={`${part}-${index}`} href={part} target="_blank" rel="noreferrer">
          {emailLabel}
        </a>
      )
    }

    if (/^https?:\/\//i.test(part)) {
      return (
        <a key={`${part}-${index}`} href={part} target="_blank" rel="noreferrer">
          {part}
        </a>
      )
    }

    return <span key={`${part}-${index}`}>{part}</span>
  })
}

const renderMessageContent = (content) =>
  String(content)
    .split('\n')
    .map((line, index) => (
      <span key={`line-${index}`} className="chatbot-message-line">
        {linkifyText(line)}
      </span>
    ))

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState(() => [createWelcomeMessage()])
  const [activePromptIndex, setActivePromptIndex] = useState(0)
  const [typedPromptLength, setTypedPromptLength] = useState(0)
  const [isDeletingPrompt, setIsDeletingPrompt] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const bodyRef = useRef(null)
  const { apiBaseUrl } = usePortfolioContext()
  const apiBaseCandidates = useMemo(() => [apiBaseUrl, ...getApiBaseCandidates()].filter((value, index, array) => array.indexOf(value) === index), [apiBaseUrl])

  const wait = useCallback((ms) => new Promise((resolve) => setTimeout(resolve, ms)), [])
  const activePrompt = placeholderPrompts[activePromptIndex]
  const animatedPrompt = activePrompt.slice(0, typedPromptLength)

  useEffect(() => {
    if (!isOpen || !bodyRef.current) return
    bodyRef.current.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [isOpen, messages, prefersReducedMotion])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    syncPreference()
    mediaQuery.addEventListener('change', syncPreference)
    return () => mediaQuery.removeEventListener('change', syncPreference)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return undefined
    if (inputValue.trim()) return undefined

    if (!isDeletingPrompt && typedPromptLength === activePrompt.length) {
      const timeoutId = setTimeout(() => setIsDeletingPrompt(true), 1300)
      return () => clearTimeout(timeoutId)
    }

    if (isDeletingPrompt && typedPromptLength === 0) {
      setIsDeletingPrompt(false)
      setActivePromptIndex((index) => (index + 1) % placeholderPrompts.length)
      return undefined
    }

    const timeoutId = setTimeout(
      () => setTypedPromptLength((length) => length + (isDeletingPrompt ? -1 : 1)),
      isDeletingPrompt ? 28 : 56,
    )

    return () => clearTimeout(timeoutId)
  }, [activePrompt, inputValue, isDeletingPrompt, prefersReducedMotion, typedPromptLength])

  const sendMessage = useCallback(async () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isSending) return
    const historyPayload = messages.map(({ role, content }) => ({ role, content }))

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    }

    setMessages((current) => [...current, userMessage])
    setInputValue('')
    setIsSending(true)

    try {
      const [response] = await Promise.all([
        fetchFromApi(
          '/api/chat',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: trimmed, history: historyPayload }),
          },
          { baseCandidates: apiBaseCandidates },
        ).then(({ response: apiResponse }) => apiResponse),
        wait(AI_REPLY_DELAY_MS),
      ])

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send message')
      }

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data?.reply || 'I could not generate a reply right now.',
        },
      ])
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          content: 'Chat is unavailable right now. You can still browse my projects here or reach me by email and WhatsApp.',
        },
      ])
    } finally {
      setIsSending(false)
    }
  }, [apiBaseCandidates, inputValue, isSending, messages, wait])

  const handleKeyDown = useCallback(async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      await sendMessage()
    }
  }, [sendMessage])

  return (
    <div className={`chatbot ${isOpen ? 'is-open' : ''}`}>
      {isOpen && (
        <section className="chatbot-panel glass animated-border" aria-label="Zakarya chat">
          <header className="chatbot-header">
            <div className="chatbot-title-wrap">
              <span className="chatbot-badge">{assistantIcon}</span>
              <div>
                <strong>Portfolio Agent</strong>
                <p>Projects, stack, contact, and build direction</p>
              </div>
            </div>

            <button
              type="button"
              className="chatbot-close"
              aria-label="Close chatbot"
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          </header>

          <div className="chatbot-body" ref={bodyRef} data-lenis-prevent>
            {messages.map((message) => (
              <article
                key={message.id}
                className={`chatbot-message ${message.role === 'user' ? 'is-user' : 'is-assistant'}`}
              >
                <span className={`chatbot-message-avatar ${message.role === 'user' ? 'is-user' : 'is-assistant'}`}>
                  {message.role === 'user' ? userIcon : assistantIcon}
                </span>
                <div className="chatbot-message-bubble">
                  <p>{renderMessageContent(message.content)}</p>
                </div>
              </article>
            ))}

            {isSending && (
              <article className="chatbot-message is-assistant">
                <span className="chatbot-message-avatar is-assistant">{assistantIcon}</span>
                <div className="chatbot-message-bubble is-loading">
                  <span />
                  <span />
                  <span />
                </div>
              </article>
            )}
          </div>

          <div className="chatbot-input-wrap">
            <label className="sr-only" htmlFor="chatbot-input">
              Message
            </label>
            <div className="chatbot-input-shell">
              <textarea
                id="chatbot-input"
                className="chatbot-input"
                data-lenis-prevent
                rows="1"
                placeholder=""
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
              />
              {!inputValue.trim() && (
                <span className="chatbot-animated-placeholder" aria-hidden="true">
                  {prefersReducedMotion ? placeholderPrompts[0] : animatedPrompt}
                  <span className="chatbot-placeholder-caret" />
                </span>
              )}
            </div>
            <button
              type="button"
              className="chatbot-send"
              aria-label="Send message"
              onClick={sendMessage}
              disabled={!inputValue.trim() || isSending}
            >
              <i className="bi bi-send-fill" aria-hidden="true" />
            </button>
          </div>
        </section>
      )}

      <button
        type="button"
        className="chatbot-toggle"
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="chatbot-toggle-ring" aria-hidden="true" />
        <span className="chatbot-toggle-icon" aria-hidden="true">
          <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'}`} aria-hidden="true" />
        </span>
      </button>
    </div>
  )
}
