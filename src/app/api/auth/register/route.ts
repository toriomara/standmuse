import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { handleRoute, jsonError } from "@/lib/api"
import { registerSchema } from "@/lib/validations"

export async function POST(req: Request) {
  return handleRoute("auth/register POST", async () => {
    const data = registerSchema.parse(await req.json())

    const exists = await prisma.user.findUnique({ where: { email: data.email } })
    if (exists) return jsonError("Email уже зарегистрирован", 400)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: await bcrypt.hash(data.password, 12),
      },
    })

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
  })
}
