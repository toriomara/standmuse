"use client"
import { User, Package, MessageSquare, Settings } from "lucide-react"
import { SidebarNav, type SidebarNavItem } from "@/components/SidebarNav"

const items: SidebarNavItem[] = [
  { href: "/account",          label: "Обзор",      icon: User,          exact: true },
  { href: "/account/orders",   label: "Мои заявки", icon: Package },
  { href: "/account/messages", label: "Сообщения",  icon: MessageSquare },
  { href: "/account/profile",  label: "Настройки",  icon: Settings },
]

export function AccountNav() {
  return <SidebarNav items={items} />
}
