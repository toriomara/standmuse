import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().max(20).optional().or(z.literal("")),
})

export async function PATCH(req: Request) {
  const session = await auth()
  const userId = (session?.user as { id?: string })?.id
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 })

  const { name, phone } = parsed.data

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name, phone: phone || null },
    })
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
