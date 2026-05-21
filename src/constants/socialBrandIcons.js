import { OFFICIAL_INSTAGRAM_URL } from '../lib/portfolio.js'

export const socialBrandIcons = {
  github: {
    label: 'GitHub',
    icon: 'bi-github',
  },
  linkedin: {
    label: 'LinkedIn',
    icon: 'bi-linkedin',
  },
  instagram: {
    label: 'Instagram',
    icon: 'bi-instagram',
  },
  facebook: {
    label: 'Facebook',
    icon: 'bi-facebook',
  },
  twitter: {
    label: 'X / Twitter',
    icon: 'bi-twitter-x',
  },
  whatsapp: {
    label: 'WhatsApp',
    icon: 'bi-whatsapp',
  },
  email: {
    label: 'Email',
    icon: 'bi-envelope-fill',
  },
}

export const buildSocialItems = (contactInfo) =>
  [
    { key: 'github', href: contactInfo?.github },
    { key: 'linkedin', href: contactInfo?.linkedin },
    { key: 'instagram', href: OFFICIAL_INSTAGRAM_URL },
    { key: 'facebook', href: contactInfo?.facebook },
    { key: 'twitter', href: contactInfo?.twitter },
    { key: 'whatsapp', href: contactInfo?.whatsapp },
    { key: 'email', href: contactInfo?.email ? `mailto:${contactInfo.email}` : '' },
  ]
    .map((item) => ({
      key: item.key,
      href: item.href,
      ...socialBrandIcons[item.key],
    }))
    .filter((item) => item.href)
