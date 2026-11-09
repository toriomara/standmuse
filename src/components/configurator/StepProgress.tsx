import { STEPS } from "@/constants/configurator"
import { cn } from "@/lib/utils"

interface StepProgressProps {
  current: number
  /** Переход назад к уже пройденному шагу. */
  onSelect: (index: number) => void
}

export function StepProgress({ current, onSelect }: StepProgressProps) {
  return (
    <nav aria-label="Шаги оформления заказа">
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((title, i) => (
          <div key={title} className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={() => i < current && onSelect(i)}
              aria-label={`Шаг ${i + 1}: ${title}`}
              aria-current={i === current ? "step" : undefined}
              className={cn(
                "shrink-0 h-8 w-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all",
                i < current
                  ? "bg-accent text-accent-foreground cursor-pointer"
                  : i === current
                    ? "border-2 border-accent text-accent"
                    : "bg-muted text-muted-foreground cursor-default",
              )}
            >
              {i < current ? "✓" : i + 1}
            </button>
            {i < STEPS.length - 1 && (
              <div className={cn("h-0.5 flex-1", i < current ? "bg-accent" : "bg-border")} />
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}
