/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'

const PortfolioContext = createContext(null)

export function PortfolioProvider({ children, value }) {
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolioContext() {
  const context = useContext(PortfolioContext)

  if (!context) {
    throw new Error('usePortfolioContext must be used within a PortfolioProvider')
  }

  return context
}
