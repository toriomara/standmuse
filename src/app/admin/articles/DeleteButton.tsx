"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"

export function ArticleDeleteButton({
  articleId,
  afterDelete = "list",
}: {
  articleId: string
  afterDelete?: "list" | "stay"
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/articles/${articleId}`, { method: "DELETE" })
    if (afterDelete === "list") {
      router.push("/admin/articles")
    } else {
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Удалить статью"
        className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Удалить статью?"
        description="Это действие нельзя отменить. Статья будет удалена навсегда."
        confirmLabel="Да, удалить"
        destructive
        loading={loading}
        onConfirm={handleDelete}
      />
    </>
  )
}
