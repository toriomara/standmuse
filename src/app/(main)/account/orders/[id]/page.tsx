export const dynamic = "force-dynamic"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Badge } from "@/components/ui/Badge"
import { Field } from "@/components/ui/Field"
import { REQUEST_STATUS_MAP } from "@/constants/statusMaps"
import {
  PRODUCT_TYPE_LABELS,
  MATERIAL_LABELS,
  METAL_COLOR_LABELS,
  FINISH_LABELS,
  BASE_FINISH_LABELS,
  COLUMN_PROFILE_LABELS,
  PLATFORM_THICKNESS_LABELS,
  OPTION_LABELS,
} from "@/constants/requestMaps"
import { getSessionUserId } from "@/lib/session"
import {
  parseRequestOptions,
  parseRequestDimensions,
  formatDimensions,
  formatRequestId,
} from "@/lib/requestFormat"

export const metadata: Metadata = { title: "Заявка — StandMuse" }

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const userId = getSessionUserId(session)
  if (!userId) redirect("/auth/login")

  const { id } = await params
  const req = await prisma.request.findUnique({ where: { id } })

  if (!req || req.userId !== userId) notFound()

  const s = REQUEST_STATUS_MAP[req.status] ?? { label: req.status, variant: "default" as const }
  const dims = parseRequestDimensions(req.dimensions)
  const { technical: technicalOptions, column: columnOpt, platform: platformOpt } = parseRequestOptions(req.options)

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link
        href="/account/orders"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Мои заявки
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {PRODUCT_TYPE_LABELS[req.productType] ?? req.productType}
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-mono">{formatRequestId(req.id)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {req.createdAt.toLocaleDateString("ru-RU", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
        <Badge variant={s.variant} className="self-start text-sm px-3 py-1">
          {s.label}
        </Badge>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4">Контактные данные</h2>
        <dl className="grid sm:grid-cols-3 gap-4">
          <Field label="Имя" value={req.name} />
          <Field label="Email" value={req.email} />
          <Field label="Телефон" value={req.phone} />
        </dl>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4">Параметры изделия</h2>
        <dl className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Материал"
            value={req.material ? (MATERIAL_LABELS[req.material] ?? req.material) : null}
          />
          <Field
            label="Цвет металла"
            value={req.color ? (METAL_COLOR_LABELS[req.color] ?? req.color) : null}
          />
          <Field
            label="Отделка металла"
            value={req.finish ? (FINISH_LABELS[req.finish] ?? req.finish) : null}
          />
          <Field
            label="Отделка дерева"
            value={req.baseFinish ? (BASE_FINISH_LABELS[req.baseFinish] ?? req.baseFinish) : null}
          />
          <Field
            label="Профиль колонны"
            value={columnOpt ? (COLUMN_PROFILE_LABELS[columnOpt] ?? columnOpt) : null}
          />
          <Field
            label="Толщина платформы"
            value={platformOpt ? (PLATFORM_THICKNESS_LABELS[platformOpt] ?? platformOpt) : null}
          />
          <Field label="Размеры" value={formatDimensions(dims.main)} />
          <Field label="Платформа" value={formatDimensions(dims.platform)} />
          <Field label="Основание" value={formatDimensions(dims.base)} />
        </dl>
      </div>

      {technicalOptions.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold mb-4">Дополнительные опции</h2>
          <ul className="flex flex-col gap-1.5">
            {technicalOptions.map((opt) => (
              <li key={opt} className="text-sm flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                {OPTION_LABELS[opt] ?? opt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {req.message && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold mb-3">Комментарий</h2>
          <p className="text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {req.message}
          </p>
        </div>
      )}
    </div>
  )
}
