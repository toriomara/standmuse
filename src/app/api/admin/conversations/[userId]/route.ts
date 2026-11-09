import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/requireAdmin"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { handleRoute, jsonError, notFound } from "@/lib/api"
import { getSessionUserId } from "@/lib/session"
import { createConversationMessage } from "@/lib/messages"
import { messageSchema, objectId } from "@/lib/validations"

export const dynamic = "force-dynamic"

type UserContext = { params: Promise<{ userId: string }> }

export async function GET(_: Request, { params }: UserContext) {
  return handleRoute("admin/conversations/:userId GET", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const userId = objectId.parse((await params).userId)
    const conversation = await prisma.conversation.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        messages: { orderBy: { createdAt: "asc" }, take: 100 },
      },
    })

    if (!conversation) return notFound()
    return NextResponse.json(conversation)
  })
}

export async function POST(req: Request, { params }: UserContext) {
  return handleRoute("admin/conversations/:userId POST", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const senderId = getSessionUserId(await auth())
    if (!senderId) return jsonError("Unauthorized", 401)

    const userId = objectId.parse((await params).userId)
    const { text, imageUrl } = messageSchema.parse(await req.json())

    const conversation = await prisma.conversation.upsert({
      where: { userId },
      create: { userId },
      update: {},
    })

    const message = await createConversationMessage({
      conversationId: conversation.id,
      senderId,
      senderRole: "ADMIN",
      text,
      imageUrl,
    })

    return NextResponse.json(message, { status: 201 })
  })
}
