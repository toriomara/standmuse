import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { handleRoute, notFound, type IdContext } from "@/lib/api"
import { requireAdmin } from "@/lib/requireAdmin"
import { isAdmin } from "@/lib/session"
import { productSchema } from "@/lib/validations"

export async function GET(_: Request, { params }: IdContext) {
  return handleRoute("products/:id GET", async () => {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    })
    // Скрытые товары видны только администратору
    if (!product || (!product.isActive && !isAdmin(await auth()))) return notFound()
    return NextResponse.json(product)
  })
}

export async function PATCH(req: Request, { params }: IdContext) {
  return handleRoute("products/:id PATCH", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    const data = productSchema.partial().parse(await req.json())
    const product = await prisma.product.update({ where: { id }, data })
    return NextResponse.json(product)
  })
}

export async function DELETE(_: Request, { params }: IdContext) {
  return handleRoute("products/:id DELETE", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  })
}
