"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input, Textarea } from "@/components/ui/Input"
import { RichEditor } from "@/components/ui/RichEditor"
import { ImageUpload } from "@/components/ui/ImageUpload"

const schema = z.object({
  name: z.string().min(1, "Введите название"),
  slug: z.string().min(1, "Введите slug"),
  description: z.string().min(1, "Введите описание"),
  shortDesc: z.string().optional(),
  priceFrom: z.string().optional(),
  categoryId: z.string().min(1, "Выберите категорию"),
  features: z.string().optional(),
  materials: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Category { id: string; name: string }
interface Product {
  id: string; name: string; slug: string; description: string;
  shortDesc?: string | null; priceFrom?: number | null; categoryId: string;
  features?: string[]; materials?: string[];
  isActive: boolean; isFeatured: boolean; seoTitle?: string | null; seoDesc?: string | null;
  images?: string[]
}

interface Props {
  product?: Product | null
  categories: Category[]
}

export function AdminProductForm({ product, categories }: Props) {
  const router = useRouter()
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [description, setDescription] = useState(product?.description ?? "")
  const [saveError, setSaveError] = useState("")

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      shortDesc: product?.shortDesc ?? "",
      priceFrom: product?.priceFrom?.toString() ?? "",
      categoryId: product?.categoryId ?? "",
      features: product?.features?.join("\n") ?? "",
      materials: product?.materials?.join("\n") ?? "",
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      seoTitle: product?.seoTitle ?? "",
      seoDesc: product?.seoDesc ?? "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setSaveError("")
    const method = product ? "PATCH" : "POST"
    const url = product ? `/api/products/${product.id}` : "/api/products"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          description,
          images,
          priceFrom: data.priceFrom ? Number(data.priceFrom) : null,
          features: data.features ? data.features.split("\n").map(s => s.trim()).filter(Boolean) : [],
          materials: data.materials ? data.materials.split("\n").map(s => s.trim()).filter(Boolean) : [],
        }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setSaveError(json.error ?? "Ошибка сохранения")
        return
      }
      router.push("/admin/products")
      router.refresh()
    } catch {
      setSaveError("Нет соединения с сервером")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Название" placeholder="Стойки под Wharfedale" error={errors.name?.message} {...register("name")} />
        <Input label="Slug (URL)" placeholder="wharfedale-stand" error={errors.slug?.message} {...register("slug")} />
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">Категория</label>
        <select
          className="h-10 w-full rounded-lg border border-border bg-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          {...register("categoryId")}
        >
          <option value="">Выберите категорию</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className="text-xs text-destructive mt-1">{errors.categoryId.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Цена от (₽)" type="number" placeholder="15000" {...register("priceFrom")} />
        <Input label="Короткое описание" placeholder="Пара стоек под полочную акустику 40 см" {...register("shortDesc")} />
      </div>

      <RichEditor
        label="Полное описание"
        value={description}
        onChange={setDescription}
        placeholder="Опишите товар подробно..."
        error={errors.description?.message}
      />

      <ImageUpload
        label="Фотографии товара"
        value={images}
        onChange={setImages}
        maxFiles={10}
      />

      <Textarea
        label="Характеристики / особенности (каждая строка — отдельная)"
        placeholder={"Высота 615 мм\nКолонна 120×80×4 мм\nКабель-канал"}
        rows={5}
        {...register("features")}
      />
      <Textarea
        label="Материалы (каждая строка — отдельный)"
        placeholder={"Массив берёзы 30 мм\nСталь 120×80×4 мм"}
        rows={3}
        {...register("materials")}
      />

      <div className="border-t border-border pt-4">
        <p className="text-sm font-medium mb-3">SEO</p>
        <div className="flex flex-col gap-3">
          <Input label="SEO заголовок" placeholder="..." {...register("seoTitle")} />
          <Textarea label="SEO описание" rows={2} {...register("seoDesc")} />
        </div>
      </div>

      <div className="flex items-center gap-6 flex-wrap">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" className="h-4 w-4 rounded" {...register("isActive")} />
          Активен
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" className="h-4 w-4 rounded" {...register("isFeatured")} />
          Показывать на главной
        </label>
      </div>

      {saveError && (
        <p className="text-sm text-destructive">{saveError}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isSubmitting}>
          {product ? "Сохранить" : "Создать"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Отмена
        </Button>
      </div>
    </form>
  )
}
