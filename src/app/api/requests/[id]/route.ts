import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleRoute, notFound, type IdContext } from "@/lib/api"
import { requireAdmin } from "@/lib/requireAdmin"
import { requestStatusSchema } from "@/lib/validations"

export async function GET(_: Request, { params }: IdContext) {
  return handleRoute("requests/:id GET", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    const request = await prisma.request.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    })
    if (!request) return notFound()
    return NextResponse.json(request)
  })
}

export async function PATCH(req: Request, { params }: IdContext) {
  return handleRoute("requests/:id PATCH", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    const { status } = requestStatusSchema.parse(await req.json())
    const updated = await prisma.request.update({ where: { id }, data: { status } })
    return NextResponse.json(updated)
  })
}

export async function DELETE(_: Request, { params }: IdContext) {
  return handleRoute("requests/:id DELETE", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    await prisma.request.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  })
}
