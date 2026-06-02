import type {
  AboutData,
  Project,
  Experience,
  Skill,
  Education,
  Certificate,
  ContactLink,
  ServerStatus,
} from "./types"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
const MONITOR_BASE = process.env.NEXT_PUBLIC_MONITOR_URL ?? "http://localhost:4001"

function authHeader(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function apiFetch<T>(method: string, path: string, body?: unknown, auth = false): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(auth ? authHeader() : {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (res.status === 204) return undefined as T
  const data = await res.json()
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Request failed")
  return data as T
}

// Auth
export const login = (username: string, password: string) =>
  apiFetch<{ token: string }>("POST", "/auth/login", { username, password })

// Public reads
export const getAbout = () => apiFetch<AboutData | null>("GET", "/about")
export const getProjects = () => apiFetch<Project[]>("GET", "/projects")
export const getExperience = () => apiFetch<Experience[]>("GET", "/experience")
export const getSkills = () => apiFetch<Skill[]>("GET", "/skills")
export const getEducation = () => apiFetch<Education[]>("GET", "/education")
export const getCertificates = () => apiFetch<Certificate[]>("GET", "/certificates")
export const getContact = () => apiFetch<ContactLink[]>("GET", "/contact")
export async function getServerStatus(): Promise<ServerStatus> {
  const res = await fetch(`${MONITOR_BASE}/api/server-status`)
  if (!res.ok) throw new Error("Monitor offline")
  return res.json() as Promise<ServerStatus>
}

// About (singleton)
export const updateAbout = (data: AboutData) => apiFetch<AboutData>("PUT", "/about", data, true)

// Projects
export const createProject = (data: Omit<Project, "id">) => apiFetch<Project>("POST", "/projects", data, true)
export const updateProject = (id: number, data: Omit<Project, "id">) => apiFetch<Project>("PUT", `/projects/${id}`, data, true)
export const deleteProject = (id: number) => apiFetch<void>("DELETE", `/projects/${id}`, undefined, true)
export const reorderProjects = (items: { id: number; position: number }[]) => apiFetch<void>("PUT", "/projects/reorder", items, true)

// Experience
export const createExperience = (data: Omit<Experience, "id">) => apiFetch<Experience>("POST", "/experience", data, true)
export const updateExperience = (id: number, data: Omit<Experience, "id">) => apiFetch<Experience>("PUT", `/experience/${id}`, data, true)
export const deleteExperience = (id: number) => apiFetch<void>("DELETE", `/experience/${id}`, undefined, true)
export const reorderExperience = (items: { id: number; position: number }[]) => apiFetch<void>("PUT", "/experience/reorder", items, true)

// Skills
export const createSkill = (data: Omit<Skill, "id">) => apiFetch<Skill>("POST", "/skills", data, true)
export const updateSkill = (id: number, data: Omit<Skill, "id">) => apiFetch<Skill>("PUT", `/skills/${id}`, data, true)
export const deleteSkill = (id: number) => apiFetch<void>("DELETE", `/skills/${id}`, undefined, true)
export const reorderSkills = (items: { id: number; position: number }[]) => apiFetch<void>("PUT", "/skills/reorder", items, true)

// Education
export const createEducation = (data: Omit<Education, "id">) => apiFetch<Education>("POST", "/education", data, true)
export const updateEducation = (id: number, data: Omit<Education, "id">) => apiFetch<Education>("PUT", `/education/${id}`, data, true)
export const deleteEducation = (id: number) => apiFetch<void>("DELETE", `/education/${id}`, undefined, true)
export const reorderEducation = (items: { id: number; position: number }[]) => apiFetch<void>("PUT", "/education/reorder", items, true)

// Certificates
export const createCertificate = (data: Omit<Certificate, "id">) => apiFetch<Certificate>("POST", "/certificates", data, true)
export const updateCertificate = (id: number, data: Omit<Certificate, "id">) => apiFetch<Certificate>("PUT", `/certificates/${id}`, data, true)
export const deleteCertificate = (id: number) => apiFetch<void>("DELETE", `/certificates/${id}`, undefined, true)
export const reorderCertificates = (items: { id: number; position: number }[]) => apiFetch<void>("PUT", "/certificates/reorder", items, true)

// Contact
export const createContact = (data: ContactLink) => apiFetch<ContactLink>("POST", "/contact", data, true)
export const updateContact = (id: number, data: ContactLink) => apiFetch<ContactLink>("PUT", `/contact/${id}`, data, true)
export const deleteContact = (id: number) => apiFetch<void>("DELETE", `/contact/${id}`, undefined, true)
