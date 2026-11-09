"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { apiRequest } from "@/lib/api-client"
import { slugify } from "@/lib/utils"
import { useAsyncAction } from "@/hooks/useAsyncAction"

export function CategoryCreateForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const { pending, error, run } = useAsyncAction()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    const ok = await run(() =>
      apiRequest("/api/categories", {
        method: "POST",
        body: { name: trimmed, slug: slug.trim() || slugify(trimmed) },
      }),
    )
    if (!ok) return
    setName("")
    setSlug("")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-border bg-card">
      <p className="text-sm font-medium mb-3">Новая категория</p>
      <div className="flex gap-3">
        <Input placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="slug (необязательно)" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <Button type="submit" size="icon" loading={pending} aria-label="Добавить категорию">
          {!pending && <Plus className="h-4 w-4" />}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive mt-2">{error}</p>}
    </form>
  )
}
