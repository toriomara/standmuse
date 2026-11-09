"use client"

import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
  AVAILABLE_PRODUCT_TYPE,
  DEFAULT_COLUMN_PROFILE,
  DEFAULT_PLATFORM_THICKNESS,
  STEPS,
} from "@/constants/configurator"
import { apiRequest } from "@/lib/api-client"
import { calculatePrice } from "@/lib/pricing"
import { buildRequestOptions } from "@/lib/requestFormat"
import { requestSchema, type RequestInput } from "@/lib/validations"
import { StepProgress } from "./StepProgress"
import { ProductTypeStep } from "./steps/ProductTypeStep"
import { DimensionsStep } from "./steps/DimensionsStep"
import { MaterialStep } from "./steps/MaterialStep"
import { FinishStep } from "./steps/FinishStep"
import { OptionsStep } from "./steps/OptionsStep"
import { ContactStep } from "./steps/ContactStep"

interface Selection {
  productType: string
  material: string
  finish: string
  baseFinish: string
  metalColor: string
  columnProfile: string
  platformThickness: string
  options: string[]
}

const initialSelection: Selection = {
  productType: "",
  material: "",
  finish: "",
  baseFinish: "",
  metalColor: "",
  columnProfile: DEFAULT_COLUMN_PROFILE,
  platformThickness: DEFAULT_PLATFORM_THICKNESS,
  options: [],
}

/** Поля, влияющие на цену: при их изменении ранее показанная стоимость устаревает. */
const PRICE_FIELDS: ReadonlySet<keyof Selection> = new Set([
  "material",
  "finish",
  "columnProfile",
  "platformThickness",
  "options",
])

const LAST_STEP = STEPS.length - 1
const OPTIONS_STEP = 4

const filled = (value: string | undefined) => Boolean(value?.trim())

interface OrderConfiguratorProps {
  user?: { name?: string | null; email?: string | null; phone?: string | null }
}

export function OrderConfigurator({ user }: OrderConfiguratorProps) {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [selection, setSelection] = useState<Selection>(initialSelection)
  const [priceRevealed, setPriceRevealed] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const contactDefaults = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  }

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset: resetForm,
    formState: { errors, isSubmitting },
  } = useForm<RequestInput>({
    resolver: zodResolver(requestSchema),
    defaultValues: contactDefaults,
  })

  const [platW, platD, baseW, baseD, message] = useWatch({
    control,
    name: [
      "dimensionsPlatform.width",
      "dimensionsPlatform.depth",
      "dimensionsBase.width",
      "dimensionsBase.depth",
      "message",
    ],
  })

  const select = <K extends keyof Selection>(key: K, value: Selection[K]) => {
    setSelection((prev) => ({ ...prev, [key]: value }))
    if (PRICE_FIELDS.has(key)) setPriceRevealed(false)
    if (key === "productType") setValue("productType", value as string)
  }

  const toggleOption = (option: string) => {
    const { options } = selection
    select("options", options.includes(option) ? options.filter((o) => o !== option) : [...options, option])
  }

  const canGoNext = () => {
    switch (step) {
      case 0:
        return selection.productType === AVAILABLE_PRODUCT_TYPE
      case 1:
        return [platW, platD, baseW, baseD].every(filled) || filled(message)
      case 2:
        return Boolean(selection.material)
      case 3:
        return Boolean(selection.finish && selection.baseFinish)
      default:
        return true
    }
  }

  const onSubmit = async (data: RequestInput) => {
    setSubmitError(null)
    try {
      await apiRequest("/api/requests", {
        method: "POST",
        body: {
          ...data,
          productType: selection.productType,
          material: selection.material,
          color: selection.metalColor || undefined,
          finish: selection.finish,
          baseFinish: selection.baseFinish,
          options: buildRequestOptions(selection),
        },
      })
      setSubmitted(true)
    } catch {
      setSubmitError("Не удалось отправить заявку. Попробуйте ещё раз.")
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setStep(0)
    setSelection(initialSelection)
    setPriceRevealed(false)
    setSubmitError(null)
    resetForm(contactDefaults)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </motion.div>
        <h2 className="text-3xl font-bold">Заявка отправлена!</h2>
        <p className="text-muted-foreground max-w-sm">
          Свяжемся с вами в течение суток. Обсудим детали и подтвердим заказ.
        </p>
        <Button onClick={handleReset}>Оформить ещё один</Button>
      </div>
    )
  }

  const goNext = () => setStep((s) => s + 1)

  return (
    <div className="max-w-2xl mx-auto">
      <StepProgress current={step} onSelect={setStep} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <ProductTypeStep value={selection.productType} onChange={(v) => select("productType", v)} />
          )}
          {step === 1 && <DimensionsStep register={register} />}
          {step === 2 && <MaterialStep value={selection.material} onChange={(v) => select("material", v)} />}
          {step === 3 && (
            <FinishStep
              metalColor={selection.metalColor}
              finish={selection.finish}
              baseFinish={selection.baseFinish}
              onMetalColorChange={(v) => select("metalColor", v)}
              onFinishChange={(v) => select("finish", v)}
              onBaseFinishChange={(v) => select("baseFinish", v)}
            />
          )}
          {step === OPTIONS_STEP && (
            <OptionsStep
              columnProfile={selection.columnProfile}
              platformThickness={selection.platformThickness}
              options={selection.options}
              price={priceRevealed ? calculatePrice(selection) : null}
              onColumnProfileChange={(v) => select("columnProfile", v)}
              onPlatformThicknessChange={(v) => select("platformThickness", v)}
              onToggleOption={toggleOption}
            />
          )}
          {step === LAST_STEP && (
            <form onSubmit={handleSubmit(onSubmit)} id="configurator-form">
              <ContactStep register={register} errors={errors} prefilled={Boolean(user)} />
            </form>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-end gap-3 mt-4 pt-4">
        {submitError && <p className="text-sm text-destructive mr-auto">{submitError}</p>}

        <Button
          variant="outline"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          aria-label="Предыдущий шаг"
        >
          Назад
        </Button>

        {step === LAST_STEP ? (
          <Button type="submit" form="configurator-form" loading={isSubmitting}>
            Отправить заявку
          </Button>
        ) : step === OPTIONS_STEP ? (
          priceRevealed ? (
            <Button onClick={goNext}>Оформить заказ</Button>
          ) : (
            <Button onClick={() => setPriceRevealed(true)}>Рассчитать стоимость</Button>
          )
        ) : (
          <Button onClick={goNext} disabled={!canGoNext()}>
            Далее
          </Button>
        )}
      </div>
    </div>
  )
}
