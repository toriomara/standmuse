import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(2, "Имя слишком короткое"),
  email: z.string().email("Неверный email"),
  phone: z.string().optional(),
  password: z.string().min(8, "Пароль минимум 8 символов"),
})

export const loginSchema = z.object({
  email: z.string().email("Неверный email"),
  password: z.string().min(1, "Введите пароль"),
})

export const contactSchema = z.object({
  name: z.string().min(2, "Введите имя"),
  email: z.string().email("Неверный email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Сообщение слишком короткое"),
})

const dimensionsShape = z.object({
  width: z.string().optional(),
  height: z.string().optional(),
  depth: z.string().optional(),
}).optional()

export const requestSchema = z.object({
  productType: z.string().min(1, "Выберите тип изделия"),
  dimensions: dimensionsShape,
  dimensionsPlatform: dimensionsShape,
  dimensionsBase: dimensionsShape,
  material: z.string().optional(),
  color: z.string().optional(),
  baseFinish: z.string().optional(),
  finish: z.string().optional(),
  options: z.array(z.string()).optional(),
  referenceFiles: z.array(z.string()).optional(),
  name: z.string().min(2, "Введите имя"),
  email: z.string().email("Неверный email"),
  phone: z.string().optional(),
  message: z.string().optional(),
})

export type RequestDimensions = {
  main?: { width?: string; height?: string; depth?: string }
  platform?: { width?: string; height?: string; depth?: string }
  base?: { width?: string; height?: string; depth?: string }
}

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type RequestInput = z.infer<typeof requestSchema>