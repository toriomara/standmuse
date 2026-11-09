import { generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "./uploadthing"

export const { useUploadThing } = generateReactHelpers<OurFileRouter>()

/** Публичный адрес загруженного файла (`ufsUrl`; `url` — устаревший запасной вариант). */
export function getUploadedUrl(file: { ufsUrl?: string; url: string }): string {
  return file.ufsUrl ?? file.url
}
