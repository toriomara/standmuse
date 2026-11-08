"use client"

import { useCallback, useEffect, useRef, useState, type ImgHTMLAttributes } from "react"
import { ImagePlaceholder } from "./ImagePlaceholder"

export function useImageFallback(src: string) {
  const ref = useRef<HTMLImageElement>(null)
  const [failed, setFailed] = useState(false)

  const onError = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[image] не удалось загрузить: ${src}`)
    }
    setFailed(true)
  }, [src])

  // onError не срабатывает, если картинка упала до гидрации
  useEffect(() => {
    const img = ref.current
    if (img?.complete && img.naturalWidth === 0) onError()
  }, [onError])

  return { ref, failed, onError }
}

export function SafeImg({ src, alt, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { src: string }) {
  const { ref, failed, onError } = useImageFallback(src)
  if (failed) return <ImagePlaceholder />
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt={alt} onError={onError} {...rest} />
}
