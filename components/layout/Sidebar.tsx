"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NAV_ITEMS } from "./nav-items"

interface SidebarProps {
  activeSection: string
}

export default function Sidebar({ activeSection }: SidebarProps) {
  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-48 flex-col border-r border-white/5 bg-black/80 backdrop-blur-md z-40">
      <div className="px-6 py-8">
        <span className="font-mono text-xs text-accent tracking-[0.2em] uppercase">Portfolio</span>
      </div>

      <nav className="flex-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-all duration-200 font-mono text-left cursor-pointer
                ${isActive
                  ? "text-accent bg-accent/10 border border-accent/20 text-glow"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="w-4 h-4 shrink-0"
              />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="px-6 py-6">
        <div className="w-full h-px bg-accent/20" />
        <p className="mt-3 text-xs text-white/20 font-mono">v1.0.0</p>
      </div>
    </aside>
  )
}
