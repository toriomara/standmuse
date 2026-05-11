import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { requestSchema } from "@/lib/validations"
import { getSessionUserId, isAdmin } from "@/lib/session"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await auth()
    if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const requests = await prisma.request.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(requests)
  } catch (error) {
    console.error("[API requests GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = requestSchema.parse(body)
    const session = await auth()
    const userId = getSessionUserId(session)

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
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten() }, { status: 400 })
    }
    console.error("[API requests POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
