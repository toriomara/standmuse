export const dynamic = "force-dynamic"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/Badge"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"
import { SectionTitle } from "@/components/shared/SectionTitle"
export const metadata: Metadata = {
  title: "Статьи — Всё об акустических стойках и HI-FI звуке",
  description:
    "Статьи о виброразвязке, выборе стоек, материалах и настройке звука в комнате прослушивания.",
}

export default async function ArticlesPage() {
  const articles = await prisma.article
    .findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
    })
    .catch(() => [])

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <SectionTitle
        tag="Статьи"
        title="О звуке"
        subtitle="Как правильно обустроить место прослушивания, выбрать материалы и добиться идеального звука"
        className="mb-12"
      />

      {articles.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          Статьи скоро появятся
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-accent/50 hover:shadow-lg transition-all"
            >
              <div className="relative aspect-video bg-muted overflow-hidden">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              <div className="flex flex-col gap-2 p-5 flex-1">
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <h2 className="font-semibold text-base leading-snug group-hover:text-accent transition-colors">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                    {article.excerpt}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {article.publishedAt?.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
