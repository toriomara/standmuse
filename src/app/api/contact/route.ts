import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleRoute } from "@/lib/api"
import { contactSchema } from "@/lib/validations"

export async function POST(req: Request) {
  return handleRoute("contact POST", async () => {
    const data = contactSchema.parse(await req.json())
    await prisma.request.create({
      data: {
        productType: "contact",
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      },
    })
    return NextResponse.json({ ok: true }, { status: 201 })
  })
}
