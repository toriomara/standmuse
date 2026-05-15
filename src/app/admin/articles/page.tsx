export const dynamic = "force-dynamic"
import { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Plus, Pencil } from "lucide-react"
import { ArticleDeleteButton } from "./DeleteButton"
export const metadata: Metadata = { title: "Admin — Статьи" }

export default async function AdminArticlesPage() {
  const articles = await prisma.article
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Статьи</h1>
          <p className="text-sm text-[var(--muted-foreground)]">{articles.length} статей</p>
        </div>
        <Link href="/admin/articles/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Написать
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Заголовок</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Теги</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Дата</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Статус</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[var(--muted-foreground)]">
                  Статей пока нет
                </td>
              </tr>
            ) : (
              articles.map((a) => (
                <tr key={a.id} className="bg-[var(--card)] hover:bg-[var(--muted)] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{a.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {a.tags.slice(0, 2).map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {a.publishedAt?.toLocaleDateString("ru-RU") ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={a.isPublished ? "success" : "default"}>
                      {a.isPublished ? "Опубликована" : "Черновик"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <ArticleDeleteButton articleId={a.id} afterDelete="stay" />
                      <Link href={`/admin/articles/${a.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
