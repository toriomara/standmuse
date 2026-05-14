"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input, Textarea } from "@/components/ui/Input"

export default function AdminSeoPage() {
  const [data, setData] = useState({
    defaultTitle: "StandMuse — Акустические стойки на заказ",
    defaultDesc: "Премиальные акустические и HI-FI стойки ручной работы. Массив дерева, металл, виброразвязка.",
    ogImage: "",
    googleVerification: "",
    yandexVerification: "",
  })

  const save = async () => {
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seo: data }),
    })
  }

  return (
    <div className="max-w-lg flex flex-col gap-6">
      <h1 className="text-2xl font-bold">SEO настройки</h1>
      <div className="flex flex-col gap-4 p-6 rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <Input label="Title по умолчанию" value={data.defaultTitle} onChange={(e) => setData({ ...data, defaultTitle: e.target.value })} />
        <Textarea label="Description по умолчанию" rows={3} value={data.defaultDesc} onChange={(e) => setData({ ...data, defaultDesc: e.target.value })} />
        <Input label="OG Image URL" value={data.ogImage} onChange={(e) => setData({ ...data, ogImage: e.target.value })} />
        <Input label="Google Verification" value={data.googleVerification} onChange={(e) => setData({ ...data, googleVerification: e.target.value })} />
        <Input label="Yandex Verification" value={data.yandexVerification} onChange={(e) => setData({ ...data, yandexVerification: e.target.value })} />
      </div>
      <Button onClick={save}>Сохранить</Button>
    </div>
  )
}
