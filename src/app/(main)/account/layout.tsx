import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { AccountNav } from "./AccountNav"

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="flex flex-col gap-1">
          <div className="mb-4 px-3">
            <p className="font-semibold">{session.user.name}</p>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          </div>
          <AccountNav />
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }) }}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-2.5 px-3 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </Button>
          </form>
        </aside>

        {/* Content */}
        <main>{children}</main>
      </div>
    </div>
  )
}
