import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const contains = (field: string) => ({ contains: q, mode: "insensitive" as const })

  const [products, articles, projects] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: contains("name") },
          { shortDesc: contains("shortDesc") },
          { description: contains("description") },
        ],
      },
      include: { category: { select: { name: true, slug: true } } },
      take: 4,
      orderBy: { isFeatured: "desc" },
    }).catch(() => []),

    prisma.article.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: contains("title") },
          { excerpt: contains("excerpt") },
        ],
      },
      take: 2,
      orderBy: { publishedAt: "desc" },
    }).catch(() => []),

    prisma.project.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: contains("title") },
          { excerpt: contains("excerpt") },
          { acousticModel: contains("acousticModel") },
        ],
      },
      take: 2,
      orderBy: { sortOrder: "asc" },
    }).catch(() => []),
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
}
