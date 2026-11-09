"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/Button"

const subscribe = () => () => {}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // false на сервере и при гидрации, true после — без setState в эффекте
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)

  if (!mounted) return <div className="h-10 w-10" />

  const isDark = theme === "dark"
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
      aria-pressed={isDark}
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </Button>
  )
}
