import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleRoute } from "@/lib/api"
import { callbackSchema } from "@/lib/validations"

/** Заявка «Обратный звонок»: только имя и телефон (email у посетителя не спрашиваем). */
export async function POST(req: Request) {
  return handleRoute("callback POST", async () => {
    const data = callbackSchema.parse(await req.json())
    await prisma.request.create({
      data: {
        productType: "callback",
        name: data.name,
        phone: data.phone,
        email: "", // поле обязательно в модели; для звонка email отсутствует
        message: "Запрос обратного звонка",
      },
    })
    return NextResponse.json({ ok: true }, { status: 201 })
  })
}
