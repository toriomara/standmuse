import { describe, expect, it } from "vitest"
import { resolvePublishedAt } from "./publishing"

const now = new Date("2026-01-01T00:00:00Z")
const earlier = new Date("2025-06-01T00:00:00Z")

describe("resolvePublishedAt", () => {
  it("ставит дату при первой публикации", () => {
    expect(resolvePublishedAt(true, { isPublished: false, publishedAt: null }, now)).toEqual(now)
  })

  it("ставит дату при создании сразу опубликованной записи", () => {
    expect(resolvePublishedAt(true, null, now)).toEqual(now)
  })

  it("не сдвигает дату первой публикации при последующих правках", () => {
    expect(resolvePublishedAt(true, { isPublished: true, publishedAt: earlier }, now)).toBeUndefined()
  })

  it("восстанавливает дату, если запись опубликована, но даты нет", () => {
    expect(resolvePublishedAt(true, { isPublished: true, publishedAt: null }, now)).toEqual(now)
  })

  it("обнуляет дату при снятии с публикации", () => {
    expect(resolvePublishedAt(false, { isPublished: true, publishedAt: earlier }, now)).toBeNull()
  })

  it("не трогает дату, если флаг публикации не передан", () => {
    expect(resolvePublishedAt(undefined, { isPublished: true, publishedAt: earlier }, now)).toBeUndefined()
  })
})
