"use client"

import { useEffect, useState } from "react"
import { getContact, createContact, updateContact, deleteContact } from "@/lib/api"
import type { ContactLink } from "@/lib/types"
import { SectionHeader, Field, Input, SaveButton, DeleteButton, CancelButton } from "./AboutEditor"

interface ContactLinkWithId extends ContactLink { id: number }

const emptyForm = { platform: "", url: "" }

export default function ContactEditor() {
  const [items, setItems] = useState<ContactLinkWithId[]>([])
  const [mode, setMode] = useState<"idle" | "add" | number>("idle")
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContact().then((data) => setItems(data as ContactLinkWithId[])).finally(() => setLoading(false))
  }, [])

  function openAdd() { setForm(emptyForm); setMode("add") }
  function openEdit(item: ContactLinkWithId) { setForm({ platform: item.platform, url: item.url }); setMode(item.id) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      if (mode === "add") {
        const created = await createContact(form) as ContactLinkWithId
        setItems([...items, created])
      } else if (typeof mode === "number") {
        const updated = await updateContact(mode, form) as ContactLinkWithId
        setItems(items.map((i) => i.id === mode ? updated : i))
      }
      setMode("idle")
    } catch (err) { alert(err instanceof Error ? err.message : "Error") }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this contact link?")) return
    try { await deleteContact(id); setItems(items.filter((i) => i.id !== id)) }
    catch (err) { alert(err instanceof Error ? err.message : "Error") }
  }

  if (loading) return <p className="text-white/30 text-sm">Loading...</p>

  return (
    <div>
      <SectionHeader title="Contact" onAdd={mode === "idle" ? openAdd : undefined} />

      {(mode === "add" || typeof mode === "number") && (
        <form onSubmit={handleSave} className="glass-card p-5 mb-4 space-y-3 border border-accent/20">
          <p className="text-xs text-accent tracking-widest uppercase">{mode === "add" ? "New Contact Link" : "Edit Contact Link"}</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Platform"><Input value={form.platform} onChange={(v) => setForm({ ...form, platform: v })} placeholder="GitHub" /></Field>
            <Field label="URL"><Input value={form.url} onChange={(v) => setForm({ ...form, url: v })} placeholder="https://github.com/..." /></Field>
          </div>
          <div className="flex gap-2 pt-1"><SaveButton saving={saving} /><CancelButton onClick={() => setMode("idle")} /></div>
        </form>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="glass-card p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-sm font-semibold text-white">{item.platform}</span>
              <span className="ml-3 text-xs text-white/30 font-mono truncate">{item.url}</span>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="px-3 py-1.5 rounded-lg border border-white/10 text-white/50 text-xs hover:border-accent/30 hover:text-accent transition-colors cursor-pointer">Edit</button>
              <DeleteButton onClick={() => handleDelete(item.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
