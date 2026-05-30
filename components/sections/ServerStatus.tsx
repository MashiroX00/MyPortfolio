"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { ServerStatus } from "@/lib/types"

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (days > 0) return `${days}d ${hours}h ${mins}m`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

function MetricBar({
  label,
  used,
  total,
  unit,
  isPercent = false,
  delay,
  inView,
}: {
  label: string
  used: number
  total: number
  unit: string
  isPercent?: boolean
  delay: number
  inView: boolean
}) {
  const pct = Math.min((used / total) * 100, 100)
  const barColor =
    pct > 85 ? "#ef4444" : pct > 65 ? "#f59e0b" : "#FFE600"
  const valueStr = isPercent
    ? `${used.toFixed(0)}%`
    : `${used.toFixed(1)} / ${total} ${unit}`

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-white/40 tracking-widest uppercase">{label}</span>
        <span className="tabular-nums" style={{ color: barColor }}>
          {valueStr}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay }}
        />
      </div>
    </div>
  )
}

function BlinkingCursor() {
  return (
    <motion.span
      className="inline-block w-2 h-4 bg-accent align-middle ml-1"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
    />
  )
}

export default function ServerStatus({ data }: { data: ServerStatus | null }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  const isOnline = data !== null && data.active

  return (
    <section
      id="server"
      data-section="server"
      className="px-8 py-24 md:px-16 lg:px-20 scroll-mt-16"
    >
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl font-bold text-white whitespace-nowrap">Server</h2>
        <div className="flex-1 h-px bg-accent/25" />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-lg"
      >
        <div className="glass-card overflow-hidden border border-white/10 hover:border-accent/20 transition-colors duration-300">

          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-3 font-mono text-xs text-white/25 tracking-[0.2em] uppercase">
              backend_server — status
            </span>
          </div>

          <div className="p-6 space-y-5 font-mono text-sm">

            {/* Prompt line */}
            <div className="text-white/25 text-xs">
              <span className="text-accent/60">root@homelab</span>
              <span className="text-white/40">:~$ </span>
              <span className="text-white/50">systemctl status portfolio-api</span>
              <BlinkingCursor />
            </div>

            {/* Status row */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <p className="text-xs text-white/30 tracking-widest uppercase">Status</p>
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                      </span>
                      <span className="text-green-400 font-semibold tracking-wide">ONLINE</span>
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                      <span className="text-red-400 font-semibold tracking-wide">OFFLINE</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-white/30 tracking-widest uppercase">Uptime</p>
                <p className={isOnline ? "text-accent tabular-nums" : "text-white/20"}>
                  {isOnline ? formatUptime(data!.uptime_seconds) : "—"}
                </p>
              </div>

              <div className="space-y-1 col-span-2">
                <p className="text-xs text-white/30 tracking-widest uppercase">OS</p>
                <p className={isOnline ? "text-white/70" : "text-white/20"}>
                  {isOnline ? data!.os_name : "Unreachable — contact Owner directly"}
                </p>
              </div>
            </div>

            {/* Metrics — only shown when online */}
            {isOnline && (
              <>
                <div className="w-full h-px bg-white/5" />
                <div className="space-y-4">
                  <MetricBar label="CPU" used={data!.cpu_usage} total={100} unit="%" isPercent delay={0.2} inView={isInView} />
                  <MetricBar label="RAM" used={data!.ram_used_gb} total={data!.ram_total_gb} unit="GB" delay={0.4} inView={isInView} />
                  <MetricBar label="DISK" used={data!.disk_used_gb} total={data!.disk_total_gb} unit="GB" delay={0.6} inView={isInView} />
                </div>
              </>
            )}

          </div>
        </div>
      </motion.div>
    </section>
  )
}
