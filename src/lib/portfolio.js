export const OFFICIAL_INSTAGRAM_URL = 'https://www.instagram.com/theshaib/'

export const DEFAULT_PORTFOLIO = {
  personalInfo: {
    name: 'Zakarya Chaib',
    profession: 'Full-Stack Developer focused on product-grade AI integration.',
    country: 'Morocco',
    age: 18,
    experience: '2+ years',
    completedProjects: '12+',
    cv: 'https://www.linkedin.com/in/zakarya-chaib-dev/',
    tagline: 'Full Stack Developer | AI Integration',
    summary:
      'I build modern interfaces, reliable backend systems, and AI-powered features that feel clear, useful, and ready to scale.',
    focus: ['React and Next.js apps', 'Node.js backends', 'AI agent features', 'Dashboards and internal tools'],
    contactInfo: {
      email: 'theshaib.contact@gmail.com',
      phone: '0694903496',
      whatsapp: 'https://wa.me/212694903496',
      github: 'https://github.com/the-shaiib',
      instagram: OFFICIAL_INSTAGRAM_URL,
      facebook: '',
      linkedin: 'https://www.linkedin.com/in/zakarya-chaib-dev/',
      twitter: 'https://x.com/ChaibZakar8579',
    },
  },
  skills: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Python'],
  metrics: {
    years: 2,
    projects: 12,
    clients: 12,
  },
  projects: [
    {
      title: 'MERN Commerce Platform',
      description: 'Commerce platform with a polished storefront, reliable backend logic, and admin tools built for day-to-day operations.',
      tag: 'Web App',
      year: '2026',
      link: 'https://github.com/the-shaiib',
      repo: 'https://github.com/the-shaiib',
    },
    {
      title: 'AI Python Project',
      description: 'Python-based AI product work focused on practical agents, clear logic, and useful outcomes.',
      tag: 'AI',
      year: '2025',
      link: 'https://github.com/the-shaiib',
      repo: 'https://github.com/the-shaiib',
    },
    {
      title: 'AutoData CSV Pipeline',
      description: 'Agentic AI pipeline focused on AI agents, structured data flow, and faster analysis tools.',
      tag: 'AI',
      year: '2026',
      link: 'https://auto-data-two.vercel.app/',
      repo: 'https://github.com/the-shaiib/AutoData',
    },
  ],
}

function buildSkillList(remoteSkills = {}) {
  const values = [
    ...(remoteSkills.frontend || []),
    ...(remoteSkills.backend || []),
    ...(remoteSkills.database || []),
    ...(remoteSkills.tools || []),
    ...(remoteSkills.specialization || []),
  ]

  return values.length ? [...new Set(values)] : null
}

function normalizeProjects(remoteProjects = []) {
  if (!Array.isArray(remoteProjects) || remoteProjects.length === 0) {
    return null
  }

  return remoteProjects.map((project) => ({
    ...project,
    title: project.title || project.name,
    tag: project.tags?.[0] ?? 'Project',
    year: project.year ?? '2025',
    link: project.link || '#',
    repo: project.repo || project.link || '#',
  }))
}

export function mergePortfolioData(remoteData, current = DEFAULT_PORTFOLIO) {
  if (!remoteData) {
    return current
  }

  const mergedContact = {
    ...current.personalInfo.contactInfo,
    ...(remoteData.personalInfo?.contactInfo || {}),
    ...(remoteData.contactInfo || {}),
  }

  mergedContact.instagram = OFFICIAL_INSTAGRAM_URL

  const mergedPersonalInfo = {
    ...current.personalInfo,
    ...remoteData.personalInfo,
    contactInfo: mergedContact,
  }

  return {
    ...current,
    personalInfo: mergedPersonalInfo,
    skills: buildSkillList(remoteData.skills) || current.skills,
    projects: normalizeProjects(remoteData.projects) || current.projects,
  }
}
