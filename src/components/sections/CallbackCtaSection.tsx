"use client"

import { motion } from "framer-motion"
import { PhoneCall } from "lucide-react"
import { CallbackDialog } from "@/components/shared/CallbackDialog"

export function CallbackCtaSection() {
  return (
    <section className="py-14 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] px-5 py-10 sm:px-8 sm:py-14 lg:px-20 lg:py-20 text-center"
        >
          {/* Subtle radial glow behind the icon */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="h-[400px] w-[400px] rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Pulsing phone icon */}
            <div className="relative flex items-center justify-center">
              {/* Outer ping rings */}
              <span className="absolute inline-flex h-24 w-24 animate-ping rounded-full bg-[var(--accent)]/10 [animation-duration:3.5s]" />
              <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-[var(--accent)]/15 [animation-duration:3.5s] [animation-delay:1.2s]" />
              {/* Icon circle */}
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 shadow-lg shadow-[var(--accent)]/10">
                <PhoneCall className="h-9 w-9 text-[var(--accent)]" />
              </span>
            </div>

            {/* Text */}
            <div className="max-w-lg">
              <span className="text-xs font-semibold tracking-widest uppercase text-[var(--accent)] mb-3 block">
                Консультация
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold leading-tight mb-4">
                Не знаете, что выбрать?
              </h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed text-lg">
                Перезвоним, расскажем о материалах и вариантах, поможем подобрать стойки
                под вашу акустику
              </p>
            </div>

            {/* CTA */}
            <CallbackDialog>
              <button className="group relative inline-flex items-center gap-3 rounded-2xl bg-[var(--accent)] px-8 py-4 text-[var(--accent-foreground)] font-semibold text-base shadow-lg shadow-[var(--accent)]/25 hover:shadow-xl hover:shadow-[var(--accent)]/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                <PhoneCall className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12" />
                Перезвоним вам
              </button>
            </CallbackDialog>

            {/* Trust note */}
            <p className="text-xs text-[var(--muted-foreground)]">
              Перезвоним в течение нескольких часов · Звонок бесплатный
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
