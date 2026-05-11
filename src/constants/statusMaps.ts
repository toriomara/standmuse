type StatusEntry = {
  label: string
  variant: "default" | "outline" | "accent" | "success" | "warning" | "destructive"
}

export const REQUEST_STATUS_MAP: Record<string, StatusEntry> = {
  NEW:       { label: "Новая",             variant: "accent"      },
  IN_REVIEW: { label: "На рассмотрении",   variant: "warning"     },
  QUOTED:    { label: "Расчёт готов",      variant: "warning"     },
  CONFIRMED: { label: "Подтверждена",      variant: "success"     },
  COMPLETED: { label: "Выполнена",         variant: "success"     },
  CANCELLED: { label: "Отменена",          variant: "destructive" },
}

export const ORDER_STATUS_MAP: Record<string, StatusEntry> = {
  PENDING:     { label: "Ожидает",   variant: "warning"     },
  IN_PROGRESS: { label: "В работе",  variant: "accent"      },
  COMPLETED:   { label: "Выполнен",  variant: "success"     },
  CANCELLED:   { label: "Отменён",   variant: "destructive" },
}
