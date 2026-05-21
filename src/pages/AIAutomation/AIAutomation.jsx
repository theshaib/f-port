import { memo } from 'react'
import ProjectCategoryPage from '../ProjectCategory/ProjectCategoryPage.jsx'
import { AI_PROJECTS } from '../../constants/featuredProjects.js'
import { APP_ROUTES } from '../../lib/app-config.js'

function AIAutomation() {
  return (
    <ProjectCategoryPage
      eyebrow="AI Integration"
      title="AI agents and product features built for real operational use."
      description="A practical AI project track for data analysis, workflow support, live processing feedback, and interfaces that make automation understandable instead of mysterious."
      projects={AI_PROJECTS}
      tone="ai"
      switchLabel="Switch to web products"
      switchTo={APP_ROUTES.webProject}
    />
  )
}

export default memo(AIAutomation)
