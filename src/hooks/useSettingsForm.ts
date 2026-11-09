"use client"

import { useEffect, useRef, useState } from "react"
import { apiRequest } from "@/lib/api-client"
import { useAsyncAction } from "@/hooks/useAsyncAction"

type Values = Record<string, string>

/**
 * Форма настроек сайта: подгружает сохранённые значения поверх `defaults` и
 * сохраняет их. С `scope` значения лежат во вложенном ключе (например, `seo`).
 */
export function useSettingsForm<T extends Values>(defaults: T, scope?: string) {
  const defaultsRef = useRef(defaults)
  const [data, setData] = useState<T>(defaults)
  const [loaded, setLoaded] = useState(false)
  const { pending, error, done, run, reset } = useAsyncAction()

  useEffect(() => {
    apiRequest<Record<string, unknown>>("/api/admin/settings")
      .then((stored) => {
        const source = scope ? stored[scope] : stored
        if (!source || typeof source !== "object") return
        const known = Object.keys(defaultsRef.current)
        const saved = Object.fromEntries(
          Object.entries(source).filter(([k, v]) => known.includes(k) && typeof v === "string"),
        )
        setData((prev) => ({ ...prev, ...saved }))
      })
      .catch(() => {}) // не удалось загрузить — остаёмся на значениях по умолчанию
      .finally(() => setLoaded(true))
  }, [scope])

  const field = (key: keyof T & string) => ({
    value: data[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setData((prev) => ({ ...prev, [key]: e.target.value }))
      reset()
    },
  })

  const save = () =>
    run(() =>
      apiRequest("/api/admin/settings", {
        method: "POST",
        body: scope ? { [scope]: data } : data,
      }),
    )

  return { field, save, loaded, pending, error, done }
}
