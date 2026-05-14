export const dynamic = "force-dynamic"
import { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/Button"
import { SectionTitle } from "@/components/shared/SectionTitle"
import { Breadcrumbs } from "@/components/shared/Breadcrumbs"
import { ProductCard } from "@/components/catalog/ProductCard"
import { cn } from "@/lib/utils"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ series?: string }>
}

const staticCategories: Record<string, string> = {
  "acoustic-stands": "Акустические стойки",
  "hifi-stands": "Стойки для HI-FI аудио",
  "acoustic-panels": "Акустические панели",
  diffusers: "Диффузоры",
  podiums: "Подиумы",
  accessories: "Аксессуары",
}

const SERIES = [
  { name: "Adagio",     tag: "Глубина и стабильность", desc: "Металл 4–5 мм, профили 120×120" },
  { name: "Allegro",    tag: "Чёткость и динамика",    desc: "Профиль 120×80, стенка 3–4 мм" },
  { name: "Cantabile",  tag: "Певучесть и дерево",     desc: "Акцент на натуральном массиве" },
  { name: "Fortissimo", tag: "Мощь и контроль",        desc: "Максимальная толщина 5 мм" },
  { name: "Legato",     tag: "Плавность звука",        desc: "Универсальные, мягкий дизайн" },
]

const categoryMeta: Record<string, { title: string; description: string; keywords?: string[] }> = {
  "acoustic-stands": {
    title: "Акустические стойки на заказ — стойки для акустических колонок",
    description:
      "Акустические стойки ручной работы на заказ. Стойки под акустические колонки из массива дерева и металла. Комплект пары от 16 000 ₽. Индивидуальные размеры и высота, изготовление 14 дней.",
    keywords: [
      "акустические стойки",
      "стойки для акустических колонок",
      "купить акустическую стойку",
      "комплект акустических стоек",
      "стойки под акустические колонки",
      "стойка напольная акустическая",
      "высота акустических стоек",
    ],
  },
  "hifi-stands": {
    title: "Стойки для HI-FI аудио на заказ",
    description:
      "HI-FI стойки ручной работы из массива дерева и металла. Под усилители, ЦАП, виниловые проигрыватели. Индивидуальные размеры и отделка, изготовление 14 дней.",
  },
  "acoustic-panels": {
    title: "Акустические панели на заказ",
    description:
      "Акустические панели ручной работы для улучшения акустики комнаты. Поглотители и рассеиватели из натурального дерева. Индивидуальные размеры.",
  },
  diffusers: {
    title: "Диффузоры акустические на заказ",
    description:
      "QRD-диффузоры и другие рассеиватели звука ручной работы из дерева. Улучшение акустики помещения без «мертвого» звука.",
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = categoryMeta[slug]
  if (meta) {
    return {
      title: meta.title,
      description: meta.description,
      ...(meta.keywords && { keywords: meta.keywords }),
    }
  }
  const name = staticCategories[slug] ?? slug
  return {
    title: `${name} на заказ`,
    description: `Каталог изделий категории «${name}» ручной работы. Индивидуальные размеры и отделка.`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { series: activeSeries } = await searchParams

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      },
    },
  }).catch(() => null)

  const categoryName = staticCategories[slug] ?? slug

  const filtered = activeSeries
    ? (category?.products ?? []).filter(p => p.name.startsWith(activeSeries))
    : (category?.products ?? [])

  const displayTitle = activeSeries
    ? `Серия ${activeSeries}`
    : (category?.name ?? categoryName)

  const isAcousticStands = slug === "acoustic-stands"

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <Breadcrumbs
        className="mb-8"
        items={[
          { label: "Каталог", href: "/catalog" },
          { label: categoryName },
        ]}
      />

      {/* Series concept block — acoustic-stands only */}
      {isAcousticStands && (
        <div className="mb-12 p-6 rounded-2xl border border-border bg-card">
          <div className="mb-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-1">
              Акустические тональности
            </p>
            <p className="text-sm text-muted-foreground">
              Каждая серия — музыкальный образ и конструктивный характер.
              Название формируется по принципу{" "}
              <span className="text-foreground font-medium">[Серия] [Порода дерева]</span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SERIES.map((s) => {
              const isActive = activeSeries === s.name
              return (
                <Link
                  key={s.name}
                  href={isActive ? "/catalog/acoustic-stands" : `/catalog/acoustic-stands?series=${s.name}`}
                  className={cn(
                    "rounded-xl border p-3.5 flex flex-col gap-1 transition-colors",
                    isActive
                      ? "ring-1 ring-accent border-accent bg-accent/5"
                      : "border-border hover:border-accent/50 hover:bg-muted/50"
                  )}
                >
                  <span className="font-display text-base font-bold leading-tight">{s.name}</span>
                  <span className="text-[11px] font-medium text-accent leading-tight">{s.tag}</span>
                  <span className="text-[11px] text-muted-foreground leading-snug mt-0.5">{s.desc}</span>
                </Link>
              )
            })}
          </div>

          {activeSeries && (
            <div className="mt-4">
              <Link
                href="/catalog/acoustic-stands"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
              >
                ← Все серии
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="flex items-end justify-between gap-4 mb-12">
        <SectionTitle
          title={displayTitle}
          subtitle={!activeSeries ? (category?.description ?? undefined) : undefined}
        />
        <Link href="/order">
          <Button>Заказать</Button>
        </Link>
      </div>

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                shortDesc: product.shortDesc,
                priceFrom: product.priceFrom,
                images: product.images,
                categoryId: product.categoryId,
                materials: product.materials,
                features: product.features,
                isFeatured: isAcousticStands ? false : product.isFeatured,
              }}
              categorySlug={slug}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <p className="text-muted-foreground text-lg">
            {activeSeries
              ? `Товаров серии «${activeSeries}» пока нет`
              : "Товары этой категории пока добавляются"}
          </p>
          {activeSeries ? (
            <Link href="/catalog/acoustic-stands" className="text-sm text-accent hover:underline">
              Показать все стойки
            </Link>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Вы можете сразу оформить индивидуальный заказ
              </p>
              <Link href="/order">
                <Button size="lg">Сконфигурировать заказ</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
