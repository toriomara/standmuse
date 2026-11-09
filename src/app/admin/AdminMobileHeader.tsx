"use client"

import { Menu, X } from "lucide-react"
import { Logo } from "@/components/layout/Logo"
import { useCloseOnNavigate } from "@/hooks/useCloseOnNavigate"
import { AdminSidebarContent } from "./AdminSidebarContent"

export function AdminMobileHeader() {
  const { open, setOpen } = useCloseOnNavigate()

  return (
    <>
      <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-card shrink-0">
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
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 flex flex-col">
            <AdminSidebarContent
              onClose={
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Закрыть меню"
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              }
            />
          </aside>
        </>
      )}
    </>
  )
}
