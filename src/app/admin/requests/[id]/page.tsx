import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/Badge"
import { Field } from "@/components/ui/Field"
import { StatusUpdater } from "./StatusUpdater"
import { DeleteButton } from "./DeleteButton"
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
import {
  parseRequestOptions,
  parseRequestDimensions,
  formatDimensions,
  formatRequestId,
} from "@/lib/requestFormat"

export const dynamic = "force-dynamic"

export const metadata: Metadata = { title: "Admin — Заявка" }

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const req = await prisma.request.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true } } },
  })

  if (!req) notFound()

  const s = REQUEST_STATUS_MAP[req.status] ?? { label: req.status, variant: "default" as const }

  const dims = parseRequestDimensions(req.dimensions)
  const { technical: technicalOptions, column: columnOpt, platform: platformOpt } = parseRequestOptions(req.options)

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link
        href="/admin/requests"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Все заявки
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Заявка</h1>
          <p className="text-xs text-muted-foreground mt-1 font-mono">{formatRequestId(req.id)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {req.createdAt.toLocaleDateString("ru-RU", {
              day: "numeric", month: "long", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 self-start">
          <Badge variant={s.variant} className="text-sm px-3 py-1">
            {s.label}
          </Badge>
          <DeleteButton requestId={req.id} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm font-semibold mb-3">Изменить статус</p>
        <StatusUpdater requestId={req.id} currentStatus={req.status} />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4">Контактные данные</h2>
        <dl className="grid sm:grid-cols-3 gap-4">
          <Field label="Имя" value={req.name} />
          <Field label="Email" value={req.email} />
          <Field label="Телефон" value={req.phone} />
        </dl>
        {req.user && (
          <p className="text-xs text-muted-foreground mt-4">
            Зарегистрированный пользователь: {req.user.name ?? req.user.email}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4">Параметры изделия</h2>
        <dl className="grid sm:grid-cols-2 gap-4">
          <Field label="Тип изделия" value={PRODUCT_TYPE_LABELS[req.productType] ?? req.productType} />
          <Field label="Материал" value={req.material ? (MATERIAL_LABELS[req.material] ?? req.material) : null} />
          <Field label="Цвет металла" value={req.color ? (METAL_COLOR_LABELS[req.color] ?? req.color) : null} />
          <Field label="Отделка металла" value={req.finish ? (FINISH_LABELS[req.finish] ?? req.finish) : null} />
          <Field label="Отделка дерева" value={req.baseFinish ? (BASE_FINISH_LABELS[req.baseFinish] ?? req.baseFinish) : null} />
          <Field label="Размеры" value={formatDimensions(dims.main)} />
          <Field label="Платформа" value={formatDimensions(dims.platform)} />
          <Field label="Основание" value={formatDimensions(dims.base)} />
          <Field label="Профиль колонны" value={columnOpt ? (COLUMN_PROFILE_LABELS[columnOpt] ?? columnOpt) : null} />
          <Field label="Толщина платформы" value={platformOpt ? (PLATFORM_THICKNESS_LABELS[platformOpt] ?? platformOpt) : null} />
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
          <h2 className="text-sm font-semibold mb-3">Комментарий клиента</h2>
          <p className="text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {req.message}
          </p>
        </div>
      )}
    </div>
  )
}
