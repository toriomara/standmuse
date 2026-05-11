import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = registerSchema.parse(body)

    const exists = await prisma.user.findUnique({ where: { email: data.email } })
    if (exists) {
      return NextResponse.json({ error: "Email уже зарегистрирован" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, phone: data.phone, password: hashed },
    })

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Ошибка регистрации" }, { status: 500 })
  }
}
