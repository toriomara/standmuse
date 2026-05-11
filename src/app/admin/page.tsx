export const dynamic = "force-dynamic"
import { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/Badge"
import { Package, MessageSquare, ShoppingCart, FileText } from "lucide-react"
export const metadata: Metadata = { title: "Admin — Dashboard" }

export default async function AdminDashboard() {
  const [products, requests, orders, articles] = await Promise.all([
    prisma.product.count().catch(() => 0),
    prisma.request.count().catch(() => 0),
    prisma.order.count().catch(() => 0),
    prisma.article.count().catch(() => 0),
  ])

  const recentRequests = await prisma.request
    .findMany({ orderBy: { createdAt: "desc" }, take: 5 })
    .catch(() => [])

  const stats = [
    { label: "Товаров", value: products, icon: Package, href: "/admin/products" },
    { label: "Заявок", value: requests, icon: MessageSquare, href: "/admin/requests" },
    { label: "Заказов", value: orders, icon: ShoppingCart, href: "/admin/orders" },
    { label: "Статей", value: articles, icon: FileText, href: "/admin/articles" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Дашборд</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Обзор магазина StandMuse</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] flex flex-col gap-2"
          >
            <div className="h-8 w-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
              <s.icon className="h-4 w-4 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent requests */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Последние заявки</h2>
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Имя</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Тип</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Email</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Дата</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                    Заявок пока нет
                  </td>
                </tr>
              ) : (
                recentRequests.map((req) => (
                  <tr key={req.id} className="bg-[var(--card)] hover:bg-[var(--muted)] transition-colors">
                    <td className="px-4 py-3 font-medium">{req.name}</td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{req.productType}</td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{req.email}</td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      {req.createdAt.toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-[var(--accent)]/10 text-[var(--accent)]">
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
