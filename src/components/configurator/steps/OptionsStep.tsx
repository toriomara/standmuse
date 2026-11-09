import { AnimatePresence, motion } from "framer-motion"
import { ADDITIONAL_OPTIONS, COLUMN_PROFILES, PLATFORM_THICKNESSES } from "@/constants/configurator"
import { formatPrice } from "@/lib/utils"
import { OptionRow } from "../ChoiceCard"

interface OptionsStepProps {
  columnProfile: string
  platformThickness: string
  options: readonly string[]
  /** Рассчитанная цена; `null`, пока пользователь не нажал «Рассчитать». */
  price: number | null
  onColumnProfileChange: (value: string) => void
  onPlatformThicknessChange: (value: string) => void
  onToggleOption: (value: string) => void
}

export function OptionsStep(props: OptionsStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Конфигурация и опции</h2>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold">Профиль колонны</legend>
        <div className="grid sm:grid-cols-2 gap-2">
          {COLUMN_PROFILES.map((cp) => (
            <OptionRow
              key={cp.value}
              marker="radio"
              selected={props.columnProfile === cp.value}
              onClick={() => props.onColumnProfileChange(cp.value)}
              label={cp.label}
              desc={cp.desc}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold">Толщина платформы</legend>
        <div className="grid sm:grid-cols-2 gap-2">
          {PLATFORM_THICKNESSES.map((pt) => (
            <OptionRow
              key={pt.value}
              marker="radio"
              inlineDesc
              selected={props.platformThickness === pt.value}
              onClick={() => props.onPlatformThicknessChange(pt.value)}
              label={pt.label}
              desc={pt.desc}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold">Дополнительные опции</legend>
        <div className="flex flex-col gap-2">
          {ADDITIONAL_OPTIONS.map((opt) => (
            <OptionRow
              key={opt.value}
              marker="check"
              selected={props.options.includes(opt.value)}
              onClick={() => props.onToggleOption(opt.value)}
              label={opt.label}
              desc={opt.desc}
            />
          ))}
        </div>
      </fieldset>

      <AnimatePresence>
        {props.price !== null && (
          <motion.div
            key="price-block"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-(--accent)/30 bg-accent/5 px-6 py-5"
            aria-live="polite"
            aria-label="Рассчитанная стоимость"
          >
            <p className="text-sm text-muted-foreground mb-1">Стоимость пары стоек</p>
            <p className="text-4xl font-bold tabular-nums">{formatPrice(props.price)}</p>
            <p className="text-xs text-muted-foreground mt-2">Срок изготовления: 14 дней</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
