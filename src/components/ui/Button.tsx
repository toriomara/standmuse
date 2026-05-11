import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

type Variant = "default" | "outline" | "ghost" | "link" | "destructive"
type Size = "sm" | "md" | "lg" | "icon"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  asChild?: boolean
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  default:
    "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 active:scale-[0.98]",
  outline:
    "border border-[var(--border)] bg-transparent hover:bg-[var(--muted)] text-[var(--foreground)]",
  ghost:
    "bg-transparent hover:bg-[var(--muted)] text-[var(--foreground)]",
  link:
    "bg-transparent underline-offset-4 hover:underline text-[var(--accent)] p-0 h-auto",
  destructive:
    "bg-[var(--destructive)] text-white hover:opacity-90",
}

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded-md",
  md: "h-10 px-5 text-sm rounded-lg",
  lg: "h-12 px-8 text-base rounded-lg",
  icon: "h-10 w-10 rounded-lg",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {asChild ? children : (
          <>
            {loading && (
              <>
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                <span className="sr-only">Загрузка…</span>
              </>
            )}
            {children}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"
