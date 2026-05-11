import { cn } from "@/lib/utils"

type Variant = "default" | "outline" | "accent" | "success" | "warning" | "destructive"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  default: "bg-[var(--muted)] text-[var(--muted-foreground)]",
  outline: "border border-[var(--border)] text-[var(--foreground)]",
  accent: "bg-[var(--accent)] text-[var(--accent-foreground)]",
  success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  destructive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
