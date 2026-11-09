import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { handleRoute, jsonError, notFound } from "@/lib/api"
import { getSessionUserId, isAdmin } from "@/lib/session"
import { createConversationMessage } from "@/lib/messages"
import { userMessageSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  return handleRoute("conversations/messages POST", async () => {
    const session = await auth()
    const senderId = getSessionUserId(session)
    if (!senderId) return jsonError("Unauthorized", 401)

    const { conversationId, text, imageUrl } = userMessageSchema.parse(await req.json())

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userId: true },
    })
    if (!conversation) return notFound()

    const admin = isAdmin(session)
    if (!admin && conversation.userId !== senderId) return jsonError("Forbidden", 403)

    const message = await createConversationMessage({
      conversationId,
      senderId,
      senderRole: admin ? "ADMIN" : "USER",
      text,
      imageUrl,
    })

    return NextResponse.json(message, { status: 201 })
  })
}
