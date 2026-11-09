/** Параметры изделия в заказе — единый список для формы создания и редактора заказа. */
export const ORDER_PARAM_FIELDS = [
  { key: "height", label: "Общая высота", placeholder: "600 мм" },
  { key: "color", label: "Цвет", placeholder: "RAL 9003, чёрный…" },
  { key: "base", label: "Основание", placeholder: "Груша, Дуб…" },
  { key: "baseFinish", label: "Обработка основания", placeholder: "Масло, лак, воск…" },
  { key: "column", label: "Колонна", placeholder: "100×100×4 мм" },
  { key: "platform", label: "Платформа", placeholder: "250×200×4 мм" },
] as const

export type OrderParamKey = (typeof ORDER_PARAM_FIELDS)[number]["key"]
export type OrderParams = Partial<Record<OrderParamKey, string>>

/** Убирает пустые значения; если ничего не осталось — `null` (параметры не заданы). */
export function compactOrderParams(values: OrderParams): OrderParams | null {
  const entries = Object.entries(values).filter(([, v]) => v?.trim())
  return entries.length ? (Object.fromEntries(entries) as OrderParams) : null
}
