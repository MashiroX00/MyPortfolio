export interface AboutData {
  name: string
  titles: string[]
  bio: string
  photo_url: string
}

export interface Project {
  id: number
  title: string
  description: string
  tech_stack: string[]
  url: string
  image_url: string
  position: number
}

export interface Experience {
  id: number
  company: string
  role: string
  start_date: string
  end_date: string | null
  description: string
  position: number
}

export interface Skill {
  id: number
  name: string
  category: string
  position: number
}

export interface Education {
  id: number
  school: string
  degree: string
  major: string
  start_year: number
  end_year: number | null
  position: number
}

export interface Certificate {
  id: number
  cert_name: string
  cert_description: string
  issuer: string
  date_issued: string
  url: string
  position: number
}

export interface ContactLink {
  platform: string
  url: string
}

export interface ServerStatus {
  active: boolean
  uptime_seconds: number
  os_name: string
  cpu_usage: number
  ram_total_gb: number
  ram_used_gb: number
  disk_total_gb: number
  disk_used_gb: number
}

export interface PortfolioData {
  about: AboutData
  projects: Project[]
  experience: Experience[]
  skills: Skill[]
  education: Education[]
  certificates: Certificate[]
  contact: ContactLink[]
}
