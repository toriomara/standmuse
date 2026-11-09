import { describe, expect, it } from "vitest"
import {
  articleSchema,
  callbackSchema,
  messageSchema,
  orderSchema,
  requestSchema,
  requestStatusSchema,
  userMessageSchema,
} from "./validations"

describe("callbackSchema", () => {
  it("принимает имя и телефон без email — иначе заявки на звонок теряются", () => {
    expect(callbackSchema.safeParse({ name: "Иван", phone: "+7 900 000-00-00" }).success).toBe(true)
  })

  it("требует телефон", () => {
    expect(callbackSchema.safeParse({ name: "Иван", phone: "" }).success).toBe(false)
  })

  // Регрессия: форма звонка раньше слала данные в /api/requests, где email обязателен
  it("requestSchema по-прежнему требует email", () => {
    const result = requestSchema.safeParse({ productType: "callback", name: "Иван", phone: "123456" })
    expect(result.success).toBe(false)
  })
})

describe("messageSchema", () => {
  it("принимает текст или картинку с разрешённого домена", () => {
    expect(messageSchema.safeParse({ text: "Привет" }).success).toBe(true)
    expect(messageSchema.safeParse({ imageUrl: "https://wh3ky9dof2.ufs.sh/f/abc" }).success).toBe(true)
  })

  it("отклоняет пустое сообщение", () => {
    expect(messageSchema.safeParse({ text: "   " }).success).toBe(false)
    expect(messageSchema.safeParse({}).success).toBe(false)
  })

  it("отклоняет картинку с чужого домена (трекинг-пиксели, чужой контент)", () => {
    expect(messageSchema.safeParse({ imageUrl: "https://evil.example/pixel.gif" }).success).toBe(false)
  })

  it("userMessageSchema требует корректный id диалога", () => {
    expect(userMessageSchema.safeParse({ conversationId: "nope", text: "hi" }).success).toBe(false)
    expect(
      userMessageSchema.safeParse({ conversationId: "64b0c0ffee1234567890abcd", text: "hi" }).success,
    ).toBe(true)
  })
})

describe("articleSchema", () => {
  const valid = {
    title: "Заголовок",
    content: "<p>Текст</p>",
    tags: ["a"],
    isPublished: false,
  }

  it("отбрасывает неизвестные поля (защита от mass assignment)", () => {
    const parsed = articleSchema.parse({ ...valid, id: "x", createdAt: "2020-01-01", role: "ADMIN" })
    expect(parsed).not.toHaveProperty("id")
    expect(parsed).not.toHaveProperty("createdAt")
    expect(parsed).not.toHaveProperty("role")
  })

  it(".partial() позволяет менять отдельные поля", () => {
    expect(articleSchema.partial().safeParse({ isPublished: true }).success).toBe(true)
  })

  it("отклоняет пустой заголовок и не-URL в обложке", () => {
    expect(articleSchema.safeParse({ ...valid, title: "  " }).success).toBe(false)
    expect(articleSchema.safeParse({ ...valid, image: "not-a-url" }).success).toBe(false)
  })

  it("не принимает javascript: в ссылке на изображение", () => {
    expect(articleSchema.safeParse({ ...valid, image: "javascript:alert(1)" }).success).toBe(false)
  })
})

describe("status и order схемы", () => {
  it("статус заявки — только из enum", () => {
    expect(requestStatusSchema.safeParse({ status: "QUOTED" }).success).toBe(true)
    expect(requestStatusSchema.safeParse({ status: "HACKED" }).success).toBe(false)
  })

  it("заказ требует имя клиента", () => {
    const base = { status: "PENDING", items: [] }
    expect(orderSchema.safeParse({ ...base, contact: { name: "" } }).success).toBe(false)
    expect(orderSchema.safeParse({ ...base, contact: { name: "Иван" } }).success).toBe(true)
  })
})
