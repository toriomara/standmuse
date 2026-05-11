"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input, Textarea } from "@/components/ui/Input"
import { RichEditor } from "@/components/ui/RichEditor"
import { ImageUpload } from "@/components/ui/ImageUpload"

export default function AdminArticleEditPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const isNew = id === "new"

  const [data, setData] = useState({
    title: "", slug: "", excerpt: "",
    tags: "", seoTitle: "", seoDesc: "", isPublished: false,
  })
  const [content, setContent] = useState("")
  const [image, setImage] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/articles/${id}`)
        .then((r) => r.json())
        .then((d) => {
          setData({
            title: d.title, slug: d.slug, excerpt: d.excerpt ?? "",
            tags: d.tags?.join(", ") ?? "",
            seoTitle: d.seoTitle ?? "", seoDesc: d.seoDesc ?? "",
            isPublished: d.isPublished,
          })
          setContent(d.content ?? "")
          setImage(d.image ? [d.image] : [])
        })
    }
  }, [id, isNew])

  const save = async () => {
    setSaving(true)
    const body = {
      ...data,
      content,
      image: image[0] ?? null,
      tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
    }
    await fetch(isNew ? "/api/articles" : `/api/articles/${id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    setSaving(false)
    router.push("/admin/articles")
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="max-w-3xl flex flex-col gap-5">
      <h1 className="text-2xl font-bold">{isNew ? "Новая статья" : "Редактировать статью"}</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Заголовок" value={data.title} onChange={set("title")} />
        <Input label="Slug" value={data.slug} onChange={set("slug")} />
      </div>

      <Textarea label="Анонс" rows={2} value={data.excerpt} onChange={set("excerpt")} />

      <RichEditor
        label="Контент"
        value={content}
        onChange={setContent}
        placeholder="Начните писать статью..."
      />

      <ImageUpload
        label="Обложка статьи"
        value={image}
        onChange={setImage}
        maxFiles={1}
      />

      <Input label="Теги (через запятую)" value={data.tags} onChange={set("tags")} />

      <div className="border-t border-border pt-4">
        <p className="text-sm font-medium mb-3">SEO</p>
        <div className="flex flex-col gap-3">
          <Input label="SEO заголовок" value={data.seoTitle} onChange={set("seoTitle")} />
          <Textarea label="SEO описание" rows={2} value={data.seoDesc} onChange={set("seoDesc")} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={data.isPublished}
          onChange={(e) => setData((prev) => ({ ...prev, isPublished: e.target.checked }))}
        />
        Опубликовать
      </label>

      <div className="flex gap-3">
        <Button loading={saving} onClick={save}>Сохранить</Button>
        <Button variant="outline" onClick={() => router.back()}>Отмена</Button>
      </div>
    </div>
  )
}
