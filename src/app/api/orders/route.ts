import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { handleRoute } from "@/lib/api"
import { requireAdmin } from "@/lib/requireAdmin"
import { orderSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export async function GET() {
  return handleRoute("orders GET", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json(orders)
  })
}

export async function POST(req: Request) {
  return handleRoute("orders POST", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const data = orderSchema
      .partial({ status: true, items: true })
      .parse(await req.json())

    const order = await prisma.order.create({
      data: {
        contact: data.contact,
        status: data.status ?? "PENDING",
        notes: data.notes ?? null,
        params: data.params ?? null,
        totalPrice: data.totalPrice ?? null,
        items: (data.items ?? []) as Prisma.InputJsonValue,
      },
    })
    return NextResponse.json(order, { status: 201 })
  })
}
