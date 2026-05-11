import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MessageSquare, ChevronRight } from "lucide-react"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Admin — Сообщения" }

export default async function AdminMessagesPage() {
  const session = await auth()
  const user = session?.user as { role?: string } | undefined
  if (user?.role !== "ADMIN") redirect("/auth/login")

  const conversations = await prisma.conversation.findMany({
    orderBy: { lastMessageAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Сообщения</h1>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <MessageSquare className="h-10 w-10 opacity-30" />
          <p className="text-sm">Нет активных бесед</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border overflow-hidden">
          {conversations.map((conv) => {
            const lastMsg = conv.messages[0]
            return (
              <Link
                key={conv.id}
                href={`/admin/messages/${conv.user.id}`}
                className="flex items-center gap-4 px-5 py-4 bg-card hover:bg-muted transition-colors"
              >
                <div className="h-9 w-9 rounded-full bg-accent/15 text-accent flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {conv.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{conv.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {conv.user.email}
                  </p>
                  {lastMsg && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {lastMsg.senderRole === "ADMIN" ? "Вы: " : ""}
                      {lastMsg.imageUrl && !lastMsg.text ? "📎 Изображение" : lastMsg.text}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {lastMsg && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(lastMsg.createdAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
