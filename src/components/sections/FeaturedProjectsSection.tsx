import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { SectionTitle } from "@/components/shared/SectionTitle"
import { FeaturedProjectsCards } from "./FeaturedProjectsCards"

export async function FeaturedProjectsSection() {
  const projects = await prisma.project
    .findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        images: true,
        acousticModel: true,
        height: true,
        materials: true,
        price: true,
      },
    })
    .catch(() => [])

  if (projects.length === 0) return null

  return (
    <section className="container mx-auto max-w-6xl px-4 py-16 lg:py-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <SectionTitle
          tag="Примеры работ"
          title="Реализованные проекты"
          subtitle="Каждая стойка — под конкретную акустику и пожелания клиента"
        />
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-sm font-medium text-accent hover:underline underline-offset-4 shrink-0"
        >
          Все работы <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <FeaturedProjectsCards projects={projects} />
    </section>
  )
}
