import { PrismaClient } from "@prisma/client"

declare global {
   
  var _prisma: PrismaClient | undefined
}

function getClient(): PrismaClient {
  if (!globalThis._prisma) {
    globalThis._prisma = new PrismaClient()
  }
  return globalThis._prisma
}

// Lazy proxy — PrismaClient is only instantiated on first property access,
// not at module evaluation time, so build-time imports don't require DATABASE_URL.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string) {
    return getClient()[prop as keyof PrismaClient]
  },
})
