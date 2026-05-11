"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  name: string
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  const navigate = (dir: 1 | -1) => {
    setDirection(dir)
    setActiveIndex((i) => (i + dir + images.length) % images.length)
  }

  const openAt = (index: number) => {
    setDirection(1)
    setActiveIndex(index)
    setModalOpen(true)
  }

  useEffect(() => {
    if (!modalOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigate(1)
      if (e.key === "ArrowLeft") navigate(-1)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [modalOpen, activeIndex, images.length])

  return (
    <>
      {/* Gallery trigger — outside modal */}
      <div className="flex flex-col gap-3">
        {images[0] ? (
          <button
            onClick={() => openAt(0)}
            aria-label={`Открыть галерею: ${name}`}
            className="relative aspect-4/3 rounded-2xl overflow-hidden bg-muted cursor-zoom-in group w-full"
          >
            <Image src={images[0]} alt={name} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
          </button>
        ) : (
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-muted">
            <ImagePlaceholder />
          </div>
        )}

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1, 5).map((img, i) => (
              <button
                key={i}
                onClick={() => openAt(i + 1)}
                aria-label={`Фото ${i + 2}`}
                className="relative aspect-square rounded-xl overflow-hidden bg-muted cursor-zoom-in group"
              >
                <Image src={img} alt={`${name} ${i + 2}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm data-[state=open]:animate-[fadeIn_150ms_ease] data-[state=closed]:animate-[fadeOut_150ms_ease]" />
          <Dialog.Content
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-3 cursor-zoom-out focus:outline-none data-[state=open]:animate-[fadeIn_200ms_ease] data-[state=closed]:animate-[fadeOut_150ms_ease]"
            aria-label={`Галерея: ${name}`}
            onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}
          >
            <Dialog.Title className="sr-only">Галерея: {name}</Dialog.Title>
            <Dialog.Description className="sr-only">
              Фото {activeIndex + 1} из {images.length}
            </Dialog.Description>

            {/* Close */}
            <Dialog.Close
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/70 hover:bg-black/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Закрыть"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>

            {/* Counter */}
            {images.length > 1 && (
              <div className="absolute left-4 top-4 z-10 text-white/70 text-sm tabular-nums select-none">
                {activeIndex + 1} / {images.length}
              </div>
            )}

            {/* Slide area */}
            <div className="relative w-full max-w-6xl overflow-hidden rounded-xl cursor-auto" style={{ aspectRatio: "4/3", maxHeight: "75vh" }}>
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.32, 0, 0.67, 0] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[activeIndex]}
                    alt={`${name} ${activeIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 80vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => navigate(-1)}
                    aria-label="Предыдущее фото"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => navigate(1)}
                    aria-label="Следующее фото"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1 max-w-full px-2">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > activeIndex ? 1 : -1)
                      setActiveIndex(i)
                    }}
                    aria-label={`Фото ${i + 1}`}
                    aria-current={i === activeIndex ? "true" : undefined}
                    className={cn(
                      "relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                      i === activeIndex
                        ? "border-accent opacity-100"
                        : "border-transparent opacity-50 hover:opacity-80"
                    )}
                  >
                    <Image
                      src={src}
                      alt={`${name} миниатюра ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </button>
                ))}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
