import { describe, expect, it } from "vitest"
import { compactOrderParams } from "./order-params"

describe("compactOrderParams", () => {
  it("убирает пустые и пробельные значения", () => {
    expect(compactOrderParams({ height: "600 мм", color: "  ", base: "" })).toEqual({ height: "600 мм" })
  })

  it("возвращает null, если ничего не заполнено", () => {
    expect(compactOrderParams({})).toBeNull()
    expect(compactOrderParams({ height: " " })).toBeNull()
  })
})
