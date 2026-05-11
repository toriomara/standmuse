"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input, Textarea } from "@/components/ui/Input"

interface Settings {
  siteName: string; siteDesc: string; email: string; phone: string; telegram: string;
}

export default function AdminSettingsPage() {
  const [data, setData] = useState<Settings>({
    siteName: "StandMuse", siteDesc: "", email: "info@standmuse.ru",
    phone: "", telegram: "@standmuse",
  })
  const [saved, setSaved] = useState(false)

  const save = async () => {
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-lg flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Настройки сайта</h1>
      <div className="flex flex-col gap-4 p-6 rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <Input label="Название сайта" value={data.siteName} onChange={(e) => setData({ ...data, siteName: e.target.value })} />
        <Textarea label="Описание сайта" rows={2} value={data.siteDesc} onChange={(e) => setData({ ...data, siteDesc: e.target.value })} />
        <Input label="Email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
        <Input label="Телефон" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
        <Input label="Telegram" value={data.telegram} onChange={(e) => setData({ ...data, telegram: e.target.value })} />
      </div>
      <Button onClick={save}>{saved ? "Сохранено ✓" : "Сохранить"}</Button>
    </div>
  )
}
