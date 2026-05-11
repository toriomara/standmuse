export const dynamic = "force-dynamic"
import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { AdminProductForm } from "@/components/admin/ProductForm"
interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: "Admin — Редактировать товар" }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params

  const [product, categories] = await Promise.all([
    id === "new"
      ? null
      : prisma.product.findUnique({ where: { id } }).catch(() => null),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
  ])

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        {id === "new" ? "Новый товар" : "Редактировать товар"}
      </h1>
      <AdminProductForm product={product} categories={categories} />
    </div>
  )
}
