export const dynamic = "force-dynamic"
import { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/Badge"
import { REQUEST_STATUS_MAP } from "@/constants/statusMaps"
import { PRODUCT_TYPE_LABELS, MATERIAL_LABELS, METAL_COLOR_LABELS } from "@/constants/requestMaps"

export const metadata: Metadata = { title: "Admin — Заявки" }

export default async function AdminRequestsPage() {
  const requests = await prisma.request.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Заявки</h1>
        <p className="text-sm text-muted-foreground">{requests.length} заявок</p>
      </div>

      <div className="rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Имя</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Тип</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Телефон</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Материал</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Цвет металла</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Дата</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Статус</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                  Заявок пока нет
                </td>
              </tr>
            ) : (
              requests.map((req) => {
                const s = REQUEST_STATUS_MAP[req.status] ?? { label: req.status, variant: "default" as const }
                return (
                  <tr key={req.id} className="bg-card hover:bg-muted transition-colors">
                    <td className="px-4 py-3 font-medium">{req.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{PRODUCT_TYPE_LABELS[req.productType] ?? req.productType}</td>
                    <td className="px-4 py-3 text-muted-foreground">{req.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{req.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{req.material ? (MATERIAL_LABELS[req.material] ?? req.material) : "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {req.color ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="h-3 w-3 rounded-full border border-border/40 shrink-0"
                            style={{ backgroundColor: { black: "#1c1c1c", anthracite: "#4a4a52", silver: "#a8a9ad", white: "#f0f0f0", bronze: "#b5803a" }[req.color] ?? "#888" }}
                          />
                          {METAL_COLOR_LABELS[req.color] ?? req.color}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {req.createdAt.toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={s.variant}>{s.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/requests/${req.id}`}
                        className="text-sm font-medium text-accent hover:underline whitespace-nowrap"
                      >
                        Открыть →
                      </Link>
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
