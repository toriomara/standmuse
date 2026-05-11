import type { Metadata } from "next"
import { ContactCtaSection } from "@/components/sections/ContactCtaSection"
import { SectionTitle } from "@/components/shared/SectionTitle"
import { Mail, Clock, MessageCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Контакты",
  description: "Свяжитесь с нами. Email, Telegram. Отвечаем в течение суток.",
}

export default function ContactsPage() {
  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <SectionTitle
          tag="Контакты"
          title="Свяжитесь с нами"
          subtitle="Задайте вопрос о заказе, материалах или уточните детали"
          className="mb-12"
        />

        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Mail,
              label: "Email",
              value: "info@standmuse.ru",
              href: "mailto:info@standmuse.ru",
            },
            {
              icon: MessageCircle,
              label: "Telegram",
              value: "@standmuse",
              href: "https://t.me/standmuse",
            },
            {
              icon: Clock,
              label: "Время ответа",
              value: "В течение суток",
            },
          ].map((contact) => (
            <div
              key={contact.label}
              className="flex flex-col gap-3 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]"
            >
              <div className="h-10 w-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                <contact.icon className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-1">{contact.label}</p>
                {contact.href ? (
                  <a
                    href={contact.href}
                    className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                  >
                    {contact.value}
                  </a>
                ) : (
                  <p className="font-semibold">{contact.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ContactCtaSection />
    </>
  )
}
