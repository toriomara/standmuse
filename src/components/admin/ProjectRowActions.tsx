"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Copy } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { DeleteButton } from "@/components/admin/DeleteButton"
import { apiRequest } from "@/lib/api-client"
import { useAsyncAction } from "@/hooks/useAsyncAction"

type ProjectRecord = { title: string; slug: string } & Record<string, unknown>

export function ProjectRowActions({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const { pending: copying, error, run } = useAsyncAction()

  const handleCopy = async () => {
    const ok = await run(async () => {
      const project = await apiRequest<ProjectRecord>(`/api/projects/${id}`)
      // Служебные поля (id, createdAt, updatedAt) отсекает схема валидации на сервере
      await apiRequest("/api/projects", {
        method: "POST",
        body: {
          ...project,
          title: `Копия — ${project.title}`,
          slug: `${project.slug}-${Date.now()}`,
          isPublished: false,
        },
      })
    })
    if (ok) router.refresh()
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {error && <span className="text-xs text-destructive mr-1">{error}</span>}
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
      <DeleteButton
        endpoint={`/api/projects/${id}`}
        label="Удалить проект"
        title="Удалить проект?"
        description={`Проект «${title}» будет удалён навсегда. Это действие необратимо.`}
      />
    </div>
  )
}
