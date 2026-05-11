import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/requireAdmin"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { getSessionUserId } from "@/lib/session"
import { createConversationMessage } from "@/lib/messages"

export const dynamic = "force-dynamic"

export async function GET(_: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { userId } = await params
    const conversation = await prisma.conversation.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        messages: { orderBy: { createdAt: "asc" }, take: 100 },
      },
    })

    if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(conversation)
  } catch (error) {
    console.error("[API admin/conversations/:userId GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const session = await auth()
    const senderId = getSessionUserId(session)
    if (!senderId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { userId } = await params
    const { text, imageUrl } = await req.json()

    if (!text?.trim() && !imageUrl) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 })
    }

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
  } catch (error) {
    console.error("[API admin/conversations/:userId POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
