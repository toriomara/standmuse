import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleRoute, notFound, type IdContext } from "@/lib/api"
import { requireAdmin } from "@/lib/requireAdmin"
import { orderSchema } from "@/lib/validations"

// Через API правятся только эти поля; контакты и состав заказа — неизменяемы
const orderUpdateSchema = orderSchema.pick({ status: true, notes: true, params: true, totalPrice: true }).partial()

export async function GET(_: Request, { params }: IdContext) {
  return handleRoute("orders/:id GET", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) return notFound()
    return NextResponse.json(order)
  })
}

export async function PATCH(req: Request, { params }: IdContext) {
  return handleRoute("orders/:id PATCH", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    // null в params означает «очистить», undefined — «не трогать»
    const data = orderUpdateSchema.parse(await req.json())
    const order = await prisma.order.update({ where: { id }, data })
    return NextResponse.json(order)
  })
}

export async function DELETE(_: Request, { params }: IdContext) {
  return handleRoute("orders/:id DELETE", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    await prisma.order.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  })
}
