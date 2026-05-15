"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/layout/Logo"
import { AdminNav } from "./AdminNav"

export function AdminMobileHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-card flex-shrink-0">
        <Logo size="sm" />
        <button
          onClick={() => setOpen(true)}
          aria-label="Открыть меню"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 flex flex-col">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <Logo size="sm" />
                <span className="text-xs text-muted-foreground mt-1 block">Admin Panel</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Закрыть меню"
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <AdminNav />
            <div className="p-3 border-t border-border">
              <Link
                href="/"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="h-4 w-4" /> На сайт
              </Link>
            </div>
          </aside>
        </>
      )}
    </>
  )
}
