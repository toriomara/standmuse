"use client"

import { useState } from "react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

interface Props {
  name: string
  email: string
  phone: string
}

export function ProfileForm({ name, email, phone }: Props) {
  const [values, setValues] = useState({ name, phone })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isDirty = values.name !== name || values.phone !== phone

  async function handleSave() {
    setLoading(true)
    setError("")
    setSaved(false)
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error()
      setSaved(true)
    } catch {
      setError("Не удалось сохранить. Попробуйте снова.")
    } finally {
      setLoading(false)
    }
  }

  function handleChange(field: "name" | "phone") {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }))
      setSaved(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card">
      <Input label="Имя" value={values.name} onChange={handleChange("name")} />
      <Input label="Email" type="email" value={email} readOnly className="opacity-60" />
      <Input
        label="Телефон"
        type="tel"
        placeholder="+7 900 000 00 00"
        value={values.phone}
        onChange={handleChange("phone")}
      />

      <div className="flex items-center gap-3 pt-1">
        <Button onClick={handleSave} loading={loading} disabled={!isDirty}>
          Сохранить
        </Button>
        {saved && <span className="text-sm text-green-600 dark:text-green-400">Сохранено</span>}
        {error && <span className="text-sm text-destructive">{error}</span>}
      </div>
    </div>
  )
}
