import { describe, expect, it } from "vitest"
import { serializeJsonLd } from "./JsonLd"

describe("serializeJsonLd", () => {
  it("не даёт значению закрыть тег <script>", () => {
    const json = serializeJsonLd({ name: "</script><script>alert(1)</script>" })
    expect(json).not.toContain("<")
    // и остаётся валидным JSON с исходным значением
    expect(JSON.parse(json).name).toBe("</script><script>alert(1)</script>")
  })
})
