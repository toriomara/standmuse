import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/requireAdmin"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(project)
  } catch (error) {
    console.error("[API projects/:id GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    const body = await req.json()
    const project = await prisma.project.update({ where: { id }, data: body })
    return NextResponse.json(project)
  } catch (error) {
    console.error("[API projects/:id PATCH]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[API projects/:id DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
