import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { authorizeChannel } from "@/lib/pusher-server"
import { prisma } from "@/lib/prisma"
import { getSessionUserId, isAdmin } from "@/lib/session"

export async function POST(req: Request) {
  const session = await auth()
  const userId = getSessionUserId(session)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.text()
  const params = new URLSearchParams(body)
  const socketId = params.get("socket_id") ?? ""
  const channelName = params.get("channel_name") ?? ""

  if (!isAdmin(session)) {
    const conversationId = channelName.replace("private-chat-", "")
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userId: true },
    })
    if (!conversation || conversation.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  try {
    const authResponse = authorizeChannel(socketId, channelName)
    return NextResponse.json(authResponse)
  } catch {
    return NextResponse.json({ error: "Pusher not configured" }, { status: 503 })
  }
}
