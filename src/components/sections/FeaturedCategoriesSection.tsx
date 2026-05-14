"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { SectionTitle } from "@/components/shared/SectionTitle"

const categories = [
  {
    name: "Акустические стойки",
    slug: "acoustic-stands",
    desc: "Под полочную и напольную акустику. Дерево + металл.",
    color: "from-blue-500/10 to-blue-600/5",
  },
  {
    name: "Стойки для HI-FI",
    slug: "hifi-stands",
    desc: "Для усилителей, CD-транспортов, DAC и другой техники.",
    color: "from-amber-500/10 to-amber-600/5",
  },
  {
    name: "Акустические панели",
    slug: "acoustic-panels",
    desc: "Управление звуком в комнате прослушивания.",
    color: "from-green-500/10 to-green-600/5",
  },
  {
    name: "Диффузоры",
    slug: "diffusers",
    desc: "Рассеивание звука для живого пространства.",
    color: "from-purple-500/10 to-purple-600/5",
  },
  {
    name: "Подиумы",
    slug: "podiums",
    desc: "Платформы под напольную акустику и усилители.",
    color: "from-orange-500/10 to-orange-600/5",
  },
  {
    name: "Аксессуары",
    slug: "accessories",
    desc: "Шипы, развязки, крепёж и дополнительные компоненты.",
    color: "from-rose-500/10 to-rose-600/5",
  },
]

export function FeaturedCategoriesSection() {
  return (
    <section className="py-14 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-12">
          <SectionTitle
            tag="Каталог"
            title="Все изделия — на заказ"
          />
          <Link
            href="/catalog"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:gap-2.5 transition-all"
          >
            Весь каталог <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
            >
              <Link
                href={`/catalog/${cat.slug}`}
                className={`group block h-full min-h-[180px] p-8 rounded-2xl bg-gradient-to-br ${cat.color} border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all hover:shadow-lg`}
              >
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
                  {cat.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] group-hover:gap-2 transition-all">
                  Подробнее <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
