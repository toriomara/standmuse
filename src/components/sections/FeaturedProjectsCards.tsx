"use client"

import Link from "next/link"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Ruler, Layers, ArrowRight, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"

type ProjectSnippet = {
  id: string
  title: string
  slug: string
  images: string[]
  acousticModel: string | null
  height: string | null
  materials: string[]
  price: number | null
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickNext(all: ProjectSnippet[], current: ProjectSnippet[]): ProjectSnippet[] {
  const currentIds = new Set(current.map((p) => p.id))
  const pool = all.filter((p) => !currentIds.has(p.id))
  const source = pool.length >= 3 ? pool : all
  return shuffle(source).slice(0, 3)
}

export function FeaturedProjectsCards({ projects }: { projects: ProjectSnippet[] }) {
  const [visible, setVisible] = useState(() => projects.slice(0, 3))
  const [key, setKey] = useState(0)
  const [spinning, setSpinning] = useState(false)

  const handleShuffle = () => {
    setVisible(pickNext(projects, visible))
    setKey((k) => k + 1)
    setSpinning(true)
    setTimeout(() => setSpinning(false), 500)
  }

  return (
    <div className="flex flex-col gap-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {visible.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group border border-border rounded-xl overflow-hidden bg-card hover:border-accent transition-colors"
            >
              <div className="aspect-4/3 bg-muted overflow-hidden">
                {project.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-base leading-snug group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                {project.acousticModel && (
                  <p className="text-sm text-muted-foreground">{project.acousticModel}</p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                  {project.height && (
                    <span className="flex items-center gap-1">
                      <Ruler className="h-3 w-3" /> {project.height}
                    </span>
                  )}
                  {project.materials[0] && (
                    <span className="flex items-center gap-1">
                      <Layers className="h-3 w-3" /> {project.materials[0]}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  {project.price ? (
                    <span className="text-sm font-semibold text-accent">
                      {project.price.toLocaleString("ru-RU")} ₽
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-accent transition-colors">
                    Подробнее <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>

      {projects.length > 3 && (
        <div className="flex justify-center">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-full px-5 py-2 transition-colors hover:border-accent/50"
          >
            <RefreshCw className={cn("h-4 w-4 transition-transform", spinning && "animate-spin")} />
            Другие проекты
          </button>
        </div>
      )}
    </div>
  )
}
