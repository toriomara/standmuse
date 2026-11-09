"use client"

import { Button } from "@/components/ui/Button"
import { Input, Textarea } from "@/components/ui/Input"
import { SaveStatus } from "@/components/admin/SaveStatus"
import { useSettingsForm } from "@/hooks/useSettingsForm"

const DEFAULTS = {
  defaultTitle: "StandMuse — Акустические стойки на заказ",
  defaultDesc: "Премиальные акустические и HI-FI стойки ручной работы. Массив дерева, металл, виброразвязка.",
  ogImage: "",
  googleVerification: "",
  yandexVerification: "",
}

export default function AdminSeoPage() {
  const { field, save, loaded, pending, error, done } = useSettingsForm(DEFAULTS, "seo")

  return (
    <div className="max-w-lg flex flex-col gap-6">
      <h1 className="text-2xl font-bold">SEO настройки</h1>
      <div className="flex flex-col gap-4 p-6 rounded-xl border border-border bg-card">
        <Input label="Title по умолчанию" {...field("defaultTitle")} />
        <Textarea label="Description по умолчанию" rows={3} {...field("defaultDesc")} />
        <Input label="OG Image URL" {...field("ogImage")} />
        <Input label="Google Verification" {...field("googleVerification")} />
        <Input label="Yandex Verification" {...field("yandexVerification")} />
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
