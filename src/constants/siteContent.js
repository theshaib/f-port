export const STACK_ITEMS = [
  {
    name: 'HTML',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    href: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  },
  {
    name: 'CSS',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  },
  {
    name: 'JavaScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  },
  {
    name: 'React.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    href: 'https://react.dev/',
  },
  {
    name: 'Next.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    href: 'https://nextjs.org/',
  },
  {
    name: 'Node.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    href: 'https://nodejs.org/',
  },
  {
    name: 'Express.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
    href: 'https://expressjs.com/',
  },
  {
    name: 'MongoDB',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    href: 'https://www.mongodb.com/',
  },
  {
    name: 'VS Code',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
    href: 'https://code.visualstudio.com/',
  },
  {
    name: 'GitHub',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
    href: 'https://github.com/',
  },
  {
    name: 'Python',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    href: 'https://www.python.org/',
  },
  {
    name: 'Docker',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    href: 'https://www.docker.com/',
  },
  {
    name: 'Git',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    href: 'https://git-scm.com/',
  },
]

export const ORBIT_IMAGES = [
  STACK_ITEMS.find((item) => item.name === 'React.js')?.icon,
  STACK_ITEMS.find((item) => item.name === 'Node.js')?.icon,
  STACK_ITEMS.find((item) => item.name === 'Python')?.icon,
  STACK_ITEMS.find((item) => item.name === 'Docker')?.icon,
  STACK_ITEMS.find((item) => item.name === 'Git')?.icon,
  STACK_ITEMS.find((item) => item.name === 'GitHub')?.icon,
].filter(Boolean)
export { FEATURED_PROJECTS, WEB_PROJECTS, AI_PROJECTS } from './featuredProjects.js'
