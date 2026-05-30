"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { Skill } from "@/lib/types"

function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})
}

export default function Skills({ data }: { data: Skill[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const grouped = groupByCategory(data)

  return (
    <section id="skills" data-section="skills" className="px-8 py-24 md:px-16 lg:px-20 scroll-mt-16">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl font-bold text-white whitespace-nowrap">Skills</h2>
        <div className="flex-1 h-px bg-accent/25" />
      </div>

      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Object.entries(grouped).map(([category, skills], catIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: catIdx * 0.1 }}
            className="glass-card p-5"
          >
            <h3 className="font-mono text-xs text-accent tracking-widest uppercase mb-4">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 rounded-full text-sm text-white/70 border border-white/10 bg-white/5 hover:border-accent/30 hover:text-white/90 transition-colors"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
