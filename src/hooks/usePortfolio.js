import { useEffect, useMemo, useState } from 'react'
import { getApiBaseCandidates, getApiBaseUrl } from '../lib/app-config.js'
import { fetchFromApi } from '../lib/api.js'
import { DEFAULT_PORTFOLIO, mergePortfolioData } from '../lib/portfolio.js'

let cachedPortfolioSnapshot = null
let portfolioRequestPromise = null

function createFallbackSnapshot() {
  return {
    apiBaseUrl: getApiBaseUrl(),
    apiState: 'fallback',
    portfolio: DEFAULT_PORTFOLIO,
  }
}

async function loadPortfolioSnapshot(apiBaseCandidates) {
  if (cachedPortfolioSnapshot) {
    return cachedPortfolioSnapshot
  }

  if (!portfolioRequestPromise) {
    portfolioRequestPromise = (async () => {
      try {
        const { baseUrl, response } = await fetchFromApi(
          '/api/portfolio',
          {
            cache: 'no-store',
          },
          { baseCandidates: apiBaseCandidates },
        )
        const remoteData = await response.json()
        const snapshot = {
          apiBaseUrl: baseUrl,
          apiState: 'connected',
          portfolio: mergePortfolioData(remoteData, DEFAULT_PORTFOLIO),
        }

        cachedPortfolioSnapshot = snapshot
        return snapshot
      } catch {
        const snapshot = createFallbackSnapshot()
        cachedPortfolioSnapshot = snapshot
        return snapshot
      } finally {
        portfolioRequestPromise = null
      }
    })()
  }

  return portfolioRequestPromise
}

export function usePortfolio() {
  const cachedSnapshot = cachedPortfolioSnapshot
  const [portfolio, setPortfolio] = useState(() => cachedSnapshot?.portfolio ?? DEFAULT_PORTFOLIO)
  const [status, setStatus] = useState(() => (cachedSnapshot ? 'ready' : 'loading'))
  const [apiBaseUrl, setApiBaseUrl] = useState(() => cachedSnapshot?.apiBaseUrl ?? getApiBaseUrl())
  const [apiState, setApiState] = useState(() => cachedSnapshot?.apiState ?? 'fallback')
  const apiBaseCandidates = useMemo(() => getApiBaseCandidates(), [])

  useEffect(() => {
    let isCancelled = false

    async function loadPortfolio() {
      if (!cachedPortfolioSnapshot) {
        setStatus('loading')
      }

      const snapshot = await loadPortfolioSnapshot(apiBaseCandidates)

      if (isCancelled) {
        return
      }

      setPortfolio(snapshot.portfolio)
      setApiBaseUrl(snapshot.apiBaseUrl)
      setApiState(snapshot.apiState)
      setStatus('ready')
    }

    void loadPortfolio()

    return () => {
      isCancelled = true
    }
  }, [apiBaseCandidates])

  return useMemo(
    () => ({
      apiBaseUrl,
      apiState,
      contactInfo: portfolio.personalInfo.contactInfo,
      personalInfo: portfolio.personalInfo,
      portfolio,
      status,
    }),
    [apiBaseUrl, apiState, portfolio, status],
  )
}
