import { memo } from 'react'
import ProjectCategoryPage from '../ProjectCategory/ProjectCategoryPage.jsx'
import { WEB_PROJECTS } from '../../constants/featuredProjects.js'
import { APP_ROUTES } from '../../lib/app-config.js'

function WebDevelopment() {
  return (
    <ProjectCategoryPage
      eyebrow="Web Products"
      title="Modern web products built with sharp UI and reliable backend logic."
      description="A focused collection of production-style builds: storefronts, clinic websites, admin tools, order flows, and business systems shaped around clear user journeys."
      projects={WEB_PROJECTS}
      tone="web"
      switchLabel="Switch to AI builds"
      switchTo={APP_ROUTES.aiProject}
    />
  )
}

export default memo(WebDevelopment)
