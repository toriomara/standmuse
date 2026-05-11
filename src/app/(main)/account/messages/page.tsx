import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ChatWindow } from "@/components/chat/ChatWindow"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Сообщения — StandMuse" }

export default async function AccountMessagesPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")

  const sessionUser = session.user as { id: string }

  let conversation = await prisma.conversation.findFirst({
    where: { userId: sessionUser.id },
    include: { messages: { orderBy: { createdAt: "asc" }, take: 100 } },
  })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { userId: sessionUser.id },
      include: { messages: true },
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Сообщения</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Напишите нам — ответим в течение рабочего дня
        </p>
      </div>

      <ChatWindow
        conversationId={conversation.id}
        currentUserId={sessionUser.id}
        role="USER"
        initialMessages={conversation.messages.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        }))}
        apiPath="/api/conversations/messages"
      />
    </div>
  )
}
