import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const settings = await prisma.siteSettings.findMany()
  const result: Record<string, unknown> = {}
  settings.forEach((s) => { result[s.key] = s.value })
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const session = await auth()
  const user = session?.user as { role?: string } | undefined
  if (user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const updates = await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        update: { value: value as never, updatedAt: new Date() },
        create: { key, value: value as never, updatedAt: new Date() },
      })
    )
  )
  return NextResponse.json(updates)
}
