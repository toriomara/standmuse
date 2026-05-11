import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/requireAdmin"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json(orders)
  } catch (error) {
    console.error("[API orders GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const body = await req.json()
    const order = await prisma.order.create({
      data: {
        contact: body.contact ?? {},
        status: body.status ?? "PENDING",
        notes: body.notes ?? null,
        params: body.params ?? null,
        totalPrice: body.totalPrice ?? null,
        items: body.items ?? [],
      },
    })
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("[API orders POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
