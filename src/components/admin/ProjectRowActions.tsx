"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Pencil, Trash2, Copy } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function ProjectRowActions({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [copying, setCopying] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`Удалить проект «${title}»? Это действие необратимо.`)) return
    setDeleting(true)
    await fetch(`/api/projects/${id}`, { method: "DELETE" })
    router.refresh()
  }

  const handleCopy = async () => {
    setCopying(true)
    const res = await fetch(`/api/projects/${id}`)
    const project = await res.json()
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = project
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...rest,
        title: `Копия — ${project.title}`,
        slug: `${project.slug}-${Date.now()}`,
        isPublished: false,
      }),
    })
    setCopying(false)
    router.refresh()
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button asChild variant="ghost" size="icon">
        <Link href={`/admin/projects/${id}`} aria-label="Редактировать">
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        loading={copying}
        aria-label="Дублировать"
        className="text-muted-foreground"
      >
        {!copying && <Copy className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        loading={deleting}
        aria-label="Удалить"
        className="text-muted-foreground hover:text-destructive"
      >
        {!deleting && <Trash2 className="h-4 w-4" />}
      </Button>
    </div>
  )
}
