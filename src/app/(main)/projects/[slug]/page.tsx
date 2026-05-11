import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ProjectGallery } from "@/components/sections/ProjectGallery"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await prisma.project
    .findUnique({ where: { slug, isPublished: true } })
    .catch(() => null)
  if (!project) return {}
  const description =
    project.excerpt ?? `Реализованный проект StandMuse — ${project.title}`
  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      type: "article",
      ...(project.images[0] && { images: [{ url: project.images[0], width: 1200, height: 800 }] }),
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await prisma.project.findUnique({ where: { slug, isPublished: true } })
  if (!project) notFound()

  const specs = [
    { label: "Акустика", value: project.acousticModel },
    { label: "Высота", value: project.height },
    { label: "Материалы", value: project.materials.join(", ") || null },
    { label: "Отделка", value: project.finish },
    { label: "Город", value: project.city },
    { label: "Стоимость", value: project.price ? `${project.price.toLocaleString("ru-RU")} ₽` : null },
  ].filter((s) => s.value)

  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Все проекты
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <ProjectGallery images={project.images} title={project.title} />

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">{project.title}</h1>
            {project.excerpt && (
              <p className="text-muted-foreground text-base">{project.excerpt}</p>
            )}
          </div>

          {specs.length > 0 && (
            <table className="w-full text-sm">
              <tbody>
                {specs.map((s) => (
                  <tr key={s.label}>
                    <td className="py-2 pr-4 text-muted-foreground font-medium w-36 align-top">{s.label}</td>
                    <td className="py-2">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <Button asChild size="lg" className="mt-2">
            <Link href="/order">Заказать похожие</Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      {project.content && (
        <div
          className="mt-12 rich-editor-content border-t border-border pt-8 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: project.content }}
        />
      )}
    </main>
  )
}
