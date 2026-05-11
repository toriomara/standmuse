"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type SidebarNavItem = {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

export function SidebarNav({ items }: { items: SidebarNavItem[] }) {
  const pathname = usePathname()

  return (
    <>
      {items.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(item.href + "/")
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </>
  )
}
