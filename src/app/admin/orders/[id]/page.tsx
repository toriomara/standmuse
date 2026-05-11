import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/Badge"
import { ORDER_STATUS_MAP } from "@/constants/statusMaps"
import { OrderStatusUpdater } from "./OrderStatusUpdater"
import { OrderNotesEditor } from "./OrderNotesEditor"
import { OrderParamsEditor } from "./OrderParamsEditor"
import { formatPrice } from "@/lib/utils"
import type { OrderItem } from "@/types"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Admin — Заказ" }

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  )
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id } }).catch(() => null)
  if (!order) notFound()

  const s = ORDER_STATUS_MAP[order.status] ?? { label: order.status, variant: "default" as const }
  const contact = order.contact as { name?: string; phone?: string; email?: string } | null
  const items = Array.isArray(order.items) ? (order.items as unknown as OrderItem[]) : []
  const orderParams = ((order as unknown as Record<string, unknown>).params ?? {}) as { height?: string; base?: string; column?: string; platform?: string; color?: string; baseFinish?: string }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link
        href="/admin/orders"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Все заказы
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Заказ</h1>
          <p className="text-xs text-muted-foreground mt-1 font-mono">{order.id}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {order.createdAt.toLocaleDateString("ru-RU", {
              day: "numeric", month: "long", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
        <Badge variant={s.variant} className="self-start text-sm px-3 py-1">
          {s.label}
        </Badge>
      </div>

      {/* Status */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm font-semibold mb-3">Изменить статус</p>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>

      {/* Contact */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4">Контактные данные</h2>
        <dl className="grid sm:grid-cols-3 gap-4">
          <Field label="Имя" value={contact?.name} />
          <Field label="Телефон" value={contact?.phone} />
          <Field label="Email" value={contact?.email} />
        </dl>
      </div>

      {/* Price & notes */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4">Сумма и заметки</h2>
        <OrderNotesEditor
          orderId={order.id}
          totalPrice={order.totalPrice}
          notes={order.notes}
        />
      </div>

      {/* Product params */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4">Параметры изделия</h2>
        <OrderParamsEditor orderId={order.id} params={orderParams} />
      </div>

      {/* Items */}
      {items.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold mb-4">Позиции заказа</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left pb-2">Наименование</th>
                <th className="text-right pb-2">Кол-во</th>
                <th className="text-right pb-2">Цена</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">
                    {item.price ? formatPrice(item.price) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
