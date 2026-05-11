export const dynamic = "force-dynamic"
import { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { OrderRowActions } from "@/components/admin/OrderRowActions"
import { ORDER_STATUS_MAP } from "@/constants/statusMaps"

export const metadata: Metadata = { title: "Admin — Заказы" }

export default async function AdminOrdersPage() {
  const orders = await prisma.order
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Заказы</h1>
          <p className="text-sm text-muted-foreground">{orders.length} заказов</p>
        </div>
        <Button asChild>
          <Link href="/admin/orders/new">Создать заказ</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Клиент</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Телефон</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Сумма</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Дата</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Статус</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  Заказов пока нет
                </td>
              </tr>
            ) : (
              orders.map((o) => {
                const contact = o.contact as { name?: string; phone?: string } | null
                const s = ORDER_STATUS_MAP[o.status] ?? { label: o.status, variant: "default" as const }
                return (
                  <tr key={o.id} className="bg-card hover:bg-muted transition-colors">
                    <td className="px-4 py-3 font-medium">
                      {contact?.name ?? <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {contact?.phone ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {o.totalPrice ? formatPrice(o.totalPrice) : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {o.createdAt.toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={s.variant}>{s.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <OrderRowActions id={o.id} contactName={contact?.name ?? o.id.slice(-6)} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
