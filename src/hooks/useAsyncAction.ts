"use client"

import { useCallback, useState } from "react"
import { errorMessage } from "@/lib/api-client"

/**
 * Состояние «идёт запрос / ошибка / успешно сохранено» для кнопок и форм.
 * `run` возвращает `true`, если действие завершилось без ошибки.
 */
export function useAsyncAction() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  const run = useCallback(async (action: () => Promise<unknown>): Promise<boolean> => {
    setPending(true)
    setError("")
    setDone(false)
    try {
      await action()
      setDone(true)
      return true
    } catch (e) {
      setError(errorMessage(e))
      return false
    } finally {
      setPending(false)
    }
  }, [])

  /** Сбросить «Сохранено»/ошибку — например, когда пользователь снова правит поле. */
  const reset = useCallback(() => {
    setDone(false)
    setError("")
  }, [])

  return { pending, error, done, run, reset }
}
