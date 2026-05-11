export const dynamic = "force-dynamic"
import { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Plus, Pencil } from "lucide-react"
export const metadata: Metadata = { title: "Admin — Товары" }

export default async function AdminProductsPage() {
  const products = await prisma.product
    .findMany({
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Товары</h1>
          <p className="text-sm text-[var(--muted-foreground)]">{products.length} товаров</p>
        </div>
        <Link href="/admin/products/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Добавить
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Название</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Категория</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Цена от</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Статус</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[var(--muted-foreground)]">
                  Товаров нет. Добавьте первый.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="bg-[var(--card)] hover:bg-[var(--muted)] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">{p.category.name}</td>
                  <td className="px-4 py-3">{p.priceFrom ? formatPrice(p.priceFrom) : "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.isActive ? "success" : "default"}>
                      {p.isActive ? "Активен" : "Скрыт"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/products/${p.id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
