/** Форматирует ввод в маску `+7 (900) 000-00-00` по мере набора. */
export function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11)
  if (!d) return ""
  let result = "+7"
  if (d.length > 1) result += ` (${d.slice(1, 4)}`
  if (d.length >= 4) result += ")"
  if (d.length > 4) result += ` ${d.slice(4, 7)}`
  if (d.length > 7) result += `-${d.slice(7, 9)}`
  if (d.length > 9) result += `-${d.slice(9, 11)}`
  return result
}
