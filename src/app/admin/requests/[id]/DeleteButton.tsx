"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"

export function DeleteButton({ requestId }: { requestId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/requests/${requestId}`, { method: "DELETE" })
    router.push("/admin/requests")
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Удалить заявку
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Удалить заявку?"
        description="Это действие нельзя отменить. Заявка будет удалена навсегда."
        confirmLabel="Да, удалить"
        destructive
        loading={loading}
        onConfirm={handleDelete}
      />
    </>
  )
}
