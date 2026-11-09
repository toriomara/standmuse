import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleRoute } from "@/lib/api"
import { requireAdmin } from "@/lib/requireAdmin"
import { productSchema } from "@/lib/validations"

export async function GET(req: Request) {
  return handleRoute("products GET", async () => {
    const categorySlug = new URL(req.url).searchParams.get("category")

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(categorySlug && { category: { slug: categorySlug } }),
      },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    })
    return NextResponse.json(products)
  })
}

export async function POST(req: Request) {
  return handleRoute("products POST", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const data = productSchema.parse(await req.json())
    const product = await prisma.product.create({ data })
    return NextResponse.json(product, { status: 201 })
  })
}
