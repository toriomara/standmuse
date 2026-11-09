import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { handleRoute } from "@/lib/api"
import { requireAdmin } from "@/lib/requireAdmin"
import { requestSchema } from "@/lib/validations"
import { getSessionUserId } from "@/lib/session"

export const dynamic = "force-dynamic"

export async function GET() {
  return handleRoute("requests GET", async () => {
    const forbidden = await requireAdmin()
    if (forbidden) return forbidden

    const requests = await prisma.request.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(requests)
  })
}

export async function POST(req: Request) {
  return handleRoute("requests POST", async () => {
    const data = requestSchema.parse(await req.json())
    const userId = getSessionUserId(await auth())

    const dimensions = {
      ...(data.dimensions && { main: data.dimensions }),
      ...(data.dimensionsPlatform && { platform: data.dimensionsPlatform }),
      ...(data.dimensionsBase && { base: data.dimensionsBase }),
    }

    const request = await prisma.request.create({
      data: {
        productType: data.productType,
        dimensions: Object.keys(dimensions).length ? dimensions : undefined,
        material: data.material,
        color: data.color,
        baseFinish: data.baseFinish,
        finish: data.finish,
        options: data.options ?? [],
        referenceFiles: data.referenceFiles ?? [],
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        ...(userId && { userId }),
      },
    })

    return NextResponse.json(request, { status: 201 })
  })
}
