import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { handleRoute } from "@/lib/api"
import { requireAdmin } from "@/lib/requireAdmin"
import { settingsSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export async function GET() {
  return handleRoute("admin/settings GET", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const settings = await prisma.siteSettings.findMany()
    return NextResponse.json(Object.fromEntries(settings.map((s) => [s.key, s.value])))
  })
}

export async function POST(req: Request) {
  return handleRoute("admin/settings POST", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const body = settingsSchema.parse(await req.json())
    const updatedAt = new Date()
    const updates = await Promise.all(
      Object.entries(body).map(([key, value]) => {
        const json = value as Prisma.InputJsonValue
        return prisma.siteSettings.upsert({
          where: { key },
          update: { value: json, updatedAt },
          create: { key, value: json, updatedAt },
        })
      }),
    )
    return NextResponse.json(updates)
  })
}
