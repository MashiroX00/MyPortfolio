"use client"

import { useEffect, useState } from "react"
import { getAbout, updateAbout } from "@/lib/api"
import type { AboutData } from "@/lib/types"

const empty: AboutData = { name: "", titles: [], bio: "", photo_url: "" }

export default function AboutEditor() {
  const [form, setForm] = useState<AboutData>(empty)
  const [titlesRaw, setTitlesRaw] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    getAbout().then((data) => {
      if (data) {
        setForm(data)
        setTitlesRaw(data.titles.join(", "))
      }
    }).finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg("")
    try {
      await updateAbout({ ...form, titles: titlesRaw.split(",").map((t) => t.trim()).filter(Boolean) })
      setMsg("Saved ✓")
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-white/30 text-sm">Loading...</p>

  return (
    <div>
      <SectionHeader title="About" />
      <form onSubmit={handleSave} className="glass-card p-6 space-y-4">
        <Field label="Name">
          <Input value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Your Name" />
        </Field>
        <Field label="Titles (comma-separated, used in typing animation)">
          <Input value={titlesRaw} onChange={setTitlesRaw} placeholder="Full Stack Developer, UI Designer" />
        </Field>
        <Field label="Bio">
          <Textarea value={form.bio} onChange={(v) => setForm({ ...form, bio: v })} rows={4} placeholder="Short bio..." />
        </Field>
        <Field label="Photo URL">
          <Input value={form.photo_url ?? ""} onChange={(v) => setForm({ ...form, photo_url: v })} placeholder="https://..." />
        </Field>
        <div className="flex items-center gap-3 pt-2">
          <SaveButton saving={saving} />
          {msg && <span className={`text-xs ${msg.includes("✓") ? "text-green-400" : "text-red-400"}`}>{msg}</span>}
        </div>
      </form>
    </div>
  )
}

// ── Shared UI helpers (local to admin editors) ──────────────────────────────

export function SectionHeader({ title, onAdd }: { title: string; onAdd?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="w-24 h-px bg-accent/25" />
      </div>
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-black text-xs font-semibold hover:bg-accent/80 transition-colors cursor-pointer">
          + Add New
        </button>
      )}
    </div>
  )
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-accent/70 tracking-widest uppercase">{label}</label>
      {children}
    </div>
  )
}

export function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-accent/50 placeholder:text-white/20"
    />
  )
}

export function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-accent/50 placeholder:text-white/20 resize-none"
    />
  )
}

export function SaveButton({ saving }: { saving: boolean }) {
  return (
    <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-accent text-black text-xs font-semibold hover:bg-accent/80 transition-colors disabled:opacity-50 cursor-pointer">
      {saving ? "Saving..." : "Save"}
    </button>
  )
}

export function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400/70 text-xs hover:border-red-500/60 hover:text-red-400 transition-colors cursor-pointer">
      Delete
    </button>
  )
}

export function CancelButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="px-4 py-2 rounded-lg border border-white/10 text-white/50 text-xs hover:border-white/20 hover:text-white/70 transition-colors cursor-pointer">
      Cancel
    </button>
  )
}
