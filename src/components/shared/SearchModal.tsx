"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { Search, X, ArrowRight, BookOpen, Hammer, Package } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

type ResultType = "product" | "article" | "project"

interface SearchResult {
  id: string
  type: ResultType
  name: string
  href: string
  subtitle: string
  image: string | null
  priceFrom: number | null
}

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

const TYPE_META: Record<ResultType, { icon: React.ElementType; label: string }> = {
  product: { icon: Package,  label: "Товар" },
  article: { icon: BookOpen, label: "Статья" },
  project: { icon: Hammer,   label: "Работа" },
}

const SECTION_ORDER: ResultType[] = ["product", "article", "project"]

function ResultIcon({ type }: { type: ResultType }) {
  const Icon = TYPE_META[type].icon
  return <Icon className="h-5 w-5 text-muted-foreground/50" aria-hidden="true" />
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery]       = useState("")
  const [results, setResults]   = useState<SearchResult[]>([])
  const [loading, setLoading]   = useState(false)
  const [searched, setSearched] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cancel any pending request on unmount — no setState here, only cleanup
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  // All setState calls are inside event handlers or async callbacks — no effect setState
  const handleOpenChange = (v: boolean) => {
    if (!v) {
      if (timerRef.current) clearTimeout(timerRef.current)
      setQuery("")
      setResults([])
      setLoading(false)
      setSearched(false)
      onClose()
    }
  }

  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (timerRef.current) clearTimeout(timerRef.current)

    const q = value.trim()
    if (!q) {
      setResults([])
      setLoading(false)
      setSearched(false)
      return
    }

    setLoading(true)
    setSearched(false)
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setResults(data.results ?? [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
        setSearched(true)
      }
    }, 300)
  }

  const trimmedQuery   = query.trim()
  const displayResults = trimmedQuery ? results : []
  const hasResults     = displayResults.length > 0
  const isEmpty        = trimmedQuery.length >= 2 && searched && !loading && !hasResults

  const grouped = displayResults.reduce<Record<ResultType, SearchResult[]>>(
    (acc, r) => { acc[r.type].push(r); return acc },
    { product: [], article: [], project: [] }
  )

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm data-[state=open]:animate-[fadeIn_150ms_ease] data-[state=closed]:animate-[fadeOut_150ms_ease]" />
        <Dialog.Content className="fixed inset-x-0 mx-auto top-[12%] z-60 w-full max-w-xl px-4 focus:outline-none data-[state=open]:animate-[searchSlideIn_200ms_ease] data-[state=closed]:animate-[searchSlideOut_150ms_ease]">
          <Dialog.Title className="sr-only">Поиск по сайту</Dialog.Title>
          <Dialog.Description className="sr-only">Введите запрос для поиска товаров, статей и работ</Dialog.Description>

          <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Input */}
            <div className="relative border-b border-border transition-colors focus-within:border-border/40">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                autoFocus
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Поиск по сайту..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground pl-11 pr-11 py-4"
              />
              {query ? (
                <button
                  onClick={() => handleQueryChange("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Очистить"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex text-[10px] text-muted-foreground/60 border border-border rounded px-1.5 py-0.5">
                  Esc
                </kbd>
              )}
            </div>

            {/* Results grouped by type */}
            {hasResults && (
              <div className="py-2 max-h-120 overflow-y-auto">
                {SECTION_ORDER.map((type) => {
                  const items = grouped[type]
                  if (!items.length) return null
                  const { label } = TYPE_META[type]
                  return (
                    <section key={type} aria-labelledby={`search-group-${type}`}>
                      <p id={`search-group-${type}`} className="px-5 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                        {label}
                      </p>
                      <ul className="divide-y divide-border/50">
                        {items.map((r) => (
                          <li key={r.id}>
                            <Link
                              href={r.href}
                              onClick={onClose}
                              className="flex items-center gap-3 px-5 py-3 hover:bg-muted transition-colors group"
                            >
                              <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                                {r.image ? (
                                  <Image src={r.image} alt={r.name} fill sizes="44px" className="object-cover" />
                                ) : (
                                  <ResultIcon type={r.type} />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                                  {r.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.subtitle}</p>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {r.type === "product" && (
                                  <span className="text-xs text-muted-foreground">
                                    {r.priceFrom ? `от ${formatPrice(r.priceFrom)}` : "По запросу"}
                                  </span>
                                )}
                                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-accent transition-colors" />
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )
                })}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center min-h-55 text-sm text-muted-foreground">
                Поиск…
              </div>
            )}

            {/* Empty */}
            {isEmpty && (
              <div className="flex items-center justify-center min-h-55 px-6 text-center text-sm text-muted-foreground">
                Ничего не найдено по запросу{" "}
                <span className="text-foreground font-medium ml-1">«{trimmedQuery}»</span>
              </div>
            )}

            {/* Hint */}
            {!query && (
              <div className="flex flex-col items-center justify-center min-h-55 gap-3 text-muted-foreground">
                <p className="text-xs">Поиск по товарам, статьям и работам</p>
                <div className="flex items-center gap-4 text-[10px]">
                  {SECTION_ORDER.map((type) => {
                    const { icon: Icon, label } = TYPE_META[type]
                    return (
                      <span key={type} className="flex items-center gap-1">
                        <Icon className="h-3 w-3" /> {label}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
