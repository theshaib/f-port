import { useMemo } from 'react'
import { FEATURED_PROJECTS } from '../../constants/featuredProjects.js'

export const useFeaturedProjects = () => {
  const projects = useMemo(() => FEATURED_PROJECTS, [])

  return { projects, isLoading: false }
}
