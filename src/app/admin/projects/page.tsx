import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Plus } from "lucide-react"
import { ProjectRowActions } from "@/components/admin/ProjectRowActions"

export const dynamic = "force-dynamic"

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Проекты</h1>
        <Button asChild size="sm">
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4 mr-1.5" /> Новый проект
          </Link>
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Название</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Акустика</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Цена</th>
              <th className="text-left px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((p) => (
              <tr key={p.id} className="bg-card hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{p.acousticModel ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {p.price ? `${p.price.toLocaleString("ru-RU")} ₽` : "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={p.isPublished ? "default" : "outline"}>
                    {p.isPublished ? "Опубликован" : "Черновик"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <ProjectRowActions id={p.id} title={p.title} />
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Проектов пока нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
