"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  destructive?: boolean
  onConfirm: () => void | Promise<void>
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Удалить",
  cancelLabel = "Отмена",
  loading = false,
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-[fadeIn_150ms_ease] data-[state=closed]:animate-[fadeOut_150ms_ease]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl p-6 data-[state=open]:animate-[slideInUp_200ms_ease] data-[state=closed]:animate-[slideOutDown_150ms_ease] focus:outline-none">
          <Dialog.Close
            aria-label="Закрыть"
            className="absolute right-4 top-4 rounded text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
          >
            <X className="h-4 w-4" />
          </Dialog.Close>

          <div className="flex items-center gap-3 mb-5">
            {destructive && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            )}
            <div>
              <Dialog.Title className="font-semibold text-base leading-tight">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-xs text-muted-foreground mt-0.5">
                  {description}
                </Dialog.Description>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              {cancelLabel}
            </Button>
            <Button
              className={`flex-1 ${destructive ? "bg-destructive hover:bg-destructive/90 text-white" : ""}`}
              loading={loading}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
