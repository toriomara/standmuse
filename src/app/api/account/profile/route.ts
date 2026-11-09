import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { handleRoute, jsonError } from "@/lib/api"
import { getSessionUserId } from "@/lib/session"
import { profileSchema } from "@/lib/validations"

export async function PATCH(req: Request) {
  return handleRoute("account/profile PATCH", async () => {
    const userId = getSessionUserId(await auth())
    if (!userId) return jsonError("Unauthorized", 401)

    const { name, phone } = profileSchema.parse(await req.json())
    await prisma.user.update({
      where: { id: userId },
      data: { name, phone: phone || null },
    })

    return NextResponse.json({ ok: true })
  })
}
