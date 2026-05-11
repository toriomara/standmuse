import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    })
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = session?.user as { role?: string } | undefined
    if (user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { id } = await params
    const body = await req.json()
    const product = await prisma.product.update({ where: { id }, data: body })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = session?.user as { role?: string } | undefined
    if (user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { id } = await params
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
