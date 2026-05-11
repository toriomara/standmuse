import type { MetadataRoute } from "next"

export const dynamic = "force-dynamic"

const BASE_URL = "https://standmuse.ru"

const staticRoutes = [
  { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { url: "/catalog", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/catalog/acoustic-stands", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/catalog/hifi-stands", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/catalog/acoustic-panels", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/catalog/diffusers", priority: 0.7, changeFrequency: "weekly" as const },
  { url: "/catalog/accessories", priority: 0.7, changeFrequency: "weekly" as const },
  { url: "/order", priority: 0.9, changeFrequency: "monthly" as const },
  { url: "/delivery", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/contacts", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/articles", priority: 0.7, changeFrequency: "weekly" as const },
]

async function getDynamicRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const { prisma } = await import("@/lib/prisma")
    const [products, articles] = await Promise.all([
      prisma.product
        .findMany({ where: { isActive: true }, include: { category: true } })
        .catch(() => []),
      prisma.article
        .findMany({ where: { isPublished: true } })
        .catch(() => []),
    ])

    return [
      ...products.map((p) => ({
        url: `${BASE_URL}/catalog/${p.category.slug}/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...articles.map((a) => ({
        url: `${BASE_URL}/articles/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ]
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicRoutes = await getDynamicRoutes()
  return [
    ...staticRoutes.map((r) => ({
      url: `${BASE_URL}${r.url}`,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...dynamicRoutes,
  ]
}
