export const dynamic = "force-dynamic"
import { Metadata } from "next"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
export const metadata: Metadata = { title: "Admin — Медиа" }

export default async function AdminMediaPage() {
  const media = await prisma.media
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Медиа</h1>
        <p className="text-sm text-[var(--muted-foreground)]">{media.length} файлов</p>
      </div>

      {media.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-[var(--border)] text-[var(--muted-foreground)]">
          Медиафайлов пока нет. Загрузите через конфигуратор заказа.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {media.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--muted)] group">
              {item.type.startsWith("image/") ? (
                <Image src={item.url} alt={item.alt ?? item.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-[var(--muted-foreground)] p-2 text-center">
                  {item.name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
