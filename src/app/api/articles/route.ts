import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    })
    return NextResponse.json(articles)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const user = session?.user as { role?: string } | undefined
    if (user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()
    const article = await prisma.article.create({
      data: {
        ...body,
        publishedAt: body.isPublished ? new Date() : null,
      },
    })
    return NextResponse.json(article, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
