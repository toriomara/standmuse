"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { useState } from "react"
import { X } from "lucide-react"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"

export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const openImage = (i: number) => {
    setActiveIndex(i)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Основное изображение */}
        <div
          className="aspect-4/3 rounded-xl bg-muted overflow-hidden flex items-center justify-center cursor-zoom-in"
          onClick={() => images[0] && openImage(0)}
        >
          {images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[0]} alt={title} className="w-full h-full object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>

        {/* Миниатюры */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1, 5).map((url, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg overflow-hidden bg-muted cursor-zoom-in"
                onClick={() => openImage(i + 1)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Лайтбокс */}
      <Dialog.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm data-[state=open]:animate-[fadeIn_150ms_ease] data-[state=closed]:animate-[fadeOut_150ms_ease]" />
          <Dialog.Content
            className="fixed inset-0 z-50 flex items-center justify-center p-4 focus:outline-none cursor-zoom-out"
            onClick={() => setLightboxOpen(false)}
          >
            <Dialog.Title className="sr-only">{title}</Dialog.Title>
            <Dialog.Close
              aria-label="Закрыть"
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-7 w-7" />
            </Dialog.Close>
            {images[activeIndex] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[activeIndex]}
                alt={title}
                className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
