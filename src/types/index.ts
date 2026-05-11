export type UserRole = "USER" | "ADMIN"

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface CategoryData {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  productCount?: number
}

export interface ProductData {
  id: string
  name: string
  slug: string
  description: string
  shortDesc?: string | null
  priceFrom?: number | null
  images: string[]
  categoryId: string
  category?: { name: string; slug: string }
  materials: string[]
  features: string[]
  isFeatured: boolean
}

export interface ArticleData {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  image?: string | null
  tags: string[]
  publishedAt?: Date | null
  createdAt: Date
}

export interface OrderItem {
  productId?: string
  name: string
  quantity: number
  price?: number
}

export type OrderStatusType = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
export type RequestStatusType = "NEW" | "IN_REVIEW" | "QUOTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED"

export interface ConfiguratorState {
  step: number
  productType: string
  dimensions: { width: string; height: string; depth: string }
  material: string
  color: string
  finish: string
  options: string[]
  referenceFiles: string[]
  name: string
  email: string
  phone: string
  message: string
}