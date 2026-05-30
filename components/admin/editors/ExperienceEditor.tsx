"use client"

import { useEffect, useState } from "react"
import { getExperience, createExperience, updateExperience, deleteExperience, reorderExperience } from "@/lib/api"
import type { Experience } from "@/lib/types"
import { SortableList } from "../SortableList"
import { SectionHeader, Field, Input, Textarea, SaveButton, DeleteButton, CancelButton } from "./AboutEditor"

const emptyForm = { company: "", role: "", start_date: "", end_date: null as string | null, description: "", position: 0 }

export default function ExperienceEditor() {
  const [items, setItems] = useState<Experience[]>([])
  const [mode, setMode] = useState<"idle" | "add" | number>("idle")
  const [form, setForm] = useState(emptyForm)
  const [isCurrent, setIsCurrent] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { getExperience().then(setItems).finally(() => setLoading(false)) }, [])

  function openAdd() {
    setForm({ ...emptyForm, position: items.length + 1 })
    setIsCurrent(false)
    setMode("add")
  }

  function openEdit(item: Experience) {
    setForm({ company: item.company, role: item.role, start_date: item.start_date, end_date: item.end_date, description: item.description ?? "", position: item.position })
    setIsCurrent(item.end_date === null)
    setMode(item.id)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, end_date: isCurrent ? null : form.end_date }
    try {
      if (mode === "add") {
        const created = await createExperience(payload)
        setItems([...items, created])
      } else if (typeof mode === "number") {
        const updated = await updateExperience(mode, payload)
        setItems(items.map((i) => (i.id === mode ? updated : i)))
      }
      setMode("idle")
    } catch (err) { alert(err instanceof Error ? err.message : "Error") }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this experience?")) return
    try { await deleteExperience(id); setItems(items.filter((i) => i.id !== id)) }
    catch (err) { alert(err instanceof Error ? err.message : "Error") }
  }

  async function handleReorder(newItems: Experience[]) {
    const reordered = newItems.map((item, idx) => ({ ...item, position: idx + 1 }))
    setItems(reordered)
    try { await reorderExperience(reordered.map((i) => ({ id: i.id, position: i.position }))) }
    catch (err) { alert(err instanceof Error ? err.message : "Reorder failed") }
  }

  if (loading) return <p className="text-white/30 text-sm">Loading...</p>

  return (
    <div>
      <SectionHeader title="Experience" onAdd={mode === "idle" ? openAdd : undefined} />

      {(mode === "add" || typeof mode === "number") && (
        <form onSubmit={handleSave} className="glass-card p-5 mb-4 space-y-3 border border-accent/20">
          <p className="text-xs text-accent tracking-widest uppercase">{mode === "add" ? "New Experience" : "Edit Experience"}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Company"><Input value={form.company} onChange={(v) => setForm({ ...form, company: v })} placeholder="Company name" /></Field>
            <Field label="Role"><Input value={form.role} onChange={(v) => setForm({ ...form, role: v })} placeholder="Job title" /></Field>
            <Field label="Start Date (YYYY-MM)"><Input value={form.start_date} onChange={(v) => setForm({ ...form, start_date: v })} placeholder="2023-01" /></Field>
            <div>
              <Field label="End Date (YYYY-MM)">
                <Input value={form.end_date ?? ""} onChange={(v) => setForm({ ...form, end_date: v })} placeholder="2024-06" />
              </Field>
              <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                <input type="checkbox" checked={isCurrent} onChange={(e) => setIsCurrent(e.target.checked)} className="accent-yellow-400" />
                <span className="text-xs text-white/40">Currently working here</span>
              </label>
            </div>
          </div>
          <Field label="Description"><Textarea value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="What did you do?" rows={3} /></Field>
          <div className="flex gap-2 pt-1"><SaveButton saving={saving} /><CancelButton onClick={() => setMode("idle")} /></div>
        </form>
      )}

      <SortableList items={items} onReorder={handleReorder} renderItem={(item) => (
        <div className="glass-card p-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">{item.role}</p>
            <p className="text-xs text-accent/70 font-mono">{item.company}</p>
            <p className="text-xs text-white/25 mt-0.5">{item.start_date} — {item.end_date ?? "Present"}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => openEdit(item)} className="px-3 py-1.5 rounded-lg border border-white/10 text-white/50 text-xs hover:border-accent/30 hover:text-accent transition-colors cursor-pointer">Edit</button>
            <DeleteButton onClick={() => handleDelete(item.id)} />
          </div>
        </div>
      )} />
    </div>
  )
}
