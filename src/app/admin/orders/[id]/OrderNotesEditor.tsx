"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { FormField, inputCls, textareaCls } from "@/components/admin/FormField"
import { SaveStatus } from "@/components/admin/SaveStatus"
import { apiRequest } from "@/lib/api-client"
import { useAsyncAction } from "@/hooks/useAsyncAction"

interface Props {
  orderId: string
  totalPrice: number | null
  notes: string | null
}

export function OrderNotesEditor({ orderId, totalPrice, notes }: Props) {
  const router = useRouter()
  const [price, setPrice] = useState(totalPrice?.toString() ?? "")
  const [note, setNote] = useState(notes ?? "")
  const { pending, error, done, run, reset } = useAsyncAction()

  const handleSave = async () => {
    const ok = await run(() =>
      apiRequest(`/api/orders/${orderId}`, {
        method: "PATCH",
        body: { totalPrice: price ? Number(price) : null, notes: note || null },
      }),
    )
    if (ok) router.refresh()
  }

  return (
    <div className="flex flex-col gap-4">
      <FormField label="Сумма (₽)">
        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => {
            setPrice(e.target.value)
            reset()
          }}
          placeholder="Не указана"
          className={inputCls}
        />
      </FormField>
      <FormField label="Заметки">
        <textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value)
            reset()
          }}
          rows={4}
          placeholder="Комментарий к заказу..."
          className={textareaCls}
        />
      </FormField>
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handleSave} loading={pending}>
          Сохранить
        </Button>
        <SaveStatus done={done} error={error} />
      </div>
    </div>
  )
}
