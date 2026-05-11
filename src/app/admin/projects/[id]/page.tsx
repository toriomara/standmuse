import { prisma } from "@/lib/prisma"
import { AdminProjectForm } from "@/components/admin/ProjectForm"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AdminProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "new"

  const project = isNew ? null : await prisma.project.findUnique({ where: { id } })
  if (!isNew && !project) notFound()

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">{isNew ? "Новый проект" : "Редактировать проект"}</h1>
      <AdminProjectForm project={project} />
    </div>
  )
}
