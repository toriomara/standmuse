import { NextResponse } from "next/server"
import { ZodError, z } from "zod"

/** Контекст динамических роутов вида /api/<resource>/[id]. */
export type IdContext = { params: Promise<{ id: string }> }

export function jsonError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status })
}

export const notFound = () => jsonError("Not found", 404)

function prismaErrorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("code" in error)) return undefined
  const { code } = error as { code: unknown }
  return typeof code === "string" ? code : undefined
}

/**
 * Единая обёртка для route handler'ов: переводит типовые ошибки в корректные
 * HTTP-статусы вместо «500 на всё».
 */
export async function handleRoute(label: string, fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonError(error.issues[0]?.message ?? "Validation failed", 400, {
        details: z.flattenError(error),
      })
    }
    if (error instanceof SyntaxError) return jsonError("Invalid JSON", 400)

    const code = prismaErrorCode(error)
    if (code === "P2025") return notFound() // запись не найдена (update/delete)
    if (code === "P2002") return jsonError("Запись с таким значением уже существует", 409)

    console.error(`[API ${label}]`, error)
    return jsonError("Internal server error", 500)
  }
}
