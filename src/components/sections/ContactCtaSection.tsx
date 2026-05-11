"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/Button"
import { Input, Textarea } from "@/components/ui/Input"
import { contactSchema, type ContactInput } from "@/lib/validations"
import { CheckCircle2 } from "lucide-react"

export function ContactCtaSection() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactInput) => {
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setSent(true)
    reset()
  }

  return (
    <section className="py-24 lg:py-32 bg-[var(--card)] border-t border-[var(--border)]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--accent)] mb-4 block">
              Связаться
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Есть вопрос?<br />
              <span className="text-[var(--muted-foreground)]">Напишите нам</span>
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-8">
              Ответим в течение суток. Расскажем, что подойдёт под вашу акустику,
              какой материал лучше выбрать и сколько это стоит.
            </p>
            <div className="flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              <a href="mailto:info@standmuse.ru" className="hover:text-[var(--accent)] transition-colors">
                info@standmuse.ru
              </a>
              <span>Срок изготовления: 14 рабочих дней</span>
              <span>Доставка по всей России</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <h3 className="text-xl font-semibold">Сообщение отправлено</h3>
                <p className="text-[var(--muted-foreground)]">
                  Ответим в течение суток. Спасибо!
                </p>
                <Button variant="outline" onClick={() => setSent(false)}>
                  Написать ещё
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Имя"
                    placeholder="Александр"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="alex@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>
                <Input
                  label="Телефон (необязательно)"
                  type="tel"
                  placeholder="+7 900 000 00 00"
                  {...register("phone")}
                />
                <Textarea
                  label="Сообщение"
                  placeholder="Расскажите о своей акустике и что вас интересует..."
                  rows={5}
                  error={errors.message?.message}
                  {...register("message")}
                />
                <Button type="submit" size="lg" loading={isSubmitting}>
                  Отправить сообщение
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
