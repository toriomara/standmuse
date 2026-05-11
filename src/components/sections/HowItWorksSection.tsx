"use client"

import { motion } from "framer-motion"
import { SectionTitle } from "@/components/shared/SectionTitle"
import { SlidersHorizontal, ClipboardCheck, Package } from "lucide-react"

const steps = [
  {
    icon: SlidersHorizontal,
    step: "01",
    title: "Конфигурируете",
    desc: "Выберите тип изделия, размеры, материал, цвет и отделку. Загрузите фото своей акустики как референс",
  },
  {
    icon: ClipboardCheck,
    step: "02",
    title: "Согласовываем детали",
    desc: "Свяжемся с вами в течение суток. Обсудим нюансы, подтвердим параметры и сроки изготовления — 14 рабочих дней",
  },
  {
    icon: Package,
    step: "03",
    title: "Забираете заказ",
    desc: "Доставка Почтой России, СДЭК или другой ТК по договорённости. Каждая стойка упакована с защитой",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-14 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          tag="Как это работает"
          title="Три шага до идеального звука"
          align="center"
          className="mb-16"
        />

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-2 border-[var(--border)] bg-[var(--card)] flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-[var(--accent)]" />
                </div>
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
