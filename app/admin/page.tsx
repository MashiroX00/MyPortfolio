"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminShell from "@/components/admin/AdminShell"

export default function AdminPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.replace("/admin/login")
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-xs text-white/20 tracking-widest">Checking auth...</p>
    </div>
  )

  return <AdminShell />
}
