"use client"

import { Button } from "@/components/ui/Button"
import { Input, Textarea } from "@/components/ui/Input"
import { SaveStatus } from "@/components/admin/SaveStatus"
import { useSettingsForm } from "@/hooks/useSettingsForm"

const DEFAULTS = {
  siteName: "StandMuse",
  siteDesc: "",
  email: "info@standmuse.ru",
  phone: "",
  telegram: "@standmuse",
}

export default function AdminSettingsPage() {
  const { field, save, loaded, pending, error, done } = useSettingsForm(DEFAULTS)

  return (
    <div className="max-w-lg flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Настройки сайта</h1>
      <div className="flex flex-col gap-4 p-6 rounded-xl border border-border bg-card">
        <Input label="Название сайта" {...field("siteName")} />
        <Textarea label="Описание сайта" rows={2} {...field("siteDesc")} />
        <Input label="Email" {...field("email")} />
        <Input label="Телефон" {...field("phone")} />
        <Input label="Telegram" {...field("telegram")} />
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={save} loading={pending} disabled={!loaded}>
          Сохранить
        </Button>
        <SaveStatus done={done} error={error} />
      </div>
    </div>
  )
}
