import * as React from "react"
import { cn } from "@/lib/utils"

const controlBase = [
  "w-full rounded-lg border border-[var(--border)] bg-[var(--input)] text-sm",
  "text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]",
  "transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--accent)]",
  "disabled:opacity-50 disabled:cursor-not-allowed",
]

interface FieldShellProps {
  id: string
  label?: string
  error?: string
  children: React.ReactNode
}

/** Подпись + контрол + текст ошибки: общая обвязка для Input и Textarea. */
function FieldShell({ id, label, error, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-[var(--destructive)]">{error}</p>}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    // useId, а не slug от label: одинаковые подписи («Ширина, мм») не должны давать одинаковые id
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    return (
      <FieldShell id={inputId} label={label} error={error}>
        <input
          ref={ref}
          id={inputId}
          className={cn(controlBase, "h-10 px-3", error && "border-[var(--destructive)]", className)}
          {...props}
        />
      </FieldShell>
    )
  },
)
Input.displayName = "Input"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    return (
      <FieldShell id={inputId} label={label} error={error}>
        <textarea
          ref={ref}
          id={inputId}
          className={cn(controlBase, "px-3 py-2.5 resize-none", error && "border-[var(--destructive)]", className)}
          {...props}
        />
      </FieldShell>
    )
  },
)
Textarea.displayName = "Textarea"
