"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { Experience as ExperienceType } from "@/lib/types"

function formatDate(dateStr: string | null) {
  if (!dateStr) return "Present"
  const [year, month] = dateStr.split("-")
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

function ExperienceCard({ exp, index }: { exp: ExperienceType; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const isCurrent = exp.end_date === null

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8"
    >
      {/* Timeline dot */}
      <div className={`absolute left-0 top-2 w-3 h-3 rounded-full border-2 ${isCurrent ? "border-accent bg-accent/30" : "border-white/30 bg-transparent"}`} />

      <div className="glass-card p-5 mb-6 transition-all duration-300">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="text-base font-semibold text-white">{exp.role}</h3>
            <p className="text-accent/80 font-mono text-sm mt-0.5">{exp.company}</p>
          </div>
          <span className="font-mono text-xs text-white/35 whitespace-nowrap">
            {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
            {isCurrent && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-accent bg-accent/10 border border-accent/20">
                Current
              </span>
            )}
          </span>
        </div>
        <p className="text-sm text-white/50 leading-relaxed">{exp.description}</p>
      </div>
    </motion.div>
  )
}

export default function Experience({ data }: { data: ExperienceType[] }) {
  return (
    <section id="experience" data-section="experience" className="px-8 py-24 md:px-16 lg:px-20 scroll-mt-16">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl font-bold text-white whitespace-nowrap">Experience</h2>
        <div className="flex-1 h-px bg-accent/25" />
      </div>

      <div className="relative max-w-3xl">
        {/* Timeline line */}
        <div className="absolute left-[5px] top-2 bottom-6 w-px bg-white/10" />
        {data.map((exp, i) => (
          <ExperienceCard key={exp.id} exp={exp} index={i} />
        ))}
      </div>
    </section>
  )
}
