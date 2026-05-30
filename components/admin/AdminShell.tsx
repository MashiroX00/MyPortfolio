"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser, faCode, faBriefcase, faLayerGroup,
  faGraduationCap, faCertificate, faEnvelope,
  faRightFromBracket, faBars, faXmark,
} from "@fortawesome/free-solid-svg-icons"
import AboutEditor from "./editors/AboutEditor"
import ProjectsEditor from "./editors/ProjectsEditor"
import ExperienceEditor from "./editors/ExperienceEditor"
import SkillsEditor from "./editors/SkillsEditor"
import EducationEditor from "./editors/EducationEditor"
import CertificatesEditor from "./editors/CertificatesEditor"
import ContactEditor from "./editors/ContactEditor"

const SECTIONS = [
  { id: "about",        label: "About",        icon: faUser },
  { id: "projects",     label: "Projects",     icon: faCode },
  { id: "experience",   label: "Experience",   icon: faBriefcase },
  { id: "skills",       label: "Skills",       icon: faLayerGroup },
  { id: "education",    label: "Education",    icon: faGraduationCap },
  { id: "certificates", label: "Certificates", icon: faCertificate },
  { id: "contact",      label: "Contact",      icon: faEnvelope },
] as const

type SectionId = (typeof SECTIONS)[number]["id"]

const EDITORS: Record<SectionId, React.ReactNode> = {
  about:        <AboutEditor />,
  projects:     <ProjectsEditor />,
  experience:   <ExperienceEditor />,
  skills:       <SkillsEditor />,
  education:    <EducationEditor />,
  certificates: <CertificatesEditor />,
  contact:      <ContactEditor />,
}

export default function AdminShell() {
  const router = useRouter()
  const [active, setActive] = useState<SectionId>("about")
  const [menuOpen, setMenuOpen] = useState(false)

  function logout() {
    localStorage.removeItem("admin_token")
    router.push("/admin/login")
  }

  const NavItems = () => (
    <>
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          onClick={() => { setActive(s.id); setMenuOpen(false) }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all duration-150 cursor-pointer
            ${active === s.id
              ? "text-accent bg-accent/10 border border-accent/20"
              : "text-white/40 hover:text-white/70 hover:bg-white/5"
            }`}
        >
          <FontAwesomeIcon icon={s.icon} className="w-4 h-4 shrink-0" />
          <span>{s.label}</span>
        </button>
      ))}
    </>
  )

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-52 flex-col border-r border-white/5 bg-black/90 backdrop-blur-md z-40">
        <div className="px-5 py-5 border-b border-white/5">
          <p className="text-xs text-accent tracking-[0.25em] uppercase">Admin Panel</p>
          <p className="text-white/20 text-xs mt-0.5">portfolio.local</p>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <NavItems />
        </nav>
        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
            <span>Logout</span>
          </button>
          <a
            href="/"
            target="_blank"
            className="mt-1 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/25 hover:text-white/40 transition-colors"
          >
            ↗ View Portfolio
          </a>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-black/90 border-b border-white/5 backdrop-blur-md">
        <p className="text-xs text-accent tracking-[0.2em] uppercase">Admin Panel</p>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white/50 hover:text-white">
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-xl pt-14 px-4 pb-4 flex flex-col gap-1">
          <NavItems />
          <button
            onClick={logout}
            className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-52 pt-14 md:pt-0 min-h-screen">
        <div className="p-6 md:p-8 max-w-4xl">
          {EDITORS[active]}
        </div>
      </main>
    </div>
  )
}
