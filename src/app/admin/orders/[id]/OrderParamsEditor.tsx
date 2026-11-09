"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { OrderParamsFields } from "@/components/admin/OrderParamsFields"
import { SaveStatus } from "@/components/admin/SaveStatus"
import { apiRequest } from "@/lib/api-client"
import { compactOrderParams, type OrderParams } from "@/lib/order-params"
import { useAsyncAction } from "@/hooks/useAsyncAction"

export function OrderParamsEditor({ orderId, params }: { orderId: string; params: OrderParams }) {
  const router = useRouter()
  const [values, setValues] = useState<OrderParams>(params)
  const { pending, error, done, run, reset } = useAsyncAction()

  const handleSave = async () => {
    const ok = await run(() =>
      apiRequest(`/api/orders/${orderId}`, {
        method: "PATCH",
        body: { params: compactOrderParams(values) },
      }),
    )
    if (ok) router.refresh()
  }

  return (
    <div className="flex flex-col gap-4">
      <OrderParamsFields
        values={values}
        onChange={(key, value) => {
          setValues((prev) => ({ ...prev, [key]: value }))
          reset()
        }}
      />
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handleSave} loading={pending}>
          Сохранить
        </Button>
        <SaveStatus done={done} error={error} />
      </div>
    </div>
  )
}
