"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { X, PhoneCall, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/Button"

interface FormState {
  name: string
  phone: string
}

export function CallbackDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>({ name: "", phone: "" })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType: "callback",
          name: form.name,
          phone: form.phone,
          message: "Запрос обратного звонка",
        }),
      })
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (val: boolean) => {
    setOpen(val)
    if (!val) {
      setTimeout(() => {
        setDone(false)
        setForm({ name: "", phone: "" })
      }, 300)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-[fadeIn_150ms_ease] data-[state=closed]:animate-[fadeOut_150ms_ease]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl p-6 data-[state=open]:animate-[slideInUp_200ms_ease] data-[state=closed]:animate-[slideOutDown_150ms_ease] focus:outline-none">
          <Dialog.Close aria-label="Закрыть диалог" className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" aria-hidden="true" />
          </Dialog.Close>

          {done ? (
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <CheckCircle2 className="h-10 w-10 text-[var(--accent)]" />
              <p className="font-semibold text-lg">Спасибо!</p>
              <p className="text-sm text-muted-foreground">Свяжемся с вами в течение нескольких часов.</p>
              <Button className="mt-2 w-full" onClick={() => handleOpenChange(false)}>Закрыть</Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10">
                  <PhoneCall className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <div>
                  <Dialog.Title className="font-semibold text-base leading-tight">Обратный звонок</Dialog.Title>
                  <Dialog.Description className="text-xs text-muted-foreground mt-0.5">
                    Перезвоним в течение нескольких часов
                  </Dialog.Description>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="callback-name" className="text-xs font-medium text-muted-foreground">Имя</label>
                  <input
                    id="callback-name"
                    type="text"
                    required
                    aria-required="true"
                    placeholder="Ваше имя"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-(--accent)/50"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="callback-phone" className="text-xs font-medium text-muted-foreground">Телефон</label>
                  <input
                    id="callback-phone"
                    type="tel"
                    required
                    aria-required="true"
                    placeholder="+7 000 000-00-00"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-(--accent)/50"
                  />
                </div>
                <Button type="submit" className="mt-1 w-full" loading={loading}>
                  Перезвоните мне
                </Button>
              </form>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
