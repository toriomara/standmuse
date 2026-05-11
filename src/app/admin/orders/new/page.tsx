"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { inputCls, labelCls } from "../_formClasses"

const STATUSES = [
  { value: "PENDING",     label: "Ожидает" },
  { value: "IN_PROGRESS", label: "В работе" },
  { value: "COMPLETED",   label: "Выполнен" },
  { value: "CANCELLED",   label: "Отменён" },
]

const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 11)
  if (!d) return ""
  let r = "+7"
  if (d.length > 1) r += ` (${d.slice(1, 4)}`
  if (d.length >= 4) r += ")"
  if (d.length > 4) r += ` ${d.slice(4, 7)}`
  if (d.length > 7) r += `-${d.slice(7, 9)}`
  if (d.length > 9) r += `-${d.slice(9, 11)}`
  return r
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  )
}

export default function NewOrderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [contact, setContact] = useState({ name: "", phone: "", email: "" })
  const [order, setOrder] = useState({ status: "PENDING", totalPrice: "", notes: "" })
  const [params, setParams] = useState({
    height: "", base: "", column: "", platform: "", color: "", baseFinish: "",
  })

  const setC = (k: string, v: string) => setContact((p) => ({ ...p, [k]: v }))
  const setO = (k: string, v: string) => setOrder((p) => ({ ...p, [k]: v }))
  const setP = (k: string, v: string) => setParams((p) => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const paramsPayload = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v.trim())
      )
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          status: order.status,
          totalPrice: order.totalPrice ? parseFloat(order.totalPrice) : null,
          notes: order.notes || null,
          params: Object.keys(paramsPayload).length ? paramsPayload : null,
        }),
      })
      const created = await res.json()
      router.push(`/admin/orders/${created.id}`)
    } finally {
      setLoading(false)
    }
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

        {/* Контакт */}
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Контактные данные</h2>

          <Field label="Имя клиента *">
            <input
              required
              value={contact.name}
              onChange={(e) => setC("name", e.target.value)}
              placeholder="Иван Иванов"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Телефон">
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => setC("phone", formatPhone(e.target.value))}
                placeholder="+7 (900) 000-00-00"
                className={inputCls}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setC("email", e.target.value)}
                placeholder="client@example.com"
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        {/* Параметры изделия */}
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Параметры изделия</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Общая высота">
              <input
                value={params.height}
                onChange={(e) => setP("height", e.target.value)}
                placeholder="600 мм"
                className={inputCls}
              />
            </Field>
            <Field label="Цвет">
              <input
                value={params.color}
                onChange={(e) => setP("color", e.target.value)}
                placeholder="RAL 9003, чёрный…"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Основание">
              <input
                value={params.base}
                onChange={(e) => setP("base", e.target.value)}
                placeholder="Груша, Дуб…"
                className={inputCls}
              />
            </Field>
            <Field label="Обработка основания">
              <input
                value={params.baseFinish}
                onChange={(e) => setP("baseFinish", e.target.value)}
                placeholder="Масло, лак, воск…"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Колонна">
              <input
                value={params.column}
                onChange={(e) => setP("column", e.target.value)}
                placeholder="100×100×4 мм"
                className={inputCls}
              />
            </Field>
            <Field label="Платформа">
              <input
                value={params.platform}
                onChange={(e) => setP("platform", e.target.value)}
                placeholder="250×200×4 мм"
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        {/* Заказ */}
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Параметры заказа</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Статус">
              <select
                value={order.status}
                onChange={(e) => setO("status", e.target.value)}
                className={inputCls}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Сумма (₽)">
              <input
                type="number"
                value={order.totalPrice}
                onChange={(e) => setO("totalPrice", e.target.value)}
                placeholder="0"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Заметки">
            <textarea
              value={order.notes}
              onChange={(e) => setO("notes", e.target.value)}
              rows={3}
              placeholder="Комментарий к заказу…"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
            />
          </Field>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={loading}>Создать заказ</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Отмена</Button>
        </div>
      </form>
    </div>
  )
}
