import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionTitle } from "@/components/shared/SectionTitle"

export const metadata: Metadata = {
  title: "Каталог — Акустические стойки и аксессуары",
  description:
    "Каталог акустических стоек, HI-FI стоек, акустических панелей, диффузоров и аксессуаров ручной работы на заказ.",
}

const categories = [
  {
    name: "Акустические стойки",
    slug: "acoustic-stands",
    desc: "Стойки под полочную акустику с трёхуровневой системой виброгашения. Дерево, металл, песок.",
    specs: ["Дерево 40 мм", "Металл 4–8 мм", "Кварцевый песок"],
  },
  {
    name: "Стойки для HI-FI аудио",
    slug: "hifi-stands",
    desc: "Подставки и стойки для усилителей, CD-транспортов, DAC, фонокорректоров и другого оборудования.",
    specs: ["Индивидуальные размеры", "Виброразвязка", "Любая отделка"],
  },
  {
    name: "Акустические панели",
    slug: "acoustic-panels",
    desc: "Поглощающие и рассеивающие панели для управления звуком в комнате прослушивания.",
    specs: ["Разные размеры", "Ткань или рейки", "Монтаж в комплекте"],
  },
  {
    name: "Диффузоры",
    slug: "diffusers",
    desc: "QRD и другие диффузоры для создания живого пространства без стоячих волн.",
    specs: ["Математически точный расчёт", "Массив дерева", "Под заказ"],
  },
  {
    name: "Подиумы",
    slug: "podiums",
    desc: "Дубовые платформы под полочную и напольную акустику. Увеличивают контактную массу, снижают резонансы.",
    specs: ["Цельноламельный дуб", "Масло-воск Borma", "Пара в комплекте"],
  },
  {
    name: "Аксессуары",
    slug: "accessories",
    desc: "Шипы, антивибрационные прокладки, крепёж и дополнительные компоненты для аудиосистем.",
    specs: ["Шипы металлические", "Сорбитель", "Крепёж M8"],
  },
]

export default function CatalogPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <SectionTitle
        tag="Каталог"
        title="Все изделия на заказ"
        subtitle="Каждое изделие изготавливается под ваши параметры. Выберите категорию"
        className="mb-12"
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/catalog/${cat.slug}`}
            className="group flex flex-col gap-4 p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/60 hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold group-hover:text-[var(--accent)] transition-colors leading-snug">
              {cat.name}
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed flex-1">
              {cat.desc}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {cat.specs.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]"
                >
                  {s}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] group-hover:gap-2.5 transition-all">
              Смотреть <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
