import { describe, expect, it } from "vitest"
import { isAllowedImageHost } from "./image-hosts"

describe("isAllowedImageHost", () => {
  it("принимает точные и wildcard-домены", () => {
    expect(isAllowedImageHost("https://utfs.io/f/abc")).toBe(true)
    expect(isAllowedImageHost("https://wh3ky9dof2.ufs.sh/f/abc")).toBe(true)
    expect(isAllowedImageHost("https://images.unsplash.com/photo-1")).toBe(true)
  })

  it("отклоняет чужие домены", () => {
    expect(isAllowedImageHost("https://example.com/a.jpg")).toBe(false)
  })

  it("не даёт обойти проверку похожим доменом", () => {
    expect(isAllowedImageHost("https://evilufs.sh/a.jpg")).toBe(false)
    expect(isAllowedImageHost("https://ufs.sh.evil.com/a.jpg")).toBe(false)
    expect(isAllowedImageHost("https://utfs.io.evil.com/a.jpg")).toBe(false)
  })

  it("отклоняет не-URL", () => {
    expect(isAllowedImageHost("not a url")).toBe(false)
    expect(isAllowedImageHost("")).toBe(false)
  })
})
