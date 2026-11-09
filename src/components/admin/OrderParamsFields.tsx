import { FormField, inputCls } from "@/components/admin/FormField"
import { ORDER_PARAM_FIELDS, type OrderParamKey, type OrderParams } from "@/lib/order-params"

interface OrderParamsFieldsProps {
  values: OrderParams
  onChange: (key: OrderParamKey, value: string) => void
}

export function OrderParamsFields({ values, onChange }: OrderParamsFieldsProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {ORDER_PARAM_FIELDS.map(({ key, label, placeholder }) => (
        <FormField key={key} label={label}>
          <input
            value={values[key] ?? ""}
            onChange={(e) => onChange(key, e.target.value)}
            placeholder={placeholder}
            className={inputCls}
          />
        </FormField>
      ))}
    </div>
  )
}
