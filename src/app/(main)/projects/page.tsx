import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Ruler, Layers, ArrowRight } from "lucide-react"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Примеры работ — StandMuse",
  description: "Реализованные проекты: акустические стойки, подиумы и HI-FI подставки на заказ. Фото готовых изделий и спецификации.",
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  })

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Примеры работ</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Реализованные проекты — акустические стойки, подиумы и HI-FI подставки, изготовленные под конкретную акустику и пожелания клиента
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          Проекты скоро появятся
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group border border-border rounded-xl overflow-hidden bg-card hover:border-accent transition-colors"
            >
              {/* Photo */}
              <div className="aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
                {project.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2">
                <h2 className="font-semibold text-base leading-snug group-hover:text-accent transition-colors">
                  {project.title}
                </h2>

                {project.acousticModel && (
                  <p className="text-sm text-muted-foreground">{project.acousticModel}</p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                  {project.height && (
                    <span className="flex items-center gap-1">
                      <Ruler className="h-3 w-3" /> {project.height}
                    </span>
                  )}
                  {project.materials[0] && (
                    <span className="flex items-center gap-1">
                      <Layers className="h-3 w-3" /> {project.materials[0]}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2">
                  {project.price ? (
                    <span className="text-sm font-semibold text-accent">
                      {project.price.toLocaleString("ru-RU")} ₽
                    </span>
                  ) : <span />}
                  <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-accent transition-colors">
                    Подробнее <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-20 pt-12 border-t border-border text-center pb-8">
        <blockquote className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance max-w-2xl mx-auto">
          Сделано один раз —
          <br />
          <span className="text-accent">чтобы служить долго</span>
        </blockquote>
      </div>
    </main>
  )
}
