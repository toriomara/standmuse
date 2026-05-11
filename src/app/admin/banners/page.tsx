export const dynamic = "force-dynamic"
import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/Badge"
export const metadata: Metadata = { title: "Admin — Баннеры" }

export default async function AdminBannersPage() {
  const banners = await prisma.banner
    .findMany({ orderBy: { sortOrder: "asc" } })
    .catch(() => [])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Баннеры</h1>

      {banners.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-[var(--border)] text-[var(--muted-foreground)]">
          Баннеров пока нет
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {banners.map((b) => (
            <div key={b.id} className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <div>
                <p className="font-medium">{b.title}</p>
                {b.subtitle && <p className="text-sm text-[var(--muted-foreground)]">{b.subtitle}</p>}
              </div>
              <Badge variant={b.isActive ? "success" : "default"}>
                {b.isActive ? "Активен" : "Скрыт"}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
