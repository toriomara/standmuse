import { BASE_FINISHES, FINISHES, METAL_COLORS } from "@/constants/configurator"
import { cn } from "@/lib/utils"
import { ChoiceCard } from "../ChoiceCard"

interface FinishStepProps {
  metalColor: string
  finish: string
  baseFinish: string
  onMetalColorChange: (value: string) => void
  onFinishChange: (value: string) => void
  onBaseFinishChange: (value: string) => void
}

function TextTiles({
  items,
  value,
  onChange,
  className,
}: {
  items: readonly { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  className: string
}) {
  return (
    <div className={className}>
      {items.map((item) => (
        <ChoiceCard
          key={item.value}
          selected={value === item.value}
          onClick={() => onChange(item.value)}
          className={cn("p-4 text-sm font-medium", value === item.value && "text-accent")}
        >
          {item.label}
        </ChoiceCard>
      ))}
    </div>
  )
}

export function FinishStep(props: FinishStepProps) {
  const { metalColor, finish, baseFinish } = props

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Цвет и отделка</h2>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold">Цвет металла</p>
        <div className="flex gap-3 flex-wrap">
          {METAL_COLORS.map((c) => (
            <ChoiceCard
              key={c.value}
              selected={metalColor === c.value}
              onClick={() => props.onMetalColorChange(c.value)}
              title={c.label}
              className="flex flex-col items-center gap-1.5 p-2 text-xs font-medium"
            >
              <span
                className="h-8 w-8 rounded-full border border-border/40 shrink-0"
                style={{ backgroundColor: c.hex }}
              />
              <span className={metalColor === c.value ? "text-accent" : ""}>{c.label}</span>
            </ChoiceCard>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold">Тип покрытия колонны и платформы</p>
        <TextTiles
          items={FINISHES}
          value={finish}
          onChange={props.onFinishChange}
          className="grid grid-cols-2 gap-3"
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold">
          Отделка основания стойки{" "}
          <span className="font-normal text-muted-foreground">
            (все материалы Borma, если не указано иное)
          </span>
        </p>
        <TextTiles
          items={BASE_FINISHES}
          value={baseFinish}
          onChange={props.onBaseFinishChange}
          className="grid grid-cols-3 gap-3"
        />
      </div>
    </div>
  )
}
