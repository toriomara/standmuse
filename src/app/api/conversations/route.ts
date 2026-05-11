import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getSessionUserId } from "@/lib/session"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await auth()
    const userId = getSessionUserId(session)
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const conversation = await prisma.conversation.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: {
        messages: { orderBy: { createdAt: "asc" }, take: 100 },
      },
    })

    return NextResponse.json(conversation)
  } catch (error) {
    console.error("[API conversations GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
