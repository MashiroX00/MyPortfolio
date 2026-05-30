"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/layout/Sidebar"
import MobileNav from "@/components/layout/MobileNav"
import About from "@/components/sections/About"
import Projects from "@/components/sections/Projects"
import Experience from "@/components/sections/Experience"
import Skills from "@/components/sections/Skills"
import Education from "@/components/sections/Education"
import Certificate from "@/components/sections/Certificate"
import Contact from "@/components/sections/Contact"
import ServerStatus from "@/components/sections/ServerStatus"
import * as api from "@/lib/api"
import type { PortfolioData, ServerStatus as ServerStatusType } from "@/lib/types"

const SECTION_IDS = ["about", "projects", "experience", "skills", "education", "certificate", "contact", "server"]

export default function Home() {
  const [activeSection, setActiveSection] = useState("about")
  const [data, setData] = useState<PortfolioData | null>(null)
  const [serverStatus, setServerStatus] = useState<ServerStatusType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Fetch all portfolio sections in parallel
  useEffect(() => {
    Promise.all([
      api.getAbout(),
      api.getProjects(),
      api.getExperience(),
      api.getSkills(),
      api.getEducation(),
      api.getCertificates(),
      api.getContact(),
    ])
      .then(([about, projects, experience, skills, education, certificates, contact]) => {
        setData({
          about: about ?? { name: "", titles: [], bio: "", photo_url: "" },
          projects,
          experience,
          skills,
          education,
          certificates,
          contact,
        })
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  // Fetch server status independently — refreshes every 30s
  useEffect(() => {
    const fetch = () => api.getServerStatus().then(setServerStatus).catch(() => setServerStatus(null))
    fetch()
    const id = setInterval(fetch, 30_000)
    return () => clearInterval(id)
  }, [])

  // Intersection observer re-runs after data loads (sections not in DOM until then)
  useEffect(() => {
    if (!data) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: "-50% 0px -50% 0px" }
    )
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [data])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dot-grid">
        <p className="font-mono text-xs text-accent/50 tracking-[0.3em] animate-pulse">LOADING...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center dot-grid px-6">
        <div className="w-full max-w-sm glass-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-3 font-mono text-xs text-white/25 tracking-widest">connection — error</span>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
              <span className="font-mono text-sm text-red-400 font-semibold">Backend API Closed</span>
            </div>
            <p className="font-mono text-xs text-white/40 leading-relaxed">
              Please contact Owner directly for information.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar activeSection={activeSection} />
      <MobileNav activeSection={activeSection} />
      <main className="flex-1 md:ml-48">
        <About data={data.about} />
        <Projects data={data.projects} />
        <Experience data={data.experience} />
        <Skills data={data.skills} />
        <Education data={data.education} />
        <Certificate data={data.certificates} />
        <Contact data={data.contact} />
        <ServerStatus data={serverStatus} />
      </main>
    </div>
  )
}
