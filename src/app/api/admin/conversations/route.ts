import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/requireAdmin"
import { prisma } from "@/lib/prisma"
import { handleRoute } from "@/lib/api"

export const dynamic = "force-dynamic"

export async function GET() {
  return handleRoute("admin/conversations GET", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const conversations = await prisma.conversation.findMany({
      orderBy: { lastMessageAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    })

    return NextResponse.json(conversations)
  })
}
