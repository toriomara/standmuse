import { describe, expect, it } from "vitest"
import {
  buildRequestOptions,
  formatDimensions,
  formatRequestId,
  parseRequestOptions,
} from "./requestFormat"

describe("buildRequestOptions / parseRequestOptions", () => {
  it("парсинг возвращает то, что собрал конфигуратор", () => {
    const options = buildRequestOptions({
      options: ["cable-channel", "height-750"],
      columnProfile: "120x80x5",
      platformThickness: "6mm",
    })

    expect(options).toEqual(["cable-channel", "height-750", "column:120x80x5", "platform:6mm"])
    expect(parseRequestOptions(options)).toEqual({
      technical: ["cable-channel", "height-750"],
      column: "120x80x5",
      platform: "6mm",
    })
  })

  it("не падает на мусоре из базы", () => {
    expect(parseRequestOptions(null)).toEqual({ technical: [], column: undefined, platform: undefined })
    expect(parseRequestOptions("x")).toEqual({ technical: [], column: undefined, platform: undefined })
  })
})

describe("formatDimensions", () => {
  it("склеивает заданные размеры", () => {
    expect(formatDimensions({ width: "220", depth: "350" })).toBe("Ш 220 × Г 350 мм")
  })

  it("null, если размеров нет", () => {
    expect(formatDimensions(null)).toBeNull()
    expect(formatDimensions({})).toBeNull()
  })
})

describe("formatRequestId", () => {
  it("берёт последние 8 символов в верхнем регистре", () => {
    expect(formatRequestId("64b0c0ffee1234567890abcd")).toBe("#7890ABCD")
  })
})
