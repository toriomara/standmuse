import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { handleRoute, notFound, type IdContext } from "@/lib/api"
import { requireAdmin } from "@/lib/requireAdmin"
import { isAdmin } from "@/lib/session"
import { articleSchema } from "@/lib/validations"
import { resolvePublishedAt } from "@/lib/publishing"

export async function GET(_: Request, { params }: IdContext) {
  return handleRoute("articles/:id GET", async () => {
    const { id } = await params
    const article = await prisma.article.findUnique({ where: { id } })
    // Черновики видны только администратору
    if (!article || (!article.isPublished && !isAdmin(await auth()))) return notFound()
    return NextResponse.json(article)
  })
}

export async function PATCH(req: Request, { params }: IdContext) {
  return handleRoute("articles/:id PATCH", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    const data = articleSchema.partial().parse(await req.json())
    const current = await prisma.article.findUnique({
      where: { id },
      select: { isPublished: true, publishedAt: true },
    })
    if (!current) return notFound()

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...data,
        slug: data.slug || undefined, // пустой slug при правке игнорируем
        publishedAt: resolvePublishedAt(data.isPublished, current),
      },
    })
    return NextResponse.json(article)
  })
}

export async function DELETE(_: Request, { params }: IdContext) {
  return handleRoute("articles/:id DELETE", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const { id } = await params
    await prisma.article.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  })
}
