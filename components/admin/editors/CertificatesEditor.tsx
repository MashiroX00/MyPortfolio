"use client"

import { useEffect, useState } from "react"
import { getCertificates, createCertificate, updateCertificate, deleteCertificate, reorderCertificates } from "@/lib/api"
import type { Certificate } from "@/lib/types"
import { SortableList } from "../SortableList"
import { SectionHeader, Field, Input, Textarea, SaveButton, DeleteButton, CancelButton } from "./AboutEditor"

const emptyForm = { cert_name: "", cert_description: "", issuer: "", date_issued: "", url: "", position: 0 }

export default function CertificatesEditor() {
  const [items, setItems] = useState<Certificate[]>([])
  const [mode, setMode] = useState<"idle" | "add" | number>("idle")
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { getCertificates().then(setItems).finally(() => setLoading(false)) }, [])

  function openAdd() { setForm({ ...emptyForm, position: items.length + 1 }); setMode("add") }
  function openEdit(item: Certificate) {
    setForm({ cert_name: item.cert_name, cert_description: item.cert_description ?? "", issuer: item.issuer, date_issued: item.date_issued, url: item.url ?? "", position: item.position })
    setMode(item.id)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      if (mode === "add") { const c = await createCertificate(form); setItems([...items, c]) }
      else if (typeof mode === "number") { const u = await updateCertificate(mode, form); setItems(items.map((i) => i.id === mode ? u : i)) }
      setMode("idle")
    } catch (err) { alert(err instanceof Error ? err.message : "Error") }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this certificate?")) return
    try { await deleteCertificate(id); setItems(items.filter((i) => i.id !== id)) }
    catch (err) { alert(err instanceof Error ? err.message : "Error") }
  }

  async function handleReorder(newItems: Certificate[]) {
    const reordered = newItems.map((item, idx) => ({ ...item, position: idx + 1 }))
    setItems(reordered)
    try { await reorderCertificates(reordered.map((i) => ({ id: i.id, position: i.position }))) }
    catch (err) { alert(err instanceof Error ? err.message : "Reorder failed") }
  }

  if (loading) return <p className="text-white/30 text-sm">Loading...</p>

  return (
    <div>
      <SectionHeader title="Certificates" onAdd={mode === "idle" ? openAdd : undefined} />

      {(mode === "add" || typeof mode === "number") && (
        <form onSubmit={handleSave} className="glass-card p-5 mb-4 space-y-3 border border-accent/20">
          <p className="text-xs text-accent tracking-widest uppercase">{mode === "add" ? "New Certificate" : "Edit Certificate"}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Certificate Name"><Input value={form.cert_name} onChange={(v) => setForm({ ...form, cert_name: v })} placeholder="AWS Certified Developer" /></Field>
            <Field label="Issuer"><Input value={form.issuer} onChange={(v) => setForm({ ...form, issuer: v })} placeholder="Amazon Web Services" /></Field>
            <Field label="Date Issued (YYYY-MM-DD)"><Input value={form.date_issued} onChange={(v) => setForm({ ...form, date_issued: v })} type="date" /></Field>
            <Field label="Credential URL"><Input value={form.url} onChange={(v) => setForm({ ...form, url: v })} placeholder="https://..." /></Field>
          </div>
          <Field label="Description"><Textarea value={form.cert_description} onChange={(v) => setForm({ ...form, cert_description: v })} placeholder="What this certificate validates..." /></Field>
          <div className="flex gap-2 pt-1"><SaveButton saving={saving} /><CancelButton onClick={() => setMode("idle")} /></div>
        </form>
      )}

      <SortableList items={items} onReorder={handleReorder} renderItem={(item) => (
        <div className="glass-card p-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{item.cert_name}</p>
            <p className="text-xs text-accent/70 font-mono">{item.issuer}</p>
            <p className="text-xs text-white/25">{item.date_issued}</p>
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
