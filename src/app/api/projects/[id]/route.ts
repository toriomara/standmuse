import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { handleRoute, notFound, type IdContext } from "@/lib/api"
import { requireAdmin } from "@/lib/requireAdmin"
import { isAdmin } from "@/lib/session"
import { projectSchema } from "@/lib/validations"

export async function GET(_: Request, { params }: IdContext) {
  return handleRoute("projects/:id GET", async () => {
    const { id } = await params
    const project = await prisma.project.findUnique({ where: { id } })
    // Черновики видны только администратору
    if (!project || (!project.isPublished && !isAdmin(await auth()))) return notFound()
    return NextResponse.json(project)
  })
}

export async function PATCH(req: Request, { params }: IdContext) {
  return handleRoute("projects/:id PATCH", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    const data = projectSchema.partial().parse(await req.json())
    const project = await prisma.project.update({ where: { id }, data })
    return NextResponse.json(project)
  })
}

export async function DELETE(_: Request, { params }: IdContext) {
  return handleRoute("projects/:id DELETE", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  })
}
