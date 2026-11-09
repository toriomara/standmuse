import { Badge } from "@/components/ui/Badge"
import { MATERIALS } from "@/constants/configurator"
import { cn } from "@/lib/utils"
import { ChoiceCard } from "../ChoiceCard"

interface MaterialStepProps {
  value: string
  onChange: (value: string) => void
}

export function MaterialStep({ value, onChange }: MaterialStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Выберите породу дерева</h2>
      <div className="grid grid-cols-3 gap-3">
        {MATERIALS.map((m) => {
          const selected = value === m.value
          return (
            <ChoiceCard
              key={m.value}
              selected={selected}
              onClick={() => onChange(m.value)}
              className={cn("relative p-3 text-sm font-medium", selected && "text-accent")}
            >
              {m.label}
              {m.tier && (
                <span className="absolute top-1.5 right-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[0.6rem] px-1.5 py-0 leading-4",
                      m.tier === "Heritage"
                        ? "border-muted-foreground/40 text-muted-foreground"
                        : "border-(--accent)/40 text-accent",
                    )}
                  >
                    {m.tier}
                  </Badge>
                </span>
              )}
            </ChoiceCard>
          )
        })}
      </div>
    </div>
  )
}
