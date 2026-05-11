import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async () => {
      const session = await auth()
      const user = session?.user as { role?: string } | undefined
      if (!session?.user || user?.role !== "ADMIN") throw new Error("Unauthorized")
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl }
    }),

  chatImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user) throw new Error("Unauthorized")
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
