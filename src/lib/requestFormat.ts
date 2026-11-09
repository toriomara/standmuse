export type DimensionSet = {
  width?: string
  height?: string
  depth?: string
}

export type RequestDimensionsValue = {
  main?: DimensionSet
  platform?: DimensionSet
  base?: DimensionSet
}

// Профиль колонны и толщина платформы хранятся в общем списке options с префиксом
const COLUMN_PREFIX = "column:"
const PLATFORM_PREFIX = "platform:"

/** Собирает `options` заявки: выбранные опции + профиль колонны + толщина платформы. */
export function buildRequestOptions(selection: {
  options: readonly string[]
  columnProfile: string
  platformThickness: string
}): string[] {
  return [
    ...selection.options,
    `${COLUMN_PREFIX}${selection.columnProfile}`,
    `${PLATFORM_PREFIX}${selection.platformThickness}`,
  ]
}

export function parseRequestOptions(options: unknown): {
  technical: string[]
  column?: string
  platform?: string
} {
  const arr = Array.isArray(options) ? (options as string[]) : []
  const valueOf = (prefix: string) =>
    arr.find((o) => o.startsWith(prefix))?.slice(prefix.length)

  return {
    technical: arr.filter((o) => !o.startsWith(COLUMN_PREFIX) && !o.startsWith(PLATFORM_PREFIX)),
    column: valueOf(COLUMN_PREFIX),
    platform: valueOf(PLATFORM_PREFIX),
  }
}

export function formatDimensions(dims: DimensionSet | null | undefined): string | null {
  if (!dims) return null
  const parts = [
    dims.width && `Ш ${dims.width}`,
    dims.height && `В ${dims.height}`,
    dims.depth && `Г ${dims.depth}`,
  ].filter(Boolean)
  return parts.length ? `${parts.join(" × ")} мм` : null
}

export function parseRequestDimensions(value: unknown): RequestDimensionsValue {
  if (!value || typeof value !== "object") return {}
  return value as RequestDimensionsValue
}

export function formatRequestId(id: string): string {
  return `#${id.slice(-8).toUpperCase()}`
}
