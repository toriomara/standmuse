import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/requireAdmin"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error("[API projects GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const body = await req.json()
    const project = await prisma.project.create({ data: body })
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("[API projects POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
