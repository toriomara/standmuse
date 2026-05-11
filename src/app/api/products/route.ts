import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categorySlug = searchParams.get("category")

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(categorySlug && { category: { slug: categorySlug } }),
      },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    })

    return NextResponse.json(products)
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
    const product = await prisma.product.create({ data: body })
    return NextResponse.json(product, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
