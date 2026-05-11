import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ChatWindow } from "@/components/chat/ChatWindow"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Admin — Чат" }

export default async function AdminChatPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const session = await auth()
  const sessionUser = session?.user as { id: string; role?: string } | undefined
  if (sessionUser?.role !== "ADMIN") redirect("/auth/login")

  const { userId } = await params

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  })
  if (!targetUser) notFound()

  let conversation = await prisma.conversation.findFirst({
    where: { userId },
    include: { messages: { orderBy: { createdAt: "asc" }, take: 100 } },
  })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { userId },
      include: { messages: true },
    })
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link
        href="/admin/messages"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Все беседы
      </Link>

      <div>
        <h1 className="text-2xl font-bold">{targetUser.name}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{targetUser.email}</p>
      </div>

      <ChatWindow
        conversationId={conversation.id}
        currentUserId={sessionUser!.id}
        role="ADMIN"
        initialMessages={conversation.messages.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        }))}
        apiPath="/api/conversations/messages"
      />
    </div>
  )
}
