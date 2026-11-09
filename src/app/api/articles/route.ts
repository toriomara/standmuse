import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleRoute } from "@/lib/api"
import { requireAdmin } from "@/lib/requireAdmin"
import { articleSchema } from "@/lib/validations"
import { resolvePublishedAt } from "@/lib/publishing"
import { slugify } from "@/lib/utils"

async function uniqueSlug(base: string): Promise<string> {
  let slug = base
  let i = 2
  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`
  }
  return slug
}

export async function GET() {
  return handleRoute("articles GET", async () => {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    })
    return NextResponse.json(articles)
  })
}

export async function POST(req: Request) {
  return handleRoute("articles POST", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const data = articleSchema.parse(await req.json())
    const slug = await uniqueSlug(slugify(data.slug || data.title) || "article")
    const article = await prisma.article.create({
      data: { ...data, slug, publishedAt: resolvePublishedAt(data.isPublished) },
    })
    return NextResponse.json(article, { status: 201 })
  })
}
