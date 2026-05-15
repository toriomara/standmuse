export const dynamic = "force-dynamic"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/Badge"
import { Breadcrumbs } from "@/components/shared/Breadcrumbs"
import { ArrowLeft } from "lucide-react"
interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await prisma.article.findUnique({ where: { slug } }).catch(() => null)
  if (!article) return {}
  const title = article.seoTitle ?? article.title
  const description = article.seoDesc ?? article.excerpt ?? undefined
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      ...(article.image && { images: [{ url: article.image }] }),
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params

  const article = await prisma.article
    .findUnique({ where: { slug, isPublished: true } })
    .catch(() => null)

  if (!article) notFound()

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <Breadcrumbs
        className="mb-8"
        items={[
          { label: "Статьи", href: "/articles" },
          { label: article.title },
        ]}
      />

      <article>
        {article.image && (
          <figure className="mb-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-[var(--muted)]">
              <Image src={article.image} alt={article.title} fill className="object-cover" priority />
            </div>
            {article.imageCaption && (
              <figcaption className="mt-2 text-xs text-muted-foreground">
                {article.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">{article.title}</h1>

        {article.publishedAt && (
          <p className="text-sm text-[var(--muted-foreground)] mb-8">
            {article.publishedAt.toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        <div className="prose prose-neutral dark:prose-invert max-w-none text-[var(--foreground)] leading-relaxed">
          <div
            className="whitespace-pre-line text-[var(--foreground)] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:my-4 [&_li]:ml-4 [&_li]:list-disc"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>

      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Все статьи
        </Link>
      </div>
    </div>
  )
}
