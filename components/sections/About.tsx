"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown } from "@fortawesome/free-solid-svg-icons"
import type { AboutData } from "@/lib/types"

function TypingAnimation({ texts }: { texts: string[] }) {
  const [display, setDisplay] = useState("")
  const [textIdx, setTextIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIdx]
    const speed = deleting ? 45 : 95

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setDisplay(current.slice(0, charIdx + 1))
          setCharIdx(charIdx + 1)
        } else {
          setTimeout(() => setDeleting(true), 1800)
        }
      } else {
        if (charIdx > 0) {
          setDisplay(current.slice(0, charIdx - 1))
          setCharIdx(charIdx - 1)
        } else {
          setDeleting(false)
          setTextIdx((textIdx + 1) % texts.length)
        }
      }
    }, speed)

    return () => clearTimeout(timeout)
  }, [charIdx, deleting, textIdx, texts])

  return (
    <span className="text-accent font-mono">
      {display}
      <span className="animate-pulse ml-0.5">|</span>
    </span>
  )
}

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }))

    let animId: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 230, 0, ${p.alpha})`
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

interface Props {
  data: AboutData
}

export default function About({ data }: Props) {
  return (
    <section
      id="about"
      data-section="about"
      className="relative min-h-screen flex items-center dot-grid overflow-hidden scroll-mt-16"
    >
      <Particles />

      <div className="relative z-10 w-full px-8 py-24 md:px-16 lg:px-20">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16 max-w-5xl">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 space-y-6"
          >
            <p className="font-mono text-sm text-white/40 tracking-widest uppercase">Hi, I&apos;m</p>

            <h1 className="text-5xl md:text-6xl font-bold text-white text-glow leading-tight">
              {data.name}
            </h1>

            <div className="text-xl md:text-2xl font-mono text-white/60 h-8">
              <TypingAnimation texts={data.titles} />
            </div>

            <p className="text-white/60 leading-relaxed max-w-lg text-base">
              {data.bio}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-black font-semibold font-mono text-sm hover:bg-accent/80 transition-colors"
              >
                View Projects
                <FontAwesomeIcon icon={faArrowDown} className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 rounded-lg border border-white/15 text-white/70 font-mono text-sm hover:border-accent/40 hover:text-white transition-colors"
              >
                Contact Me
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="shrink-0"
          >
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-accent/40 border-glow">
              <Image
                src={data.photo_url}
                alt={data.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
