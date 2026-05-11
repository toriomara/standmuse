import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function requireAdmin() {
  const session = await auth()
  const user = session?.user as { role?: string } | undefined
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}
