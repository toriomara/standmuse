import { describe, expect, it } from "vitest"
import { formatPrice, parseList, slugify, truncate } from "./utils"

describe("slugify", () => {
  it("транслитерирует кириллицу", () => {
    expect(slugify("Стойки для KEF LS50")).toBe("stoyki-dlya-kef-ls50")
    expect(slugify("Щётка ёжика")).toBe("shchyotka-yozhika")
  })

  it("схлопывает спецсимволы и обрезает дефисы по краям", () => {
    expect(slugify("  --Hello,   World!--  ")).toBe("hello-world")
  })

  it("возвращает пустую строку, если слагу не из чего получиться", () => {
    expect(slugify("!!!")).toBe("")
  })
})

describe("parseList", () => {
  it("делит по запятой и убирает пустые элементы", () => {
    expect(parseList("орех, , металл ,")).toEqual(["орех", "металл"])
  })

  it("поддерживает другой разделитель", () => {
    expect(parseList("Высота 615\n\n Колонна 120", "\n")).toEqual(["Высота 615", "Колонна 120"])
  })

  it("пустая строка — пустой список", () => {
    expect(parseList("")).toEqual([])
  })
})

describe("formatPrice / truncate", () => {
  it("«По запросу» для пустой цены", () => {
    expect(formatPrice(null)).toBe("По запросу")
    expect(formatPrice(0)).toBe("По запросу")
  })

  it("форматирует рубли без копеек", () => {
    expect(formatPrice(16000).replace(/\s/g, " ")).toMatch(/^16 000 ₽$/)
  })

  it("обрезает длинные строки с многоточием", () => {
    expect(truncate("abcdef", 3)).toBe("abc…")
    expect(truncate("abc", 3)).toBe("abc")
  })
})
