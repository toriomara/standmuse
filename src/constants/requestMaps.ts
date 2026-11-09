import {
  ADDITIONAL_OPTIONS,
  BASE_FINISHES,
  COLUMN_PROFILES,
  FINISHES,
  MATERIALS,
  METAL_COLORS,
  PLATFORM_THICKNESSES,
  PRODUCT_TYPES,
} from "@/constants/configurator"

type Labelled = { value: string; label: string }

/** `value → label` для отображения сохранённых заявок; данные берём из конфигуратора. */
const labelMap = <T extends Labelled>(
  list: readonly T[],
  pick: (item: T) => string = (item) => item.label,
): Record<string, string> => Object.fromEntries(list.map((item) => [item.value, pick(item)]))

export const PRODUCT_TYPE_LABELS = labelMap(PRODUCT_TYPES)
export const MATERIAL_LABELS = labelMap(MATERIALS)
export const FINISH_LABELS = labelMap(FINISHES)
export const BASE_FINISH_LABELS = labelMap(BASE_FINISHES)
export const COLUMN_PROFILE_LABELS = labelMap(COLUMN_PROFILES)
export const PLATFORM_THICKNESS_LABELS = labelMap(PLATFORM_THICKNESSES)
export const METAL_COLOR_LABELS = labelMap(METAL_COLORS)
export const OPTION_LABELS = labelMap(ADDITIONAL_OPTIONS, (o) => o.shortLabel ?? o.label)
