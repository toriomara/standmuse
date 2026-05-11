export const dynamic = "force-dynamic"
import { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { REQUEST_STATUS_MAP } from "@/constants/statusMaps"
import { PRODUCT_TYPE_LABELS } from "@/constants/requestMaps"
import { getSessionUserId } from "@/lib/session"

export const metadata: Metadata = { title: "Личный кабинет" }

export default async function AccountPage() {
  const session = await auth()
  const userId = getSessionUserId(session)

  const [requests, orders] = userId
    ? await Promise.all([
        prisma.request.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
        prisma.order.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
      ])
    : [[], []]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Добро пожаловать</h1>
        <p className="text-muted-foreground">Здесь вы можете отслеживать свои заявки и заказы</p>
      </div>

      {/* Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Заявки</h2>
          <Link href="/order">
            <Button size="sm">Новая заявка</Button>
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border border-border border-dashed">
            <p className="text-muted-foreground text-sm">Заявок пока нет</p>
            <Link href="/order" className="mt-3 inline-block">
              <Button size="sm" variant="outline">Оформить заявку</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {requests.map((req) => {
              const s = REQUEST_STATUS_MAP[req.status] ?? { label: req.status, variant: "default" as const }
              return (
                <div key={req.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                  <div>
                    <p className="font-medium text-sm">{PRODUCT_TYPE_LABELS[req.productType] ?? req.productType}</p>
                    <p className="text-xs text-muted-foreground">
                      {req.createdAt.toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                  <Badge variant={s.variant}>{s.label}</Badge>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Orders */}
      {orders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Заказы</h2>
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                <div>
                  <p className="font-medium text-sm">Заказ #{order.id.slice(-6)}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.createdAt.toLocaleDateString("ru-RU")}
                  </p>
                </div>
                <Badge variant="default">{order.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
