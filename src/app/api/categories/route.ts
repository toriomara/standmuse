import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: "asc" },
    })
    return NextResponse.json(categories)
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
    const category = await prisma.category.create({ data: body })
    return NextResponse.json(category, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
