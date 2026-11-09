import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { handleRoute, jsonError } from "@/lib/api"
import { getSessionUserId } from "@/lib/session"

export const dynamic = "force-dynamic"

export async function GET() {
  return handleRoute("conversations GET", async () => {
    const userId = getSessionUserId(await auth())
    if (!userId) return jsonError("Unauthorized", 401)

    const conversation = await prisma.conversation.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: { messages: { orderBy: { createdAt: "asc" }, take: 100 } },
    })

    return NextResponse.json(conversation)
  })
}
