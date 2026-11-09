import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleRoute } from "@/lib/api"

const MIN_QUERY_LENGTH = 2
const MAX_QUERY_LENGTH = 100

export async function GET(req: NextRequest) {
  return handleRoute("search GET", async () => {
    const q = req.nextUrl.searchParams.get("q")?.trim().slice(0, MAX_QUERY_LENGTH)
    if (!q || q.length < MIN_QUERY_LENGTH) return NextResponse.json({ results: [] })

    const contains = { contains: q, mode: "insensitive" as const }

    const [products, articles, projects] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [{ name: contains }, { shortDesc: contains }, { description: contains }],
        },
        include: { category: { select: { name: true, slug: true } } },
        take: 4,
        orderBy: { isFeatured: "desc" },
      }),
      prisma.article.findMany({
        where: { isPublished: true, OR: [{ title: contains }, { excerpt: contains }] },
        take: 2,
        orderBy: { publishedAt: "desc" },
      }),
      prisma.project.findMany({
        where: {
          isPublished: true,
          OR: [{ title: contains }, { excerpt: contains }, { acousticModel: contains }],
        },
        take: 2,
        orderBy: { sortOrder: "asc" },
      }),
    ])

    const results = [
      ...products.map((p) => ({
        id: p.id,
        type: "product" as const,
        name: p.name,
        href: `/catalog/${p.category.slug}/${p.slug}`,
        subtitle: p.category.name,
        image: p.images[0] ?? null,
        priceFrom: p.priceFrom ?? null,
      })),
      ...articles.map((a) => ({
        id: a.id,
        type: "article" as const,
        name: a.title,
        href: `/articles/${a.slug}`,
        subtitle: "Статья",
        image: a.image ?? null,
        priceFrom: null,
      })),
      ...projects.map((p) => ({
        id: p.id,
        type: "project" as const,
        name: p.title,
        href: `/projects/${p.slug}`,
        subtitle: "Работа",
        image: p.images[0] ?? null,
        priceFrom: null,
      })),
    ]

    return NextResponse.json({ results })
  })
}
