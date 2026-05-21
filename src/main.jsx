import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router.jsx'
import './styles/tokens.css'
import './index.css'

const savedTheme = window.localStorage.getItem('theme')
const initialTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark'

document.documentElement.setAttribute('data-theme', initialTheme)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
