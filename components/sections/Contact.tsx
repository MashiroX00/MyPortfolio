"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGithub,
  faLinkedin,
  faXTwitter,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons"
import { faEnvelope, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import type { ContactLink } from "@/lib/types"

const PLATFORM_ICONS: Record<string, IconDefinition> = {
  github: faGithub,
  linkedin: faLinkedin,
  twitter: faXTwitter,
  x: faXTwitter,
  facebook: faFacebook,
  instagram: faInstagram,
  email: faEnvelope,
}

function getIcon(platform: string): IconDefinition {
  return PLATFORM_ICONS[platform.toLowerCase()] ?? faArrowUpRightFromSquare
}

export default function Contact({ data }: { data: ContactLink[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="contact" data-section="contact" className="px-8 py-24 md:px-16 lg:px-20 scroll-mt-16">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl font-bold text-white whitespace-nowrap">Contact</h2>
        <div className="flex-1 h-px bg-accent/25" />
      </div>

      <div ref={ref} className="max-w-xl">
        <p className="text-white/50 mb-8 leading-relaxed">
          Feel free to reach out — whether it&apos;s a project, collaboration, or just to say hello.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.map((link, i) => (
            <motion.a
              key={link.platform}
              href={link.url}
              target={link.url.startsWith("mailto") ? "_self" : "_blank"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-card flex items-center gap-4 px-5 py-4 group transition-all duration-300 hover:border-accent/30"
            >
              <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <FontAwesomeIcon icon={getIcon(link.platform)} className="w-4 h-4 text-accent" />
              </div>
              <span className="font-mono text-sm text-white/60 group-hover:text-white transition-colors">
                {link.platform}
              </span>
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className="w-3 h-3 text-white/20 group-hover:text-accent/60 ml-auto transition-colors"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
