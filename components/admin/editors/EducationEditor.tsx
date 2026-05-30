"use client"

import { useEffect, useState } from "react"
import { getEducation, createEducation, updateEducation, deleteEducation, reorderEducation } from "@/lib/api"
import type { Education } from "@/lib/types"
import { SortableList } from "../SortableList"
import { SectionHeader, Field, Input, SaveButton, DeleteButton, CancelButton } from "./AboutEditor"

const emptyForm = { school: "", degree: "", major: "", start_year: new Date().getFullYear(), end_year: null as number | null, position: 0 }

export default function EducationEditor() {
  const [items, setItems] = useState<Education[]>([])
  const [mode, setMode] = useState<"idle" | "add" | number>("idle")
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { getEducation().then(setItems).finally(() => setLoading(false)) }, [])

  function openAdd() { setForm({ ...emptyForm, position: items.length + 1 }); setMode("add") }
  function openEdit(item: Education) {
    setForm({ school: item.school, degree: item.degree, major: item.major, start_year: item.start_year, end_year: item.end_year, position: item.position })
    setMode(item.id)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      if (mode === "add") { const c = await createEducation(form); setItems([...items, c]) }
      else if (typeof mode === "number") { const u = await updateEducation(mode, form); setItems(items.map((i) => i.id === mode ? u : i)) }
      setMode("idle")
    } catch (err) { alert(err instanceof Error ? err.message : "Error") }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this education?")) return
    try { await deleteEducation(id); setItems(items.filter((i) => i.id !== id)) }
    catch (err) { alert(err instanceof Error ? err.message : "Error") }
  }

  async function handleReorder(newItems: Education[]) {
    const reordered = newItems.map((item, idx) => ({ ...item, position: idx + 1 }))
    setItems(reordered)
    try { await reorderEducation(reordered.map((i) => ({ id: i.id, position: i.position }))) }
    catch (err) { alert(err instanceof Error ? err.message : "Reorder failed") }
  }

  if (loading) return <p className="text-white/30 text-sm">Loading...</p>

  return (
    <div>
      <SectionHeader title="Education" onAdd={mode === "idle" ? openAdd : undefined} />

      {(mode === "add" || typeof mode === "number") && (
        <form onSubmit={handleSave} className="glass-card p-5 mb-4 space-y-3 border border-accent/20">
          <p className="text-xs text-accent tracking-widest uppercase">{mode === "add" ? "New Education" : "Edit Education"}</p>
          <Field label="School"><Input value={form.school} onChange={(v) => setForm({ ...form, school: v })} placeholder="University name" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Degree"><Input value={form.degree} onChange={(v) => setForm({ ...form, degree: v })} placeholder="Bachelor of Science" /></Field>
            <Field label="Major"><Input value={form.major} onChange={(v) => setForm({ ...form, major: v })} placeholder="Computer Science" /></Field>
            <Field label="Start Year"><Input value={String(form.start_year)} onChange={(v) => setForm({ ...form, start_year: Number(v) })} type="number" placeholder="2020" /></Field>
            <Field label="End Year (blank = ongoing)"><Input value={form.end_year !== null ? String(form.end_year) : ""} onChange={(v) => setForm({ ...form, end_year: v ? Number(v) : null })} type="number" placeholder="2024" /></Field>
          </div>
          <div className="flex gap-2 pt-1"><SaveButton saving={saving} /><CancelButton onClick={() => setMode("idle")} /></div>
        </form>
      )}

      <SortableList items={items} onReorder={handleReorder} renderItem={(item) => (
        <div className="glass-card p-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">{item.school}</p>
            <p className="text-xs text-accent/70 font-mono">{item.degree} — {item.major}</p>
            <p className="text-xs text-white/25">{item.start_year} — {item.end_year ?? "Present"}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openEdit(item)} className="px-3 py-1.5 rounded-lg border border-white/10 text-white/50 text-xs hover:border-accent/30 hover:text-accent transition-colors cursor-pointer">Edit</button>
            <DeleteButton onClick={() => handleDelete(item.id)} />
          </div>
        </div>
      )} />
    </div>
  )
}
