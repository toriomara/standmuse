"use client"

import Image from "next/image"
import { ImagePlaceholder } from "./ImagePlaceholder"
import { useImageFallback } from "./SafeImage"

interface Props {
  src: string
  alt: string
  sizes: string
  className?: string
  priority?: boolean
}

export function ArticleImage({ src, alt, sizes, className, priority }: Props) {
  const { ref, failed, onError } = useImageFallback(src)

  if (failed) return <ImagePlaceholder />

  return (
    <Image
      ref={ref}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      onError={onError}
      unoptimized={src.includes("ufs.sh") || src.includes("utfs.io") || src.includes("uploadthing")}
    />
  )
}
