import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const article = await prisma.article.findUnique({ where: { id } })
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(article)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = session?.user as { role?: string } | undefined
    if (user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { id } = await params
    const body = await req.json()
    const article = await prisma.article.update({
      where: { id },
      data: { ...body, publishedAt: body.isPublished ? new Date() : null },
    })
    return NextResponse.json(article)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
