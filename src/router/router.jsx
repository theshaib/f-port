/* eslint-disable react-refresh/only-export-components */
import { Suspense, createElement, lazy } from 'react'
import { Link, Navigate, createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import { RouteErrorState } from '../components/ErrorBoundary/AppErrorBoundary.jsx'
import RouteLoader from '../components/RouteLoader/RouteLoader.jsx'
import { APP_ROUTES, ROUTE_SEGMENTS } from '../lib/app-config.js'
import HomePage from '../pages/Home/Home.jsx'

const BlogPage = lazy(() => import('../pages/Blog/Blog.jsx'))
const CertificationsPage = lazy(() => import('../pages/Certifications/Certifications.jsx'))
const ContactPage = lazy(() => import('../pages/Contact/Contact.jsx'))
const WebDevelopmentPage = lazy(() => import('../pages/WebDevelopment/WebDevelopment.jsx'))
const AIAutomationPage = lazy(() => import('../pages/AIAutomation/AIAutomation.jsx'))
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetail/ProjectDetail.jsx'))

function renderLazyRoute(PageComponent) {
  return <Suspense fallback={<RouteLoader mode="page" />}>{createElement(PageComponent)}</Suspense>
}

function redirectTo(path) {
  return <Navigate replace to={path} />
}

const REDIRECT_ROUTES = [
  { path: ROUTE_SEGMENTS.homeAlias, to: APP_ROUTES.home },
  { path: ROUTE_SEGMENTS.projects, to: APP_ROUTES.webProject },
  { path: 'projects/web', to: APP_ROUTES.webProject },
  { path: 'projects/ai', to: APP_ROUTES.aiProject },
  { path: ROUTE_SEGMENTS.legacyWebProject, to: APP_ROUTES.webProject },
  { path: ROUTE_SEGMENTS.legacyAiProject, to: APP_ROUTES.aiProject },
]

function NotFoundPage() {
  return (
    <section className="status-page">
      <div className="status-card glass">
        <span className="eyebrow">404</span>
        <h1 className="status-title">This page does not exist.</h1>
        <p className="status-copy">The portfolio is live, but this route is not available.</p>
        <div className="status-actions">
          <Link className="button primary" to={APP_ROUTES.home}>
            Return home
          </Link>
        </div>
      </div>
    </section>
  )
}

export const router = createBrowserRouter(
  [
    {
      path: APP_ROUTES.home,
      element: <App />,
      errorElement: <RouteErrorState />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: ROUTE_SEGMENTS.blog,
          element: renderLazyRoute(BlogPage),
        },
        {
          path: ROUTE_SEGMENTS.certifications,
          element: renderLazyRoute(CertificationsPage),
        },
        {
          path: ROUTE_SEGMENTS.contact,
          element: renderLazyRoute(ContactPage),
        },
        {
          path: ROUTE_SEGMENTS.webProject,
          element: renderLazyRoute(WebDevelopmentPage),
        },
        {
          path: ROUTE_SEGMENTS.aiProject,
          element: renderLazyRoute(AIAutomationPage),
        },
        {
          path: ROUTE_SEGMENTS.projectDetail,
          element: renderLazyRoute(ProjectDetailPage),
        },
        ...REDIRECT_ROUTES.map((route) => ({ path: route.path, element: redirectTo(route.to) })),
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)
