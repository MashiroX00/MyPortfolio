"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons"
import { NAV_ITEMS } from "./nav-items"

interface MobileNavProps {
  activeSection: string
}

export default function MobileNav({ activeSection }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = (id: string) => {
    setIsOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    }, 150)
  }

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 text-white/70 hover:text-accent hover:border-accent/30 transition-colors"
        aria-label="Toggle navigation"
      >
        <FontAwesomeIcon icon={isOpen ? faXmark : faBars} className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-64 z-50 bg-black/95 border-r border-white/10 backdrop-blur-xl"
            >
              <div className="px-6 pt-16 pb-8">
                <span className="font-mono text-xs text-accent tracking-[0.2em] uppercase">Portfolio</span>
              </div>

              <div className="px-3">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 text-sm transition-all duration-200 font-mono text-left cursor-pointer
                        ${isActive
                          ? "text-accent bg-accent/10 border border-accent/20"
                          : "text-white/50 hover:text-white/80 hover:bg-white/5"
                        }`}
                    >
                      <FontAwesomeIcon icon={item.icon} className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
