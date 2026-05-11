import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/requireAdmin"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(order)
  } catch (error) {
    console.error("[API orders/:id GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    const body = await req.json()
    const order = await prisma.order.update({ where: { id }, data: body })
    return NextResponse.json(order)
  } catch (error) {
    console.error("[API orders/:id PATCH]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    await prisma.order.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[API orders/:id DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
