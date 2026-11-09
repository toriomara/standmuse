import { cn } from "@/lib/utils"

const selectedCls = "border border-accent bg-accent/12"
const idleCls =
  "border-border hover:border-(--accent) hover:bg-(--accent)/5 hover:-translate-y-0.5 hover:shadow-sm"

interface ChoiceCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean
}

/** Кнопка-карточка выбора: общая оболочка для всех вариантов в конфигураторе. */
export function ChoiceCard({ selected, className, ...props }: ChoiceCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "rounded-xl border text-left transition-all cursor-pointer",
        selected ? selectedCls : idleCls,
        className,
      )}
      {...props}
    />
  )
}

/** Маркер радио/чекбокса внутри карточки. */
export function ChoiceMarker({
  selected,
  shape,
  className,
}: {
  selected: boolean
  shape: "radio" | "check"
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "h-4 w-4 border-2 shrink-0 transition-colors",
        shape === "radio"
          ? ["rounded-full", selected ? "border-accent bg-accent" : "border-border"]
          : [
              "h-5 w-5 rounded flex items-center justify-center",
              selected ? "bg-accent border-accent text-accent-foreground" : "border-border",
            ],
        className,
      )}
    >
      {shape === "check" && selected && <span className="text-xs leading-none">✓</span>}
    </span>
  )
}

interface OptionRowProps {
  selected: boolean
  onClick: () => void
  marker: "radio" | "check"
  label: string
  desc?: string
  /** Описание в той же строке («4 мм — Стандарт») вместо отдельной второй строки. */
  inlineDesc?: boolean
}

/** Строка выбора с маркером и подписью — для профиля, толщины и опций. */
export function OptionRow({ selected, onClick, marker, label, desc, inlineDesc }: OptionRowProps) {
  const labelCls = cn("font-medium transition-colors", selected && "text-accent")

  return (
    <ChoiceCard
      selected={selected}
      onClick={onClick}
      className={cn("flex gap-3 p-3 text-sm", inlineDesc ? "items-center" : "items-start")}
    >
      <ChoiceMarker selected={selected} shape={marker} className={inlineDesc ? undefined : "mt-0.5"} />
      {inlineDesc ? (
        <span>
          <span className={labelCls}>{label}</span>
          {desc && <span className="text-xs text-muted-foreground ml-1.5">— {desc}</span>}
        </span>
      ) : (
        <span className="flex flex-col">
          <span className={labelCls}>{label}</span>
          {desc && <span className="text-xs text-muted-foreground mt-0.5">{desc}</span>}
        </span>
      )}
    </ChoiceCard>
  )
}
