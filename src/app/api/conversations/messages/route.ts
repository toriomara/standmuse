import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getSessionUserId, isAdmin } from "@/lib/session"
import { createConversationMessage } from "@/lib/messages"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const senderId = getSessionUserId(session)
    if (!senderId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { conversationId, text, imageUrl } = await req.json()
    if (!conversationId || (!text?.trim() && !imageUrl)) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 })
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userId: true },
    })
    if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const admin = isAdmin(session)
    if (!admin && conversation.userId !== senderId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const message = await createConversationMessage({
      conversationId,
      senderId,
      senderRole: admin ? "ADMIN" : "USER",
      text,
      imageUrl,
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error("[API conversations/messages POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
