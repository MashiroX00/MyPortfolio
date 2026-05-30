"use client"

import { useEffect, useState } from "react"
import { getProjects, createProject, updateProject, deleteProject, reorderProjects } from "@/lib/api"
import type { Project } from "@/lib/types"
import { SortableList } from "../SortableList"
import { SectionHeader, Field, Input, Textarea, SaveButton, DeleteButton, CancelButton } from "./AboutEditor"

const emptyForm = { title: "", description: "", tech_stack: [] as string[], url: "", image_url: "", position: 0 }

export default function ProjectsEditor() {
  const [items, setItems] = useState<Project[]>([])
  const [mode, setMode] = useState<"idle" | "add" | number>("idle")
  const [form, setForm] = useState(emptyForm)
  const [techRaw, setTechRaw] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { getProjects().then(setItems).finally(() => setLoading(false)) }, [])

  function openAdd() {
    setForm({ ...emptyForm, position: items.length + 1 })
    setTechRaw("")
    setMode("add")
  }

  function openEdit(item: Project) {
    setForm({ title: item.title, description: item.description ?? "", tech_stack: item.tech_stack, url: item.url ?? "", image_url: item.image_url ?? "", position: item.position })
    setTechRaw(item.tech_stack.join(", "))
    setMode(item.id)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, tech_stack: techRaw.split(",").map((t) => t.trim()).filter(Boolean) }
    try {
      if (mode === "add") {
        const created = await createProject(payload)
        setItems([...items, created])
      } else if (typeof mode === "number") {
        const updated = await updateProject(mode, payload)
        setItems(items.map((i) => (i.id === mode ? updated : i)))
      }
      setMode("idle")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return
    try {
      await deleteProject(id)
      setItems(items.filter((i) => i.id !== id))
      if (mode === id) setMode("idle")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error")
    }
  }

  async function handleReorder(newItems: Project[]) {
    const reordered = newItems.map((item, idx) => ({ ...item, position: idx + 1 }))
    setItems(reordered)
    try {
      await reorderProjects(reordered.map((i) => ({ id: i.id, position: i.position })))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Reorder failed")
    }
  }

  if (loading) return <p className="text-white/30 text-sm">Loading...</p>

  return (
    <div>
      <SectionHeader title="Projects" onAdd={mode === "idle" ? openAdd : undefined} />

      {(mode === "add" || typeof mode === "number") && (
        <form onSubmit={handleSave} className="glass-card p-5 mb-4 space-y-3 border border-accent/20">
          <p className="text-xs text-accent tracking-widest uppercase">{mode === "add" ? "New Project" : "Edit Project"}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Title"><Input value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Project name" /></Field>
            <Field label="URL"><Input value={form.url} onChange={(v) => setForm({ ...form, url: v })} placeholder="https://github.com/..." /></Field>
          </div>
          <Field label="Description"><Textarea value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="What does this project do?" /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Tech Stack (comma-separated)"><Input value={techRaw} onChange={setTechRaw} placeholder="React, Node.js, PostgreSQL" /></Field>
            <Field label="Image URL"><Input value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} placeholder="https://..." /></Field>
          </div>
          <div className="flex gap-2 pt-1">
            <SaveButton saving={saving} />
            <CancelButton onClick={() => setMode("idle")} />
          </div>
        </form>
      )}

      <SortableList
        items={items}
        onReorder={handleReorder}
        renderItem={(item) => (
          <div className="glass-card p-4 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{item.title}</p>
              <p className="text-xs text-white/30 mt-0.5 truncate">{item.tech_stack.join(" · ")}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="px-3 py-1.5 rounded-lg border border-white/10 text-white/50 text-xs hover:border-accent/30 hover:text-accent transition-colors cursor-pointer">Edit</button>
              <DeleteButton onClick={() => handleDelete(item.id)} />
            </div>
          </div>
        )}
      />
    </div>
  )
}
