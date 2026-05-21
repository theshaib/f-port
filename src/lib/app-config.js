export const APP_ROUTES = {
  home: '/',
  homeAlias: '/home',
  blog: '/blog',
  certifications: '/certifications',
  contact: '/contact',
  projects: '/projects',
  projectDetail: '/projects/:slug',
  webProject: '/projects/web-project',
  aiProject: '/projects/ai-project',
}

export const ROUTE_SEGMENTS = {
  homeAlias: 'home',
  blog: 'blog',
  certifications: 'certifications',
  contact: 'contact',
  projects: 'projects',
  projectDetail: 'projects/:slug',
  webProject: 'projects/web-project',
  aiProject: 'projects/ai-project',
  legacyWebProject: 'projects/web-development',
  legacyAiProject: 'projects/ai-automation',
}

export const LEGACY_ROUTE_MAP = {
  '/projects/web-development': APP_ROUTES.webProject,
  '/projects/ai-automation': APP_ROUTES.aiProject,
}

export const LOCAL_API_ORIGIN = 'http://localhost:5000'
export const REMOTE_API_ORIGIN = 'https://the-shaib-web.onrender.com'

function normalizeOrigin(origin = '') {
  return origin.replace(/\/$/, '')
}

export function getApiBaseCandidates() {
  const envUrl = import.meta.env.VITE_API_URL?.trim()

  if (envUrl) {
    return [normalizeOrigin(envUrl)]
  }

  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1'

    if (isLocalHost) {
      return [REMOTE_API_ORIGIN]
    }

    return [...new Set([normalizeOrigin(origin), REMOTE_API_ORIGIN])]
  }

  return [REMOTE_API_ORIGIN]
}

export function getApiBaseUrl() {
  return getApiBaseCandidates()[0] ?? ''
}

export function buildApiUrl(baseUrl, path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (!baseUrl) {
    return normalizedPath
  }

  return `${normalizeOrigin(baseUrl)}${normalizedPath}`
}
