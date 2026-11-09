"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input, Textarea } from "@/components/ui/Input"
import { RichEditor } from "@/components/ui/RichEditor"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { DeleteButton } from "@/components/admin/DeleteButton"
import { apiRequest, errorMessage } from "@/lib/api-client"
import { parseList, slugify } from "@/lib/utils"
import { useAsyncAction } from "@/hooks/useAsyncAction"

interface ArticleRecord {
  title: string
  slug: string
  excerpt: string | null
  content: string
  image: string | null
  imageCaption: string | null
  tags: string[]
  seoTitle: string | null
  seoDesc: string | null
  isPublished: boolean
}

const emptyFields = {
  title: "",
  slug: "",
  excerpt: "",
  tags: "",
  seoTitle: "",
  seoDesc: "",
  imageCaption: "",
  isPublished: false,
}

export default function AdminArticleEditPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const isNew = id === "new"

  const [data, setData] = useState(emptyFields)
  const [content, setContent] = useState("")
  const [image, setImage] = useState<string[]>([])
  const [slugEdited, setSlugEdited] = useState(false)
  const [loadError, setLoadError] = useState("")
  const { pending, error, run } = useAsyncAction()

  useEffect(() => {
    if (isNew) return
    apiRequest<ArticleRecord>(`/api/articles/${id}`)
      .then((a) => {
        setData({
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt ?? "",
          tags: a.tags.join(", "),
          seoTitle: a.seoTitle ?? "",
          seoDesc: a.seoDesc ?? "",
          imageCaption: a.imageCaption ?? "",
          isPublished: a.isPublished,
        })
        setContent(a.content ?? "")
        setImage(a.image ? [a.image] : [])
      })
      .catch((e) => setLoadError(errorMessage(e, "Не удалось загрузить статью")))
  }, [id, isNew])

  const setTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setData((prev) => ({
      ...prev,
      title,
      slug: isNew && !slugEdited ? slugify(title) : prev.slug,
    }))
  }

  const setSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugEdited(true)
    setData((prev) => ({ ...prev, slug: e.target.value }))
  }

  const set =
    (field: keyof typeof emptyFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((prev) => ({ ...prev, [field]: e.target.value }))

  const save = async () => {
    const ok = await run(() =>
      apiRequest(isNew ? "/api/articles" : `/api/articles/${id}`, {
        method: isNew ? "POST" : "PATCH",
        body: { ...data, content, image: image[0] ?? null, tags: parseList(data.tags) },
      }),
    )
    if (ok) router.push("/admin/articles")
  }

  if (loadError) return <p className="text-sm text-destructive">{loadError}</p>

  return (
    <div className="max-w-3xl flex flex-col gap-5">
      <h1 className="text-2xl font-bold">{isNew ? "Новая статья" : "Редактировать статью"}</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Заголовок" value={data.title} onChange={setTitle} />
        <Input label="Slug" value={data.slug} onChange={setSlug} />
      </div>

      <Textarea label="Анонс" rows={2} value={data.excerpt} onChange={set("excerpt")} />

      <RichEditor
        label="Контент"
        value={content}
        onChange={setContent}
        placeholder="Начните писать статью..."
      />

      <ImageUpload label="Обложка статьи" value={image} onChange={setImage} maxFiles={1} />

      <Input
        label="Подпись под фото"
        placeholder="Фото: Иван Иванов / StandMuse"
        value={data.imageCaption}
        onChange={set("imageCaption")}
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

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex gap-3">
          <Button loading={pending} onClick={save}>
            Сохранить
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
        </div>
        {!isNew && (
          <DeleteButton
            endpoint={`/api/articles/${id}`}
            redirectTo="/admin/articles"
            label="Удалить статью"
            title="Удалить статью?"
            description="Это действие нельзя отменить. Статья будет удалена навсегда."
          />
        )}
      </div>
    </div>
  )
}
