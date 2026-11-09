import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleRoute } from "@/lib/api"
import { requireAdmin } from "@/lib/requireAdmin"
import { projectSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export async function GET() {
  return handleRoute("projects GET", async () => {
    const projects = await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    })
    return NextResponse.json(projects)
  })
}

export async function POST(req: Request) {
  return handleRoute("projects POST", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const data = projectSchema.parse(await req.json())
    const project = await prisma.project.create({ data })
    return NextResponse.json(project, { status: 201 })
  })
}
