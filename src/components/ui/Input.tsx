import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--foreground)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--input)] px-3 text-sm",
            "text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--accent)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-[var(--destructive)]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--destructive)]">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--foreground)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-lg border border-[var(--border)] bg-[var(--input)] px-3 py-2.5 text-sm",
            "text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--accent)]",
            "disabled:opacity-50 disabled:cursor-not-allowed resize-none",
            error && "border-[var(--destructive)]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--destructive)]">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"
