"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { inputCls, labelCls } from "../_formClasses"

interface OrderParams {
  height?: string
  base?: string
  column?: string
  platform?: string
  color?: string
  baseFinish?: string
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  )
}

export function OrderParamsEditor({ orderId, params }: { orderId: string; params: OrderParams }) {
  const [values, setValues] = useState<OrderParams>(params)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const set = (k: keyof OrderParams, v: string) => {
    setValues((p) => ({ ...p, [k]: v }))
    setSaved(false)
  }

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    try {
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, v]) => (v as string).trim())
      )
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ params: Object.keys(payload).length ? payload : null }),
      })
      setSaved(true)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Общая высота">
          <input value={values.height ?? ""} onChange={(e) => set("height", e.target.value)} placeholder="600 мм" className={inputCls} />
        </Field>
        <Field label="Цвет">
          <input value={values.color ?? ""} onChange={(e) => set("color", e.target.value)} placeholder="RAL 9003, чёрный…" className={inputCls} />
        </Field>
        <Field label="Основание">
          <input value={values.base ?? ""} onChange={(e) => set("base", e.target.value)} placeholder="Груша, Дуб…" className={inputCls} />
        </Field>
        <Field label="Обработка основания">
          <input value={values.baseFinish ?? ""} onChange={(e) => set("baseFinish", e.target.value)} placeholder="Масло, лак, воск…" className={inputCls} />
        </Field>
        <Field label="Колонна">
          <input value={values.column ?? ""} onChange={(e) => set("column", e.target.value)} placeholder="100×100×4 мм" className={inputCls} />
        </Field>
        <Field label="Платформа">
          <input value={values.platform ?? ""} onChange={(e) => set("platform", e.target.value)} placeholder="250×200×4 мм" className={inputCls} />
        </Field>
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handleSave} loading={loading}>Сохранить</Button>
        {saved && <span className="text-sm text-green-600 dark:text-green-400">Сохранено</span>}
      </div>
    </div>
  )
}
