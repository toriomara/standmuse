import type { UseFormRegister } from "react-hook-form"
import { Input, Textarea } from "@/components/ui/Input"
import type { RequestInput } from "@/lib/validations"

interface DimensionsStepProps {
  register: UseFormRegister<RequestInput>
}

function SizeGroup({
  title,
  widthField,
  depthField,
  placeholders,
  register,
}: {
  title: string
  widthField: "dimensionsPlatform.width" | "dimensionsBase.width"
  depthField: "dimensionsPlatform.depth" | "dimensionsBase.depth"
  placeholders: [string, string]
  register: UseFormRegister<RequestInput>
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold">{title}</p>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Ширина, мм" placeholder={placeholders[0]} {...register(widthField)} />
        <Input label="Глубина, мм" placeholder={placeholders[1]} {...register(depthField)} />
      </div>
    </div>
  )
}

export function DimensionsStep({ register }: DimensionsStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Укажите необходимые размеры</h2>
      <p className="text-sm text-muted-foreground">
        Укажите габариты платформы и основания. Если не знаете точно — напишите примерные или модель
        акустики.
      </p>

      <SizeGroup
        title="Платформа для акустики"
        widthField="dimensionsPlatform.width"
        depthField="dimensionsPlatform.depth"
        placeholders={["220", "350"]}
        register={register}
      />
      <SizeGroup
        title="Основание стойки"
        widthField="dimensionsBase.width"
        depthField="dimensionsBase.depth"
        placeholders={["200", "250"]}
        register={register}
      />

      <Textarea
        label="Модель акустики или пожелания"
        placeholder="Wharfedale Diamond 12.2, нужны стойки 60 см высотой..."
        rows={3}
        {...register("message")}
      />
    </div>
  )
}
