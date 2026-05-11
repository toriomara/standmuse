import { Metadata } from "next"
import { auth, signOut } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/Button"
import { LogOut } from "lucide-react"
import { ProfileForm } from "./ProfileForm"

export const metadata: Metadata = { title: "Настройки профиля — StandMuse" }

export default async function ProfilePage() {
  const session = await auth()
  const userId = (session?.user as { id?: string })?.id

  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } }).catch(() => null)
    : null

  return (
    <div className="flex flex-col gap-8 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold">Настройки профиля</h1>
        <p className="text-sm text-muted-foreground mt-1">Имя и телефон можно изменить</p>
      </div>

      <ProfileForm
        name={user?.name ?? session?.user?.name ?? ""}
        email={user?.email ?? session?.user?.email ?? ""}
        phone={user?.phone ?? ""}
      />

      <div className="pt-2 border-t border-border">
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}
        >
          <Button
            type="submit"
            variant="outline"
            className="text-destructive border-destructive/30 hover:bg-destructive/5"
          >
            <LogOut className="h-4 w-4" />
            Выйти из аккаунта
          </Button>
        </form>
      </div>
    </div>
  )
}
