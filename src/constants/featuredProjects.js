import ecomImage from '../assets/ecom.png'
import clinicImage from '../assets/clinic.png'
import autodataImage from '../assets/autodata.png'

export const WEB_PROJECTS = [
  {
    slug: 'casawave',
    title: 'CasaWave Ecommerce Website',
    stack: ['React 19', 'Vite 7.3', 'React Router 7', 'Node.js', 'Express 5.2', 'MongoDB', 'JWT', 'bcrypt'],
    description: 'A full-stack clothing commerce platform with a polished storefront, order tracking, and a protected admin dashboard.',
    details:
      'CasaWave is a modern e-commerce platform for a clothing brand, shaped around a smooth shopping experience and a practical admin workflow.',
    build:
      'Customers browse and search products, inspect detailed pages with multiple images, choose size and quantity, checkout with contact and location details, then track orders by email. Admins log in securely, manage products, archive orders, upload the homepage hero image, and customize site settings.',
    stackNotes: [
      'Frontend: React 19, Vite 7.3, React Router 7, Axios 1.13, and CSS3.',
      'Backend: Node.js, Express 5.2, MongoDB, Mongoose 9.2, JWT, and bcrypt.',
      'Database models cover admins, products, orders, and homepage site settings.',
    ],
    highlights: [
      'Browse and search products by category with responsive product cards.',
      'Product detail pages support images, S/M/L/XL sizing, quantity selection, and clear item descriptions.',
      'Checkout collects customer email, phone, and location, with order tracking by email after purchase.',
      'Admin dashboard supports secure passcode login, product creation, product removal, order archiving, and homepage hero image upload.',
    ],
    adminFeatures: [
      'Secure JWT login with bcrypt-hashed passcode and protected admin routes.',
      'Add products with multiple images and available sizes.',
      'View, manage, and archive customer orders.',
      'Update site settings, including the homepage hero image, with validation and sanitized inputs.',
    ],
    architecture: {
      steps: [
        { title: 'Frontend', subtitle: 'Store UI - Admin Dashboard - Order Tracking', tone: 'purple' },
        { title: 'Express API', subtitle: 'Products - Orders - Admin - Settings', tone: 'green' },
        { title: 'Services', subtitle: 'Product CRUD - Orders - Auth - Hero media', tone: 'green' },
        { title: 'MongoDB', subtitle: 'Products - Orders - Admin - Settings', tone: 'blue' },
        { title: 'Production', subtitle: 'Render deployment', tone: 'slate' },
      ],
      frontend: {
        title: 'Frontend - React 19 + Vite',
        subtitle: 'Store UI - Admin Dashboard - Order Tracking',
      },
      pages: [
        { title: 'Store Pages', subtitle: 'Home - Products - Details - Checkout' },
        { title: 'Customer Flow', subtitle: 'Size - Quantity - Contact - Location' },
        { title: 'Admin Pages', subtitle: 'Login - Products - Orders - Settings' },
        { title: 'Tracking', subtitle: 'Order lookup by email' },
      ],
      api: {
        title: 'API Layer - Express 5.2',
        subtitle: '/api/products - /api/orders - /api/admin - /api/site-settings',
      },
      services: [
        { title: 'Product Service', subtitle: 'CRUD - Sizes - Multiple images' },
        { title: 'Order Service', subtitle: 'Create - View - Archive' },
        { title: 'Auth & Security', subtitle: 'JWT - bcrypt - protected routes' },
        { title: 'Site Settings', subtitle: 'Homepage hero image - brand config' },
      ],
      persistence: [
        { title: 'MongoDB + Mongoose', subtitle: 'Products - Orders - Admin - Settings', tone: 'blue' },
        { title: 'Image Storage', subtitle: 'Product images - Hero media', tone: 'slate' },
      ],
      deploy: {
        title: 'Production - Render',
        subtitle: 'Server serves optimized client build',
      },
    },
    tag: 'E-commerce',
    image: ecomImage,
    demo: 'https://casawave-official.onrender.com/',
    repo: 'https://github.com/the-shaiib/casawave-app',
    width: 1366,
    height: 768,
  },
  {
    slug: 'clinic',
    title: 'Dental Clinic Website',
    stack: ['React 19', 'Vite', 'React Router 7', 'Framer Motion', 'TanStack Query', 'Axios', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'bcryptjs'],
    description: 'A full-stack dental clinic website with service pages, appointment requests, gallery content, and a protected admin dashboard.',
    details:
      'Dental Clinic is a modern clinic website designed to present services, build patient trust, and manage appointment requests through an intuitive admin dashboard.',
    build:
      'Visitors explore services, clinic information, before-and-after cases, reviews, and appointment forms. Submitted requests move through an Express API into MongoDB, while admins use JWT-protected dashboard tools to review requests, delete processed items, and manage credentials.',
    stackNotes: [
      'Frontend: React 19 with Vite, React Router v7, Framer Motion, TanStack Query, Axios, and loading skeleton states.',
      'Backend: Node.js, Express, MongoDB, Mongoose, JWT authentication, bcryptjs password hashing, CORS, and environment-based configuration.',
      'Database models cover admin users, contact requests, dental services, gallery items, and before/after cases.',
    ],
    highlightsTitle: 'Public Experience',
    highlights: [
      'Home page presents hero content, services, before/after gallery, reviews, and clinic information.',
      'Clinic and services pages explain facilities, dental professionals, opening hours, descriptions, and pricing.',
      'Contact flow collects patient details and service selection for appointment requests.',
      'Gallery uses before/after transformation cases and optimized lazy-loaded clinic images.',
    ],
    adminFeaturesTitle: 'Admin Dashboard',
    adminFeatures: [
      'Secure JWT login with admin credentials and protected admin routes.',
      'View appointment requests with patient contact details and requested service context.',
      'Delete processed or spam requests from the dashboard.',
      'Change admin password securely with validation, error states, and API fallbacks.',
    ],
    architecture: {
      steps: [
        { title: 'Frontend', subtitle: 'Clinic pages - Forms - Gallery', tone: 'purple' },
        { title: 'Express API', subtitle: 'Auth - Requests - Services - Gallery', tone: 'green' },
        { title: 'Admin Flow', subtitle: 'JWT login - Request management - Password update', tone: 'green' },
        { title: 'MongoDB', subtitle: 'Users - Requests - Services - Gallery', tone: 'blue' },
        { title: 'Deployment', subtitle: 'Vercel frontend - Render backend', tone: 'slate' },
      ],
    },
    tag: 'Healthcare',
    image: clinicImage,
    demo: 'https://clinic-dental-six.vercel.app/',
    repo: 'https://github.com/the-shaiib/clinic-dental',
    width: 1366,
    height: 768,
  },
]

export const AI_PROJECTS = [
  {
    slug: 'autodata',
    title: 'AutoData CSV Pipeline',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'Python 3.10+', 'Pandas', 'CrewAI', 'LangChain', 'OpenAI', 'Docker', 'Pytest'],
    description: 'An AI-powered CSV analysis tool that profiles datasets, streams processing logs, and returns clean, analysis-ready insights.',
    details:
      'AutoData is an intelligent CSV analysis pipeline that reads uploaded datasets, extracts structure and quality signals, and prepares executive summaries in real time.',
    build:
      'Users upload a CSV through the frontend, watch live processing logs through Server-Sent Events, and receive dataset stats, schema, preview rows, quality assessment, and optional AI-generated summaries from a CrewAI and OpenAI pipeline.',
    stackNotes: [
      'Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS, upload UI, result cards, schema display, preview table, and EventSource live logs.',
      'Backend: FastAPI, Python 3.10+, Pydantic, Pandas, ydata-profiling, SSE endpoints, and graceful fallback when AI configuration is unavailable.',
      'AI layer: CrewAI agents, LangChain OpenAI, and OpenAI models generate cleaning strategy, schema guidance, and executive summaries.',
    ],
    highlightsTitle: 'Analysis Experience',
    highlights: [
      'CSV dropzone supports drag-and-drop or file picker upload from the homepage.',
      'Backend profiles row counts, columns, data types, preview rows, business category, and quality signals.',
      'Live logs stream processing status to the frontend through Server-Sent Events.',
      'Results render as cards, JSON schema, preview table, quality verdict, and structured summary.',
    ],
    adminFeaturesTitle: 'Pipeline Services',
    adminFeatures: [
      'FastAPI validates CSV uploads, stores temporary files, and returns typed response models.',
      'Pandas performs deterministic profiling, issue detection, type checks, and local cleaning signals.',
      'CrewAI can run analyzer, cleaning strategist, schema specialist, and executive summary agents.',
      'Docker Compose runs frontend and backend together with configurable API and CORS environment variables.',
    ],
    architecture: {
      steps: [
        { title: 'Frontend', subtitle: 'Upload UI - Logs - Result cards', tone: 'purple' },
        { title: 'FastAPI', subtitle: '/api/upload - /api/stream-logs - /docs', tone: 'green' },
        { title: 'CSV Analysis', subtitle: 'Profiling - Quality - Domain detection', tone: 'green' },
        { title: 'AI Pipeline', subtitle: 'CrewAI - LangChain - OpenAI', tone: 'blue' },
        { title: 'Deployment', subtitle: 'Frontend on Vercel - backend on Render', tone: 'slate' },
      ],
    },
    tag: 'AI Project',
    image: autodataImage,
    demo: 'https://auto-data-two.vercel.app/',
    repo: 'https://github.com/the-shaiib/AutoData',
    blog: '#case-study',
    width: 1366,
    height: 768,
  },
]

export const FEATURED_PROJECTS = [...WEB_PROJECTS, ...AI_PROJECTS]
