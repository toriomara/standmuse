import { Badge } from "@/components/ui/Badge"
import { AVAILABLE_PRODUCT_TYPE, PRODUCT_TYPES } from "@/constants/configurator"
import { cn } from "@/lib/utils"
import { ChoiceCard } from "../ChoiceCard"

interface ProductTypeStepProps {
  value: string
  onChange: (value: string) => void
}

export function ProductTypeStep({ value, onChange }: ProductTypeStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Выберите тип изделия</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {PRODUCT_TYPES.map((type) => {
          const available = type.value === AVAILABLE_PRODUCT_TYPE
          const selected = value === type.value
          return (
            <ChoiceCard
              key={type.value}
              selected={selected}
              onClick={() => onChange(type.value)}
              className={cn(
                "relative flex flex-col gap-1 p-4",
                !available && "cursor-default opacity-60",
              )}
            >
              {!available && (
                <span className="absolute top-2.5 right-2.5">
                  <Badge
                    variant="outline"
                    className="text-[0.6rem] px-1.5 py-0 leading-4 border-muted-foreground/40 text-muted-foreground"
                  >
                    Скоро
                  </Badge>
                </span>
              )}
              <span className={cn("font-semibold text-sm transition-colors", selected && "text-accent")}>
                {type.label}
              </span>
              <span className="text-xs text-muted-foreground">{type.desc}</span>
            </ChoiceCard>
          )
        })}
      </div>

      {value && value !== AVAILABLE_PRODUCT_TYPE && (
        <div className="rounded-xl border border-border bg-muted/40 px-5 py-4">
          <p className="text-sm font-semibold mb-1">Раздел в разработке</p>
          <p className="text-sm text-muted-foreground">
            Конфигуратор для этого типа изделия скоро будет готов. Пока вы можете{" "}
            <a href="mailto:info@standmuse.ru" className="text-accent hover:underline">
              написать нам напрямую
            </a>{" "}
            — обсудим детали и оформим заявку вручную.
          </p>
        </div>
      )}
    </div>
  )
}
