import { describe, expect, it } from "vitest"
import {
  ADDITIONAL_OPTIONS,
  COLUMN_PROFILES,
  FINISHES,
  MATERIALS,
  PLATFORM_THICKNESSES,
} from "@/constants/configurator"
import { calculatePrice, type PriceInput } from "./pricing"

/** Исходная реализация расчёта (до выноса данных в constants) — эталон для регрессии. */
function legacyCalculatePrice(i: PriceInput): number {
  let price = 16_000
  if (i.material === "oak") price += 2_000
  if (["walnut", "elm", "pear", "cherry"].includes(i.material)) price += 4_000
  if (i.finish === "powder-matte") price += 1_000
  if (i.columnProfile === "120x80x5" || i.columnProfile === "120x120x5") price += 1_500
  if (i.columnProfile === "round-57") price += 2_500
  if (i.platformThickness === "6mm") price += 500
  if (i.platformThickness === "8mm") price += 1_000
  if (i.options.includes("cable-channel")) price += 2_000
  if (i.options.includes("footprint-base")) price += 2_000
  if (i.options.includes("height-750")) price += 1_000
  if (i.options.includes("edge-rounding")) price += 500
  return price
}

const base: PriceInput = {
  material: "birch",
  finish: "powder-moire",
  columnProfile: "100x100x3",
  platformThickness: "4mm",
  options: [],
}

describe("calculatePrice", () => {
  it("базовая конфигурация стоит 16 000 ₽", () => {
    expect(calculatePrice(base)).toBe(16_000)
  })

  it("учитывает класс материала", () => {
    expect(calculatePrice({ ...base, material: "oak" })).toBe(18_000)
    expect(calculatePrice({ ...base, material: "walnut" })).toBe(20_000)
  })

  it("суммирует надбавки за отделку, профиль, платформу и опции", () => {
    const price = calculatePrice({
      material: "walnut",
      finish: "powder-matte",
      columnProfile: "round-57",
      platformThickness: "8mm",
      options: ["cable-channel", "edge-rounding"],
    })
    // 16000 + 4000 + 1000 + 2500 + 1000 + 2000 + 500
    expect(price).toBe(27_000)
  })

  it("неизвестные значения не дают надбавки", () => {
    expect(calculatePrice({ ...base, material: "", finish: "", options: ["unknown"] })).toBe(16_000)
  })

  it("совпадает с исходной реализацией на всех комбинациях", () => {
    const optionSets = [[], ...ADDITIONAL_OPTIONS.map((o) => [o.value]), ADDITIONAL_OPTIONS.map((o) => o.value)]

    for (const material of MATERIALS)
      for (const finish of FINISHES)
        for (const columnProfile of COLUMN_PROFILES)
          for (const platformThickness of PLATFORM_THICKNESSES)
            for (const options of optionSets) {
              const input: PriceInput = {
                material: material.value,
                finish: finish.value,
                columnProfile: columnProfile.value,
                platformThickness: platformThickness.value,
                options,
              }
              expect(calculatePrice(input), JSON.stringify(input)).toBe(legacyCalculatePrice(input))
            }
  })
})
