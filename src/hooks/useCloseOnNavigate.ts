"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

/**
 * Флаг «открыто», который сам сбрасывается при переходе на другую страницу.
 * Без useEffect: открытие запоминает путь, на котором оно произошло.
 */
export function useCloseOnNavigate() {
  const pathname = usePathname()
  const [openedOn, setOpenedOn] = useState<string | null>(null)

  const open = openedOn === pathname
  const setOpen = (value: boolean) => setOpenedOn(value ? pathname : null)

  return { open, setOpen, toggle: () => setOpen(!open) }
}
