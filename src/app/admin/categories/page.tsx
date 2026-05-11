"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface Category {
  id: string; name: string; slug: string; isActive: boolean; _count?: { products: number }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [newSlug, setNewSlug] = useState("")

  const load = async () => {
    const res = await fetch("/api/categories")
    const data = await res.json()
    setCategories(data)
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!newName) return
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, slug: newSlug || newName.toLowerCase().replace(/\s+/g, "-") }),
    })
    setNewName(""); setNewSlug("")
    load()
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Категории</h1>

      {/* Create */}
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <p className="text-sm font-medium mb-3">Новая категория</p>
        <div className="flex gap-3">
          <Input placeholder="Название" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Input placeholder="slug" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} />
          <Button onClick={create} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Название</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Товаров</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {categories.map((cat) => (
              <tr key={cat.id} className="bg-[var(--card)] hover:bg-[var(--muted)] transition-colors">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)] font-mono text-xs">{cat.slug}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">{cat._count?.products ?? 0}</td>
                <td className="px-4 py-3">
                  <Badge variant={cat.isActive ? "success" : "default"}>
                    {cat.isActive ? "Активна" : "Скрыта"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
