import { describe, expect, it } from "vitest"
import { formatPhone } from "./phone"

describe("formatPhone", () => {
  it("форматирует по мере набора", () => {
    expect(formatPhone("")).toBe("")
    expect(formatPhone("7")).toBe("+7")
    expect(formatPhone("79")).toBe("+7 (9")
    expect(formatPhone("79005")).toBe("+7 (900) 5")
  })

  it("форматирует полный номер и игнорирует лишние символы", () => {
    expect(formatPhone("+7 (900) 123-45-67")).toBe("+7 (900) 123-45-67")
    expect(formatPhone("790012345678999")).toBe("+7 (900) 123-45-67")
  })
})
