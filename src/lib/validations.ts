import { z } from "zod"
import { isAllowedImageHost } from "@/lib/image-hosts"

// ─── Общие кирпичики ──────────────────────────────────────────────────────────

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Некорректный идентификатор")
const imageUrl = z.url({ protocol: /^https?$/ })
const name = z.string().trim().min(2, "Введите имя").max(100)
const email = z.email("Неверный email").max(200)
const phone = z.string().trim().max(30).optional()
const slug = z.string().trim().max(200)
const text = (max: number) => z.string().max(max).nullish()
const stringList = z.array(z.string().trim().min(1)).max(50)

// ─── Публичные формы ──────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Имя слишком короткое").max(100),
  email,
  phone,
  password: z.string().min(8, "Пароль минимум 8 символов").max(200),
})

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Введите пароль"),
})

export const contactSchema = z.object({
  name,
  email,
  phone,
  message: z.string().trim().min(10, "Сообщение слишком короткое").max(5000),
})

/** «Обратный звонок»: у посетителя запрашиваем только имя и телефон. */
export const callbackSchema = z.object({
  name,
  phone: z.string().trim().min(5, "Введите телефон").max(30),
})

const dimensionsShape = z
  .object({
    width: z.string().max(20).optional(),
    height: z.string().max(20).optional(),
    depth: z.string().max(20).optional(),
  })
  .optional()

export const requestSchema = z.object({
  productType: z.string().min(1, "Выберите тип изделия").max(50),
  dimensions: dimensionsShape,
  dimensionsPlatform: dimensionsShape,
  dimensionsBase: dimensionsShape,
  material: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
  baseFinish: z.string().max(50).optional(),
  finish: z.string().max(50).optional(),
  options: z.array(z.string().max(100)).max(30).optional(),
  referenceFiles: z.array(imageUrl).max(10).optional(),
  name,
  email,
  phone,
  message: z.string().max(5000).optional(),
})

export const profileSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(20).optional(),
})

// ─── Чат ──────────────────────────────────────────────────────────────────────

export const messageSchema = z
  .object({
    text: z.string().max(4000).nullish(),
    imageUrl: imageUrl.refine(isAllowedImageHost, "Недопустимый адрес изображения").nullish(),
  })
  .refine((m) => Boolean(m.text?.trim() || m.imageUrl), "Пустое сообщение")

export const userMessageSchema = messageSchema.and(z.object({ conversationId: objectId }))

// ─── Админка ──────────────────────────────────────────────────────────────────

export const REQUEST_STATUSES = ["NEW", "IN_REVIEW", "QUOTED", "CONFIRMED", "COMPLETED", "CANCELLED"] as const
export const ORDER_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const

export const requestStatusSchema = z.object({ status: z.enum(REQUEST_STATUSES) })

/** Поля для создания; для PATCH используем `.partial()`. */
export const articleSchema = z.object({
  title: z.string().trim().min(1, "Введите заголовок").max(200),
  slug: slug.optional(),
  excerpt: text(1000),
  content: z.string(),
  image: imageUrl.nullish(),
  imageCaption: text(300),
  tags: stringList,
  isPublished: z.boolean(),
  seoTitle: text(200),
  seoDesc: text(500),
  seoKeywords: text(500),
})

export const productSchema = z.object({
  name: z.string().trim().min(1, "Введите название").max(200),
  slug: slug.min(1, "Введите slug"),
  description: z.string().min(1, "Введите описание"),
  shortDesc: text(500),
  priceFrom: z.number().nonnegative().nullish(),
  images: z.array(imageUrl).max(30),
  categoryId: objectId,
  materials: stringList,
  features: stringList,
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  seoTitle: text(200),
  seoDesc: text(500),
  seoKeywords: text(500),
})

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Введите заголовок").max(200),
  slug: slug.min(1, "Введите slug"),
  excerpt: text(1000),
  content: z.string(),
  images: z.array(imageUrl).max(30),
  acousticModel: text(200),
  height: text(50),
  materials: stringList,
  finish: text(200),
  price: z.number().nonnegative().nullish(),
  city: text(100),
  tags: stringList,
  isPublished: z.boolean(),
  sortOrder: z.number().int(),
  seoTitle: text(200),
  seoDesc: text(500),
})

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Введите название").max(100),
  slug: slug.min(1, "Введите slug"),
  description: text(1000),
  image: imageUrl.nullish(),
  seoTitle: text(200),
  seoDesc: text(500),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

const orderParamsSchema = z.record(z.string(), z.string().max(200))

export const orderSchema = z.object({
  contact: z.object({
    name: z.string().trim().min(1, "Введите имя клиента").max(100),
    phone: z.string().max(30).optional(),
    email: z.string().max(200).optional(),
  }),
  status: z.enum(ORDER_STATUSES),
  notes: text(5000),
  params: orderParamsSchema.nullish(),
  totalPrice: z.number().nonnegative().nullish(),
  items: z.array(z.unknown()),
})

/** Настройки сайта: произвольные ключи запрещены, значения — только строки. */
export const settingsSchema = z
  .object({
    siteName: z.string().max(200),
    siteDesc: z.string().max(1000),
    email: z.string().max(200),
    phone: z.string().max(50),
    telegram: z.string().max(100),
    seo: z.object({
      defaultTitle: z.string().max(200),
      defaultDesc: z.string().max(500),
      ogImage: z.string().max(500),
      googleVerification: z.string().max(200),
      yandexVerification: z.string().max(200),
    }),
  })
  .partial()

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type RequestInput = z.infer<typeof requestSchema>
