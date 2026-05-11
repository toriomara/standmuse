import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/layout/Logo"
import { LogOut } from "lucide-react"
import { AdminNav } from "./AdminNav"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user as { role?: string } | undefined
  if (!session?.user || user?.role !== "ADMIN") redirect("/auth/login")

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-5 border-b border-border">
          <Logo size="sm" />
          <span className="text-xs text-muted-foreground mt-1 block">Admin Panel</span>
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

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
