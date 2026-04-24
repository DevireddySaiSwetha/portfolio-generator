export interface Skill {
  category: string
  items: string[]
}

export interface Experience {
  role: string
  company: string
  period: string
  bullets: string[]
}

export interface Education {
  degree: string
  school: string
  year: string
}

export interface Project {
  title: string
  description: string
  gradient: string
  link?: string
}

export type PortfolioStyle = 'minimal' | 'techy' | 'creative' | 'bold'
export type BgTheme = 'space' | 'geometric' | 'waves' | 'abstract'

export interface PortfolioData {
  name: string
  title: string
  summary: string
  initials: string
  email: string
  phone?: string
  github?: string
  linkedin?: string
  skills: Skill[]
  experience: Experience[]
  education: Education[]
  projects: Project[]
  style: PortfolioStyle
  bgTheme: BgTheme
  bgImageUrl?: string
}

export interface Portfolio {
  id: string
  user_id: string
  slug: string
  portfolio_json: PortfolioData
  bg_image_url?: string
  status: 'draft' | 'published'
  live_url?: string
  created_at: string
  updated_at: string
}
