import Link from "next/link"
import { LogOut } from "lucide-react"
import { Logo } from "@/components/layout/Logo"
import { AdminNav } from "./AdminNav"

/** Содержимое боковой панели: общее для десктопного сайдбара и мобильного drawer'а. */
export function AdminSidebarContent({ onClose }: { onClose?: React.ReactNode }) {
  return (
    <>
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div>
          <Logo size="sm" />
          <span className="text-xs text-muted-foreground mt-1 block">Admin Panel</span>
        </div>
        {onClose}
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
    </>
  )
}
