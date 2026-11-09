import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import type { RequestInput } from "@/lib/validations"

interface ContactStepProps {
  register: UseFormRegister<RequestInput>
  errors: FieldErrors<RequestInput>
  /** Данные подставлены из профиля пользователя. */
  prefilled: boolean
}

export function ContactStep({ register, errors, prefilled }: ContactStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Контактные данные</h2>
      {prefilled && (
        <p className="text-xs text-muted-foreground -mt-2">
          Данные подставлены из вашего профиля — проверьте и при необходимости исправьте.
        </p>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Имя" placeholder="Александр" error={errors.name?.message} {...register("name")} />
        <Input
          label="Email"
          type="email"
          placeholder="alex@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <Input
        label="Телефон (необязательно)"
        type="tel"
        placeholder="+7 900 000 00 00"
        {...register("phone")}
      />
      <p className="text-xs text-muted-foreground">
        Ответим в течение суток. Обсудим детали и подтвердим заказ.
      </p>
    </div>
  )
}
