"use client"

import {
  LayoutDashboard, Package, Tags, ShoppingCart, MessageSquare,
  FileText, Image, Megaphone, Search, Settings, Briefcase, ClipboardList,
} from "lucide-react"
import { SidebarNav, type SidebarNavItem } from "@/components/SidebarNav"

const items: SidebarNavItem[] = [
  { href: "/admin",            label: "Дашборд",   icon: LayoutDashboard, exact: true },
  { href: "/admin/products",   label: "Товары",    icon: Package },
  { href: "/admin/projects",   label: "Проекты",   icon: Briefcase },
  { href: "/admin/categories", label: "Категории", icon: Tags },
  { href: "/admin/orders",     label: "Заказы",    icon: ShoppingCart },
  { href: "/admin/requests",   label: "Заявки",    icon: ClipboardList },
  { href: "/admin/messages",   label: "Сообщения", icon: MessageSquare },
  { href: "/admin/articles",   label: "Статьи",    icon: FileText },
  { href: "/admin/media",      label: "Медиа",     icon: Image },
  { href: "/admin/banners",    label: "Баннеры",   icon: Megaphone },
  { href: "/admin/seo",        label: "SEO",       icon: Search },
  { href: "/admin/settings",   label: "Настройки", icon: Settings },
]

export function AdminNav() {
  return (
    <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
      <SidebarNav items={items} />
    </nav>
  )
}
