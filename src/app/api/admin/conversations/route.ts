import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/requireAdmin"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const conversations = await prisma.conversation.findMany({
      orderBy: { lastMessageAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("[API admin/conversations GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
