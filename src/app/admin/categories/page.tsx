import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/Badge"
import { CategoryCreateForm } from "./CategoryCreateForm"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Admin — Категории" }

export default async function AdminCategoriesPage() {
  // В админке показываем и скрытые категории (публичный API отдаёт только активные)
  const categories = await prisma.category
    .findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: "asc" },
    })
    .catch(() => [])

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Категории</h1>

      <CategoryCreateForm />

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Название</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Товаров</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((cat) => (
              <tr key={cat.id} className="bg-card hover:bg-muted transition-colors">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{cat.slug}</td>
                <td className="px-4 py-3 text-muted-foreground">{cat._count.products}</td>
                <td className="px-4 py-3">
                  <Badge variant={cat.isActive ? "success" : "default"}>
                    {cat.isActive ? "Активна" : "Скрыта"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
