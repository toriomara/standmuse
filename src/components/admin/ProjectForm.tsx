"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input, Textarea } from "@/components/ui/Input"
import { RichEditor } from "@/components/ui/RichEditor"
import { ImageUpload } from "@/components/ui/ImageUpload"

interface Project {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  images: string[]
  acousticModel?: string | null
  height?: string | null
  materials: string[]
  finish?: string | null
  price?: number | null
  city?: string | null
  tags: string[]
  isPublished: boolean
  sortOrder: number
  seoTitle?: string | null
  seoDesc?: string | null
}

interface Props {
  project?: Project | null
}

export function AdminProjectForm({ project }: Props) {
  const router = useRouter()

  const [fields, setFields] = useState({
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    excerpt: project?.excerpt ?? "",
    acousticModel: project?.acousticModel ?? "",
    height: project?.height ?? "",
    finish: project?.finish ?? "",
    price: project?.price?.toString() ?? "",
    city: project?.city ?? "",
    materials: project?.materials.join(", ") ?? "",
    tags: project?.tags.join(", ") ?? "",
    sortOrder: project?.sortOrder?.toString() ?? "0",
    seoTitle: project?.seoTitle ?? "",
    seoDesc: project?.seoDesc ?? "",
    isPublished: project?.isPublished ?? false,
  })
  const [content, setContent] = useState(project?.content ?? "")
  const [images, setImages] = useState<string[]>(project?.images ?? [])
  const [saving, setSaving] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((prev) => ({ ...prev, [field]: e.target.value }))

  const save = async () => {
    setSaving(true)
    const body = {
      ...fields,
      content,
      images,
      price: fields.price ? Number(fields.price) : null,
      sortOrder: Number(fields.sortOrder) || 0,
      materials: fields.materials.split(",").map((s) => s.trim()).filter(Boolean),
      tags: fields.tags.split(",").map((s) => s.trim()).filter(Boolean),
    }

    const method = project ? "PATCH" : "POST"
    const url = project ? `/api/projects/${project.id}` : "/api/projects"
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    setSaving(false)
    router.push("/admin/projects")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Заголовок" value={fields.title} onChange={set("title")} placeholder="Стойки для KEF LS50" />
        <Input label="Slug (URL)" value={fields.slug} onChange={set("slug")} placeholder="stoyki-kef-ls50" />
      </div>

      <Textarea label="Анонс" rows={2} value={fields.excerpt} onChange={set("excerpt")} placeholder="Краткое описание проекта..." />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Акустика" value={fields.acousticModel} onChange={set("acousticModel")} placeholder="KEF LS50 Meta" />
        <Input label="Высота стойки" value={fields.height} onChange={set("height")} placeholder="750 мм" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Отделка" value={fields.finish} onChange={set("finish")} placeholder="Чёрный матовый (муар)" />
        <Input label="Город" value={fields.city} onChange={set("city")} placeholder="Москва" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Цена (₽)" type="number" value={fields.price} onChange={set("price")} placeholder="17500" />
        <Input label="Порядок сортировки" type="number" value={fields.sortOrder} onChange={set("sortOrder")} />
      </div>

      <Input label="Материалы (через запятую)" value={fields.materials} onChange={set("materials")} placeholder="Грецкий орех, Металл 100×100×3" />
      <Input label="Теги (через запятую)" value={fields.tags} onChange={set("tags")} placeholder="Wharfedale, орех, 750 мм" />

      <RichEditor label="Описание" value={content} onChange={setContent} placeholder="Подробное описание проекта..." />

      <ImageUpload label="Фотографии проекта" value={images} onChange={setImages} maxFiles={15} />

      <div className="border-t border-border pt-4">
        <p className="text-sm font-medium mb-3">SEO</p>
        <div className="flex flex-col gap-3">
          <Input label="SEO заголовок" value={fields.seoTitle} onChange={set("seoTitle")} />
          <Textarea label="SEO описание" rows={2} value={fields.seoDesc} onChange={set("seoDesc")} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={fields.isPublished}
          onChange={(e) => setFields((prev) => ({ ...prev, isPublished: e.target.checked }))}
        />
        Опубликовать
      </label>

      <div className="flex gap-3 pt-2">
        <Button loading={saving} onClick={save}>{project ? "Сохранить" : "Создать"}</Button>
        <Button variant="outline" onClick={() => router.back()}>Отмена</Button>
      </div>
    </div>
  )
}
