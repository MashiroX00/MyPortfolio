"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import type { Project } from "@/lib/types"

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <h2 className="text-3xl font-bold text-white whitespace-nowrap">{title}</h2>
      <div className="flex-1 h-px bg-accent/25" />
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card overflow-hidden flex flex-col group transition-all duration-300"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.image_url}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
        <p className="text-sm text-white/50 leading-relaxed flex-1">{project.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-xs font-mono text-accent/80 border border-accent/20 bg-accent/5"
            >
              {tech}
            </span>
          ))}
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-mono text-white/50 hover:text-accent transition-colors mt-1 w-fit"
        >
          View Project
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  )
}

export default function Projects({ data }: { data: Project[] }) {
  return (
    <section id="projects" data-section="projects" className="px-8 py-24 md:px-16 lg:px-20 scroll-mt-16">
      <SectionTitle title="Projects" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {data.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
