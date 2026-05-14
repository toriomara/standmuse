"use client"

import { useRef, useState } from "react"
import { Upload, Link, X, Loader2, ImageIcon } from "lucide-react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useUploadThing } from "@/lib/uploadthing-client"
import { Button } from "./Button"
import { cn } from "@/lib/utils"

interface Props {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
  label?: string
}

function SortableImage({
  url,
  index,
  onRemove,
}: {
  url: string
  index: number
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: url })

  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group h-20 w-20 rounded-lg overflow-hidden border border-border bg-muted touch-none select-none",
        isDragging && "opacity-50 shadow-xl ring-2 ring-accent z-50",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="h-full w-full object-cover" />

      {/* Drag handle — вся карточка */}
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      {/* Бейдж главного фото */}
      {index === 0 && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-accent text-accent-foreground rounded px-1.5 py-0.5 leading-tight pointer-events-none whitespace-nowrap">
          Главное
        </span>
      )}

      {/* Кнопка удаления */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

export function ImageUpload({ value, onChange, maxFiles = 10, label }: Props) {
  const [tab, setTab] = useState<"url" | "upload">("url")
  const [urlInput, setUrlInput] = useState("")
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadError: () => setUploadError("Ошибка загрузки. Проверьте UPLOADTHING_TOKEN в .env"),
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = value.indexOf(active.id as string)
      const newIndex = value.indexOf(over.id as string)
      onChange(arrayMove(value, oldIndex, newIndex))
    }
  }

  const addUrl = () => {
    const url = urlInput.trim()
    if (!url || value.length >= maxFiles) return
    onChange([...value, url])
    setUrlInput("")
  }

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i))

  const handleFiles = async (files: File[]) => {
    if (!files.length) return
    setUploadError("")
    const result = await startUpload(files.slice(0, maxFiles - value.length))
    if (result) {
      const urls = result.map((r) => {
        const f = r as unknown as { ufsUrl?: string; url: string }
        return f.ufsUrl ?? f.url
      })
      onChange([...value, ...urls].slice(0, maxFiles))
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium">{label}</span>}

      {/* Sortable previews */}
      {value.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={value} strategy={rectSortingStrategy}>
            <div className="flex flex-wrap gap-2">
              {value.map((url, i) => (
                <SortableImage
                  key={url}
                  url={url}
                  index={i}
                  onRemove={() => remove(i)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      {value.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Перетащите фото чтобы изменить порядок. Первое — главное.
        </p>
      )}

      {value.length < maxFiles && (
        <div className="border border-border rounded-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border text-sm">
            {(["url", "upload"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 font-medium transition-colors",
                  tab === t ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t === "url" ? <><Link className="h-3.5 w-3.5" /> URL</> : <><Upload className="h-3.5 w-3.5" /> Загрузить</>}
              </button>
            ))}
          </div>

          <div className="p-3">
            {tab === "url" ? (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 h-9 rounded-lg border border-border bg-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button type="button" size="sm" onClick={addUrl} disabled={!urlInput.trim()}>
                  Добавить
                </Button>
              </div>
            ) : (
              <>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"))
                    handleFiles(files)
                  }}
                  className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent hover:bg-muted transition-colors"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-accent" />
                      <p className="text-sm text-muted-foreground mt-1">Загрузка...</p>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-1">Нажмите или перетащите файлы</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, WEBP до 4 МБ</p>
                    </>
                  )}
                </div>
                {uploadError && <p className="text-xs text-destructive mt-1">{uploadError}</p>}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple={maxFiles > 1}
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? [])
                    handleFiles(files)
                    e.target.value = ""
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
