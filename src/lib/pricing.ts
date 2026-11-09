import {
  ADDITIONAL_OPTIONS,
  BASE_PRICE,
  COLUMN_PROFILES,
  FINISHES,
  MATERIALS,
  PLATFORM_THICKNESSES,
  TIER_SURCHARGE,
} from "@/constants/configurator"

export interface PriceInput {
  material: string
  finish: string
  columnProfile: string
  platformThickness: string
  options: readonly string[]
}

const surchargeOf = (list: readonly { value: string; surcharge?: number }[], value: string) =>
  list.find((item) => item.value === value)?.surcharge ?? 0

/** Стоимость пары стоек: базовая цена + надбавки за выбранные материал, отделку, профиль и опции. */
export function calculatePrice(input: PriceInput): number {
  const tier = MATERIALS.find((m) => m.value === input.material)?.tier
  const optionsTotal = input.options.reduce((sum, value) => sum + surchargeOf(ADDITIONAL_OPTIONS, value), 0)

  return (
    BASE_PRICE +
    (tier ? TIER_SURCHARGE[tier] : 0) +
    surchargeOf(FINISHES, input.finish) +
    surchargeOf(COLUMN_PROFILES, input.columnProfile) +
    surchargeOf(PLATFORM_THICKNESSES, input.platformThickness) +
    optionsTotal
  )
}
