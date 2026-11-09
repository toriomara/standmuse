"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { apiRequest } from "@/lib/api-client"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { cn } from "@/lib/utils"

interface DeleteButtonProps {
  /** DELETE-эндпоинт, например `/api/articles/123`. */
  endpoint: string
  title: string
  description: string
  /** Куда перейти после удаления; без значения — просто обновить текущую страницу. */
  redirectTo?: string
  /** `icon` — только корзина, `text` — корзина с подписью `label`. */
  variant?: "icon" | "text"
  label?: string
}

export function DeleteButton({
  endpoint,
  title,
  description,
  redirectTo,
  variant = "icon",
  label = "Удалить",
}: DeleteButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { pending, error, run } = useAsyncAction()

  const handleDelete = async () => {
    const ok = await run(() => apiRequest(endpoint, { method: "DELETE" }))
    if (!ok) return
    setOpen(false)
    if (redirectTo) router.push(redirectTo)
    else router.refresh()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        className={cn(
          "text-muted-foreground hover:text-destructive transition-colors",
          variant === "icon" ? "p-2 rounded" : "flex items-center gap-1.5 text-sm",
        )}
      >
        <Trash2 className={variant === "icon" ? "h-4 w-4" : "h-3.5 w-3.5"} />
        {variant === "text" && label}
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        error={error}
        confirmLabel="Да, удалить"
        destructive
        loading={pending}
        onConfirm={handleDelete}
      />
    </>
  )
}
