"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCertificate, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import type { Certificate as CertificateType } from "@/lib/types"

export default function Certificate({ data }: { data: CertificateType[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="certificate" data-section="certificate" className="px-8 py-24 md:px-16 lg:px-20 scroll-mt-16">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl font-bold text-white whitespace-nowrap">Certificates</h2>
        <div className="flex-1 h-px bg-accent/25" />
      </div>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-5 flex flex-col gap-3 transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0 w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faCertificate} className="w-4 h-4 text-accent" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white leading-snug">{cert.cert_name}</h3>
                <p className="text-xs text-accent/70 font-mono mt-0.5">{cert.issuer}</p>
              </div>
            </div>

            <p className="text-xs text-white/45 leading-relaxed flex-1">{cert.cert_description}</p>

            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <span className="font-mono text-xs text-white/25">
                {new Date(cert.date_issued).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-white/40 hover:text-accent transition-colors"
              >
                Verify
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-2.5 h-2.5" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
