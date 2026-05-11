import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { contactSchema } from "@/lib/validations"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = contactSchema.parse(body)
    await prisma.request.create({
      data: {
        productType: "contact",
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Ошибка" }, { status: 400 })
  }
}
