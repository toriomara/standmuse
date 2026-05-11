export const dynamic = "force-dynamic"
import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { ChevronRight } from "lucide-react"
import { REQUEST_STATUS_MAP } from "@/constants/statusMaps"
import { PRODUCT_TYPE_LABELS, MATERIAL_LABELS, METAL_COLOR_LABELS } from "@/constants/requestMaps"
import { getSessionUserId } from "@/lib/session"
import { formatDimensions, formatRequestId, parseRequestDimensions } from "@/lib/requestFormat"

export const metadata: Metadata = { title: "Мои заявки — StandMuse" }

export default async function AccountOrdersPage() {
  const session = await auth()
  const userId = getSessionUserId(session)

  const requests = userId
    ? await prisma.request.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Мои заявки</h1>
          <p className="text-sm text-muted-foreground mt-1">История всех ваших заявок на изготовление</p>
        </div>
        <Link href="/order">
          <Button size="sm">Новая заявка</Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-border border-dashed">
          <p className="text-muted-foreground mb-4">Заявок пока нет</p>
          <Link href="/order">
            <Button variant="outline">Оформить первую заявку</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((req) => {
            const s = REQUEST_STATUS_MAP[req.status] ?? { label: req.status, variant: "outline" as const }
            const productLabel = PRODUCT_TYPE_LABELS[req.productType] ?? req.productType
            const materialLabel = req.material ? (MATERIAL_LABELS[req.material] ?? req.material) : null
            const colorLabel = req.color ? (METAL_COLOR_LABELS[req.color] ?? req.color) : null
            const dims = parseRequestDimensions(req.dimensions)
            const dimsText = formatDimensions(dims.main)

            return (
              <Link
                key={req.id}
                href={`/account/orders/${req.id}`}
                className="rounded-xl border border-border bg-card p-4 sm:p-5 hover:border-accent transition-colors block"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{productLabel}</p>
                      <Badge variant={s.variant}>{s.label}</Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {req.createdAt.toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    {dimsText && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Размеры: {dimsText}
                      </p>
                    )}

                    {materialLabel && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Материал: {materialLabel}
                      </p>
                    )}

                    {colorLabel && (
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        Цвет металла:
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full border border-border/40"
                          style={{ backgroundColor: { black: "#1c1c1c", anthracite: "#4a4a52", silver: "#a8a9ad", white: "#f0f0f0", bronze: "#b5803a" }[req.color!] ?? "#888" }}
                        />
                        {colorLabel}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                    <p className="text-[0.65rem] font-mono text-muted-foreground/60">
                      {formatRequestId(req.id)}
                    </p>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
