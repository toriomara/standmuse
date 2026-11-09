import { afterEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"
import { handleRoute } from "./api"

afterEach(() => vi.restoreAllMocks())

describe("handleRoute", () => {
  it("пропускает успешный ответ как есть", async () => {
    const res = await handleRoute("t", async () => new Response("ok", { status: 201 }))
    expect(res.status).toBe(201)
  })

  it("ZodError → 400 с понятным текстом первой ошибки", async () => {
    const res = await handleRoute("t", async () => {
      z.object({ name: z.string().min(2, "Введите имя") }).parse({ name: "" })
      return new Response()
    })
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe("Введите имя")
  })

  it("битый JSON → 400", async () => {
    const res = await handleRoute("t", async () => {
      JSON.parse("{")
      return new Response()
    })
    expect(res.status).toBe(400)
  })

  it("Prisma P2025 → 404, P2002 → 409", async () => {
    const notFound = await handleRoute("t", async () => {
      throw Object.assign(new Error("x"), { code: "P2025" })
    })
    const conflict = await handleRoute("t", async () => {
      throw Object.assign(new Error("x"), { code: "P2002" })
    })
    expect(notFound.status).toBe(404)
    expect(conflict.status).toBe(409)
  })

  it("неизвестная ошибка → 500 без утечки деталей", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const res = await handleRoute("t", async () => {
      throw new Error("secret db password")
    })
    expect(res.status).toBe(500)
    expect(JSON.stringify(await res.json())).not.toContain("secret")
  })
})
