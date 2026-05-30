"use client"

import { useEffect, useState } from "react"
import { getSkills, createSkill, updateSkill, deleteSkill, reorderSkills } from "@/lib/api"
import type { Skill } from "@/lib/types"
import { SortableList } from "../SortableList"
import { SectionHeader, Field, Input, SaveButton, DeleteButton, CancelButton } from "./AboutEditor"

const emptyForm = { name: "", category: "", position: 0 }

export default function SkillsEditor() {
  const [items, setItems] = useState<Skill[]>([])
  const [mode, setMode] = useState<"idle" | "add" | number>("idle")
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { getSkills().then(setItems).finally(() => setLoading(false)) }, [])

  function openAdd() { setForm({ ...emptyForm, position: items.length + 1 }); setMode("add") }
  function openEdit(item: Skill) { setForm({ name: item.name, category: item.category, position: item.position }); setMode(item.id) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      if (mode === "add") { const c = await createSkill(form); setItems([...items, c]) }
      else if (typeof mode === "number") { const u = await updateSkill(mode, form); setItems(items.map((i) => i.id === mode ? u : i)) }
      setMode("idle")
    } catch (err) { alert(err instanceof Error ? err.message : "Error") }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this skill?")) return
    try { await deleteSkill(id); setItems(items.filter((i) => i.id !== id)) }
    catch (err) { alert(err instanceof Error ? err.message : "Error") }
  }

  async function handleReorder(newItems: Skill[]) {
    const reordered = newItems.map((item, idx) => ({ ...item, position: idx + 1 }))
    setItems(reordered)
    try { await reorderSkills(reordered.map((i) => ({ id: i.id, position: i.position }))) }
    catch (err) { alert(err instanceof Error ? err.message : "Reorder failed") }
  }

  if (loading) return <p className="text-white/30 text-sm">Loading...</p>

  const categories = [...new Set(items.map((i) => i.category))]

  return (
    <div>
      <SectionHeader title="Skills" onAdd={mode === "idle" ? openAdd : undefined} />

      {(mode === "add" || typeof mode === "number") && (
        <form onSubmit={handleSave} className="glass-card p-5 mb-4 space-y-3 border border-accent/20">
          <p className="text-xs text-accent tracking-widest uppercase">{mode === "add" ? "New Skill" : "Edit Skill"}</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name"><Input value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="React" /></Field>
            <Field label="Category">
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} list="categories" placeholder="Frontend" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-accent/50 placeholder:text-white/20" />
              <datalist id="categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
            </Field>
          </div>
          <div className="flex gap-2 pt-1"><SaveButton saving={saving} /><CancelButton onClick={() => setMode("idle")} /></div>
        </form>
      )}

      <SortableList items={items} onReorder={handleReorder} renderItem={(item) => (
        <div className="glass-card p-3 flex items-center justify-between gap-3">
          <div>
            <span className="text-sm text-white/80">{item.name}</span>
            <span className="ml-2 text-xs text-accent/60 font-mono">{item.category}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openEdit(item)} className="px-3 py-1 rounded border border-white/10 text-white/40 text-xs hover:border-accent/30 hover:text-accent transition-colors cursor-pointer">Edit</button>
            <DeleteButton onClick={() => handleDelete(item.id)} />
          </div>
        </div>
      )} />
    </div>
  )
}
