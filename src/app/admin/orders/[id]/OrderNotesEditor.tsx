"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"

interface Props {
  orderId: string
  totalPrice: number | null
  notes: string | null
}

export function OrderNotesEditor({ orderId, totalPrice, notes }: Props) {
  const [price, setPrice] = useState(totalPrice?.toString() ?? "")
  const [note, setNote] = useState(notes ?? "")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalPrice: price ? parseFloat(price) : null,
          notes: note || null,
        }),
      })
      setSaved(true)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Сумма (₽)
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => { setPrice(e.target.value); setSaved(false) }}
          placeholder="Не указана"
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Заметки
        </label>
        <textarea
          value={note}
          onChange={(e) => { setNote(e.target.value); setSaved(false) }}
          rows={4}
          placeholder="Комментарий к заказу..."
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handleSave} loading={loading}>
          Сохранить
        </Button>
        {saved && <span className="text-sm text-green-600 dark:text-green-400">Сохранено</span>}
      </div>
    </div>
  )
}
