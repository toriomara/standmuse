import type { NavItem } from "@/types"

export const mainNav: NavItem[] = [
  { label: "Каталог", href: "/catalog" },
  { label: "Заказать", href: "/order" },
  { label: "Доставка", href: "/delivery" },
  { label: "Работы", href: "/projects" },
  { label: "Статьи", href: "/articles" },
  { label: "Контакты", href: "/contacts" },
]

export const categoryNav: NavItem[] = [
  { label: "Акустические стойки", href: "/catalog/acoustic-stands" },
  { label: "Стойки для HI-FI", href: "/catalog/hifi-stands" },
  { label: "Акустические панели", href: "/catalog/acoustic-panels" },
  { label: "Диффузоры", href: "/catalog/diffusers" },
  { label: "Подиумы", href: "/catalog/podiums" },
  { label: "Аксессуары", href: "/catalog/accessories" },
]