import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { authorizeChannel } from "@/lib/pusher-server"
import { prisma } from "@/lib/prisma"
import { handleRoute, jsonError } from "@/lib/api"
import { getSessionUserId, isAdmin } from "@/lib/session"

const CHAT_CHANNEL = /^private-chat-([a-f\d]{24})$/i

export async function POST(req: Request) {
  return handleRoute("pusher/auth POST", async () => {
    const session = await auth()
    const userId = getSessionUserId(session)
    if (!userId) return jsonError("Unauthorized", 401)

    const params = new URLSearchParams(await req.text())
    const socketId = params.get("socket_id") ?? ""
    const channelName = params.get("channel_name") ?? ""

    // Авторизуем только каналы чата — любые другие имена отклоняем
    const conversationId = CHAT_CHANNEL.exec(channelName)?.[1]
    if (!conversationId) return jsonError("Forbidden", 403)

    if (!isAdmin(session)) {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { userId: true },
      })
      if (conversation?.userId !== userId) return jsonError("Forbidden", 403)
    }

    try {
      return NextResponse.json(authorizeChannel(socketId, channelName))
    } catch {
      return jsonError("Pusher not configured", 503)
    }
  })
}
