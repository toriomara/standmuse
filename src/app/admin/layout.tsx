import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { isAdmin } from "@/lib/session"
import { AdminMobileHeader } from "./AdminMobileHeader"
import { AdminSidebarContent } from "./AdminSidebarContent"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdmin(await auth())) redirect("/auth/login")

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-60 shrink-0 border-r border-border bg-card flex-col">
        <AdminSidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminMobileHeader />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
