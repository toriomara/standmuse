"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { REQUEST_STATUS_MAP } from "@/constants/statusMaps"

interface Props {
  requestId: string
  currentStatus: string
}

export function StatusUpdater({ requestId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    try {
      await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      setSaved(true)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => { setStatus(e.target.value); setSaved(false) }}
        className="h-10 rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        {Object.entries(REQUEST_STATUS_MAP).map(([value, { label }]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <Button
        size="sm"
        onClick={handleSave}
        loading={loading}
        disabled={status === currentStatus}
      >
        Сохранить
      </Button>
      {saved && (
        <span className="text-sm text-green-600 dark:text-green-400">Сохранено</span>
      )}
    </div>
  )
}
