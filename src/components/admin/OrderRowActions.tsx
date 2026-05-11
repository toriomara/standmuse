"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function OrderRowActions({ id, contactName }: { id: string; contactName: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`Удалить заказ от «${contactName}»? Это действие необратимо.`)) return
    setDeleting(true)
    await fetch(`/api/orders/${id}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button asChild variant="ghost" size="icon">
        <Link href={`/admin/orders/${id}`} aria-label="Редактировать">
          <Pencil className="h-4 w-4" />
        </Link>
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
