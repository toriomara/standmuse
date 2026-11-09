/**
 * Единый источник данных конфигуратора: из него строятся и шаги формы,
 * и расчёт цены, и подписи в админке (см. requestMaps.ts).
 */

export interface ConfiguratorOption {
  value: string
  label: string
  desc?: string
  /** Надбавка к базовой цене, ₽ */
  surcharge?: number
}

export const BASE_PRICE = 16_000

export const STEPS = ["Тип изделия", "Размеры", "Материал", "Отделка", "Опции", "Контакты"] as const

/** Конфигуратор пока умеет считать только акустические стойки. */
export const AVAILABLE_PRODUCT_TYPE = "acoustic-stand"

export const PRODUCT_TYPES: readonly ConfiguratorOption[] = [
  { value: "acoustic-stand", label: "Акустические стойки", desc: "Для полочной акустики" },
  { value: "hifi-stand", label: "Стойка для HI-FI", desc: "Для аппаратуры" },
  { value: "acoustic-panel", label: "Акустическая панель", desc: "Для комнаты" },
  { value: "diffuser", label: "Диффузор", desc: "QRD и другие" },
  { value: "accessory", label: "Аксессуар", desc: "Шипы, прокладки и др." },
]

export type MaterialTier = "Heritage" | "Signature"

export const TIER_SURCHARGE: Record<MaterialTier, number> = {
  Heritage: 2_000,
  Signature: 4_000,
}

export const MATERIALS: readonly (ConfiguratorOption & { tier: MaterialTier | null })[] = [
  { value: "birch", label: "Берёза", tier: null },
  { value: "beech", label: "Бук", tier: null },
  { value: "ash", label: "Ясень", tier: null },
  { value: "oak", label: "Дуб", tier: "Heritage" },
  { value: "elm", label: "Карагач", tier: "Signature" },
  { value: "pear", label: "Груша", tier: "Signature" },
  { value: "cherry", label: "Вишня", tier: "Signature" },
  { value: "walnut", label: "Орех", tier: "Signature" },
]

export const FINISHES: readonly ConfiguratorOption[] = [
  { value: "powder-matte", label: "Порошковая матовая", surcharge: 1_000 },
  { value: "powder-moire", label: "Порошковая муар" },
]

export const BASE_FINISHES: readonly ConfiguratorOption[] = [
  { value: "oil-wax", label: "Масло + воск" },
  { value: "wax", label: "Воск" },
  { value: "oil-wax-combo", label: "Масло + воск и Воск" },
]

export const METAL_COLORS: readonly (ConfiguratorOption & { hex: string })[] = [
  { value: "black", label: "Чёрный", hex: "#1c1c1c" },
  { value: "anthracite", label: "Антрацит", hex: "#4a4a52" },
  { value: "silver", label: "Серебро", hex: "#a8a9ad" },
  { value: "white", label: "Белый", hex: "#f0f0f0" },
  { value: "bronze", label: "Бронза", hex: "#b5803a" },
]

export const DEFAULT_COLUMN_PROFILE = "100x100x3"
export const COLUMN_PROFILES: readonly ConfiguratorOption[] = [
  { value: "100x100x3", label: "100×100 мм, стенка 3 мм", desc: "Стандарт" },
  { value: "120x80x5", label: "120×80 мм, стенка 5 мм", desc: "Усиленный", surcharge: 1_500 },
  { value: "120x120x5", label: "120×120 мм, стенка 5 мм", desc: "Максимальный", surcharge: 1_500 },
  { value: "round-57", label: "Круглые Ø57 мм", desc: "Круглая колонна", surcharge: 2_500 },
]

export const DEFAULT_PLATFORM_THICKNESS = "4mm"
export const PLATFORM_THICKNESSES: readonly ConfiguratorOption[] = [
  { value: "4mm", label: "4 мм", desc: "Стандарт" },
  { value: "6mm", label: "6 мм", desc: "Усиленная", surcharge: 500 },
  { value: "8mm", label: "8 мм", desc: "Максимальная", surcharge: 1_000 },
]

export const ADDITIONAL_OPTIONS: readonly (ConfiguratorOption & { shortLabel?: string })[] = [
  {
    value: "cable-channel",
    label: "Внутренний кабель-канал",
    desc: "Провода спрятаны внутри колонны, выход у основания",
    surcharge: 2_000,
  },
  {
    value: "footprint-base",
    label: "Основание и платформа по форме акустики",
    shortLabel: "Основание по форме акустики",
    desc: "Повторяет футпринт колонок — закруглённые или фигурные боковины",
    surcharge: 2_000,
  },
  {
    value: "height-750",
    label: "Высота >750 мм",
    desc: "Нестандартная высота колонны",
    surcharge: 1_000,
  },
  {
    value: "edge-rounding",
    label: "Скругление рёбер (радиусом скругления на выбор)",
    shortLabel: "Скругление рёбер",
    surcharge: 500,
  },
]
