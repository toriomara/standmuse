"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { FormField, inputCls, textareaCls } from "@/components/admin/FormField"
import { OrderParamsFields } from "@/components/admin/OrderParamsFields"
import { ORDER_STATUS_MAP } from "@/constants/statusMaps"
import { apiRequest } from "@/lib/api-client"
import { compactOrderParams, type OrderParams } from "@/lib/order-params"
import { formatPhone } from "@/lib/phone"
import { useAsyncAction } from "@/hooks/useAsyncAction"

export default function NewOrderPage() {
  const router = useRouter()
  const { pending, error, run } = useAsyncAction()
  const [contact, setContact] = useState({ name: "", phone: "", email: "" })
  const [order, setOrder] = useState({ status: "PENDING", totalPrice: "", notes: "" })
  const [params, setParams] = useState<OrderParams>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await run(async () => {
      const created = await apiRequest<{ id: string }>("/api/orders", {
        method: "POST",
        body: {
          contact,
          status: order.status,
          totalPrice: order.totalPrice ? Number(order.totalPrice) : null,
          notes: order.notes || null,
          params: compactOrderParams(params),
        },
      })
      router.push(`/admin/orders/${created.id}`)
    })
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <Link
        href="/admin/orders"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Все заказы
      </Link>

      <h1 className="text-2xl font-bold">Новый заказ</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Контактные данные</h2>

          <FormField label="Имя клиента *">
            <input
              required
              value={contact.name}
              onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
              placeholder="Иван Иванов"
              className={inputCls}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Телефон">
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => setContact((c) => ({ ...c, phone: formatPhone(e.target.value) }))}
                placeholder="+7 (900) 000-00-00"
                className={inputCls}
              />
            </FormField>
            <FormField label="Email">
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                placeholder="client@example.com"
                className={inputCls}
              />
            </FormField>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Параметры изделия</h2>
          <OrderParamsFields
            values={params}
            onChange={(key, value) => setParams((p) => ({ ...p, [key]: value }))}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Параметры заказа</h2>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Статус">
              <select
                value={order.status}
                onChange={(e) => setOrder((o) => ({ ...o, status: e.target.value }))}
                className={inputCls}
              >
                {Object.entries(ORDER_STATUS_MAP).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Сумма (₽)">
              <input
                type="number"
                min={0}
                value={order.totalPrice}
                onChange={(e) => setOrder((o) => ({ ...o, totalPrice: e.target.value }))}
                placeholder="0"
                className={inputCls}
              />
            </FormField>
          </div>

          <FormField label="Заметки">
            <textarea
              value={order.notes}
              onChange={(e) => setOrder((o) => ({ ...o, notes: e.target.value }))}
              rows={3}
              placeholder="Комментарий к заказу…"
              className={textareaCls}
            />
          </FormField>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" loading={pending}>
            Создать заказ
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
        </div>
      </form>
    </div>
  )
}
