import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleRoute } from "@/lib/api"
import { requireAdmin } from "@/lib/requireAdmin"
import { categorySchema } from "@/lib/validations"

export async function GET() {
  return handleRoute("categories GET", async () => {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: "asc" },
    })
    return NextResponse.json(categories)
  })
}

export async function POST(req: Request) {
  return handleRoute("categories POST", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const data = categorySchema.parse(await req.json())
    const category = await prisma.category.create({ data })
    return NextResponse.json(category, { status: 201 })
  })
}
