"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { SectionTitle } from "@/components/shared/SectionTitle"

interface Wood {
  name: string
  desc: string
  image?: string
}

const woods: Wood[] = [
  { name: "Дуб",     desc: "Плотный, тяжёлый. Максимальное демпфирование", image: "/wood/oak.jpg" },
  { name: "Бук",     desc: "Упругий, равномерный. Универсальный выбор",     image: "/wood/beech.jpg" },
  { name: "Ясень",   desc: "Жёсткий, с красивой текстурой. Визуальный акцент", image: "/wood/ash.jpg" },
  { name: "Вишня",   desc: "Мягкий тон, тёплый цвет. Для интерьеров",      image: "/wood/cherry.jpg" },
  { name: "Карагач", desc: "Экзотическая текстура. Редкий материал",         image: "/wood/elm.jpg" },
  { name: "Орех",    desc: "Тёмный, благородный. Премиальная отделка",      image: "/wood/walnut.jpg" },
  { name: "Берёза",  desc: "Лёгкий и прочный. Светлые интерьеры",           image: "/wood/birch.jpg" },
  { name: "Груша",   desc: "Плотная структура. Изысканный внешний вид",      image: "/wood/pear.jpg" },
]

const metals = [
  { spec: "Платформа",  value: "сталь 4–8 мм" },
  { spec: "Колонна",    value: "профтруба 120×120 (3–5 мм)" },
  { spec: "Основание",  value: "от 30 мм, стандарт 40 мм" },
  { spec: "Окраска",    value: "Порошковая матовая / муар" },
  { spec: "Заполнение", value: "кварцевым песком" },
  { spec: "Шипы",       value: "М6–М8 в основании АС" },
]

// Entrance animation is per-card (with staggered delay).
// Hover uses its own spring — no delay — via whileHover + component-level transition.
const cardVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay, type: "spring" as const, stiffness: 200, damping: 20 },
  }),
}

export function MaterialsSection() {
  return (
    <section className="py-14 lg:py-24 bg-muted">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          tag="Материалы"
          title="Только то, что влияет на звук"
          subtitle="Выбор материала — не только эстетика, но и акустика. Каждая порода дерева звучит по-своему"
          className="mb-16"
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Wood grid */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-6">
              Массив дерева
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-visible">
              {woods.map((wood, i) => (
                <motion.div
                  key={wood.name}
                  custom={i * 0.04}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.45, zIndex: 50 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  className="group relative rounded-2xl border border-border bg-card cursor-default overflow-hidden shadow-sm"
                >
                  {/* Image area */}
                  <div className="relative aspect-4/3 bg-muted overflow-hidden">
                    {wood.image ? (
                      <Image
                        src={wood.image}
                        alt={`Текстура ${wood.name}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-linear-to-br from-muted to-muted/60">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-7 w-7 text-muted-foreground/25"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.2}
                          aria-hidden="true"
                        >
                          <path d="M12 3C9 7 6 9 6 13a6 6 0 0012 0c0-4-3-6-6-10z" />
                          <line x1="12" y1="21" x2="12" y2="13" />
                        </svg>
                        <span className="text-[10px] text-muted-foreground/40 tracking-wide">фото</span>
                      </div>
                    )}

                    {/* Description overlay */}
                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                      <p className="text-xs text-white leading-snug">{wood.desc}</p>
                    </div>
                  </div>

                  {/* Name bar */}
                  <div className="px-3 py-2.5 border-t border-border group-hover:border-accent transition-colors">
                    <p className="text-sm font-semibold leading-tight">{wood.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Metal specs */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-6">
              Металл и конструкция
            </h3>
            <div className="flex flex-col divide-y divide-border">
              {metals.map((item, i) => (
                <motion.div
                  key={item.spec}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center justify-between py-4"
                >
                  <span className="text-sm text-muted-foreground">{item.spec}</span>
                  <span className="text-sm font-semibold">{item.value}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-accent/10 border border-accent/20">
              <p className="text-sm font-semibold mb-1">Результат в звуке:</p>
              <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                <li>— Бас чёткий и артикулированный, с текстурой</li>
                <li>— Высокие раскрылись: шелест струн, дыхание вокала</li>
                <li>— Полное погружение в музыку</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
