"use client"

import { motion } from "framer-motion"
import { SectionTitle } from "@/components/shared/SectionTitle"
import { TreePine, Layers, Settings2, Truck } from "lucide-react"

const benefits = [
  {
    icon: TreePine,
    title: "Массив дерева как демпфер",
    desc: "Основание 40 мм из дуба, бука или ясеня гасит высокочастотные резонансы. Масло + воск — сохраняют акустические свойства дерева.",
  },
  {
    icon: Layers,
    title: "Стальная колонна с песком",
    desc: "Профтруба 120×120×5 мм заполнена кварцевым песком (5 кг). Гасит вибрации стойки и предотвращает передачу их на акустику.",
  },
  {
    icon: Settings2,
    title: "Виброразвязка шипами",
    desc: "Четыре регулируемых шипа обеспечивают жёсткий контакт с полом. Нет «плавающего» баса — только чистый артикулированный звук.",
  },
  {
    icon: Truck,
    title: "Под вашу модель акустики",
    desc: "Платформа и основание — любых размеров. Металл 4–8 мм, порошковая окраска матовая или муар. Доставка СДЭК по всей России.",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-14 lg:py-24 bg-[var(--muted)]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <SectionTitle
            tag="Почему StandMuse"
            title="Инженерия звука — не просто слова"
            subtitle="Каждая деталь влияет на то, как вы слышите музыку. Мы разработали трёхуровневую систему виброгашения, которая раскрывает весь потенциал вашей акустики"
          />

          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-3 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
              >
                <div className="h-10 w-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <h3 className="font-semibold text-base leading-snug">{item.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
