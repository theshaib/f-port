import { buildApiUrl, getApiBaseCandidates } from './app-config.js'

function isAbortError(error) {
  return error?.name === 'AbortError'
}

export async function fetchFromApi(path, init = {}, options = {}) {
  const bases = options.baseCandidates ?? getApiBaseCandidates()
  const failures = []

  for (const baseUrl of bases) {
    try {
      const response = await fetch(buildApiUrl(baseUrl, path), init)

      if (!response.ok) {
        failures.push({ baseUrl, status: response.status })
        continue
      }

      return { baseUrl, response }
    } catch (error) {
      if (isAbortError(error)) {
        throw error
      }

      failures.push({ baseUrl, error })
    }
  }

  const lastFailure = failures.at(-1)
  const requestError = new Error(`Unable to reach ${path}`)
  requestError.failures = failures
  requestError.status = lastFailure?.status
  requestError.cause = lastFailure?.error
  throw requestError
}
