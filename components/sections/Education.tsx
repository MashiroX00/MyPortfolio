"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons"
import type { Education as EducationType } from "@/lib/types"

export default function Education({ data }: { data: EducationType[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="education" data-section="education" className="px-8 py-24 md:px-16 lg:px-20 scroll-mt-16">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl font-bold text-white whitespace-nowrap">Education</h2>
        <div className="flex-1 h-px bg-accent/25" />
      </div>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
        {data.map((edu, i) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-6 flex gap-4 transition-all duration-300"
          >
            <div className="mt-0.5 shrink-0 w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faGraduationCap} className="w-4 h-4 text-accent" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white leading-snug">{edu.school}</h3>
              <p className="text-sm text-accent/80 font-mono">{edu.degree}</p>
              <p className="text-sm text-white/50">Major: {edu.major}</p>
              <p className="font-mono text-xs text-white/30 mt-2">
                {edu.start_year} — {edu.end_year ?? "Present"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
