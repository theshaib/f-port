import { useCallback, useEffect, useState } from 'react'

const FALLBACK_THEME = 'dark'

function getInitialTheme() {
  if (typeof document === 'undefined') {
    return FALLBACK_THEME
  }

  const savedTheme = window.localStorage.getItem('theme')

  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', savedTheme)
    return savedTheme
  }

  const initialTheme = document.documentElement.getAttribute('data-theme')

  if (initialTheme === 'light' || initialTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', initialTheme)
    return initialTheme
  }

  document.documentElement.setAttribute('data-theme', FALLBACK_THEME)
  return FALLBACK_THEME
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme }
}
