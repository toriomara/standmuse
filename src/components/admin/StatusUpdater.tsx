"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { SaveStatus } from "@/components/admin/SaveStatus"
import { apiRequest } from "@/lib/api-client"
import { useAsyncAction } from "@/hooks/useAsyncAction"

interface StatusUpdaterProps {
  /** PATCH-эндпоинт, принимающий `{ status }`. */
  endpoint: string
  currentStatus: string
  options: Record<string, { label: string }>
}

export function StatusUpdater({ endpoint, currentStatus, options }: StatusUpdaterProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const { pending, error, done, run, reset } = useAsyncAction()

  const handleSave = async () => {
    const ok = await run(() => apiRequest(endpoint, { method: "PATCH", body: { status } }))
    if (ok) router.refresh()
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value)
          reset()
        }}
        className="h-10 rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        {Object.entries(options).map(([value, { label }]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <Button size="sm" onClick={handleSave} loading={pending} disabled={status === currentStatus}>
        Сохранить
      </Button>
      <SaveStatus done={done} error={error} />
    </div>
  )
}
