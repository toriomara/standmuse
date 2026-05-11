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

export function parseRequestOptions(options: unknown): {
  technical: string[]
  column?: string
  platform?: string
} {
  const arr = Array.isArray(options) ? (options as string[]) : []
  return {
    technical: arr.filter((o) => !o.startsWith("column:") && !o.startsWith("platform:")),
    column: arr.find((o) => o.startsWith("column:"))?.replace("column:", ""),
    platform: arr.find((o) => o.startsWith("platform:"))?.replace("platform:", ""),
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
