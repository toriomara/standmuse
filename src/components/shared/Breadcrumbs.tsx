import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[]
  className?: string
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />}
          {item.href && i < items.length - 1 ? (
            <Link href={item.href} className="hover:text-accent transition-colors">
              {item.label}
            </Link>
          ) : (
            <span
              className={i === items.length - 1 ? "text-foreground font-medium" : ""}
              {...(i === items.length - 1 ? { "aria-current": "page" as const } : {})}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
