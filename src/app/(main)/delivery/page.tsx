import type { Metadata } from "next"
import { SectionTitle } from "@/components/shared/SectionTitle"
import { Package, Clock, MapPin, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Доставка и оплата",
  description:
    "Доставка акустических стоек по всей России: СДЭК, Почта России. Срок изготовления 14 дней.",
}

const carriers = [
  {
    name: "СДЭК",
    desc: "Экспресс-доставка по всей России. Отслеживание посылки в реальном времени.",
    time: "3–7 дней",
  },
  {
    name: "Почта России",
    desc: "Экономичная доставка. Подходит для небольших аксессуаров.",
    time: "7–21 день",
  },
  {
    name: "Другая ТК",
    desc: "По договорённости — любая удобная вам транспортная компания.",
    time: "По договорённости",
  },
]

export default function DeliveryPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <SectionTitle
        tag="Доставка"
        title="Доставляем по всей России"
        subtitle="Каждое изделие упаковывается с защитой от повреждений. Стоимость доставки уточняется при оформлении заказа."
        className="mb-16"
      />

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {carriers.map((c) => (
          <div
            key={c.name}
            className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <h3 className="font-semibold">{c.name}</h3>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{c.desc}</p>
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="h-4 w-4 text-[var(--muted-foreground)]" />
              <span>{c.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <h2 className="text-2xl font-bold mb-6">Сроки и условия</h2>
          <div className="flex flex-col divide-y divide-[var(--border)]">
            {[
              { label: "Срок изготовления", value: "14 рабочих дней" },
              { label: "Предоплата", value: "50% при заказе" },
              { label: "Доплата", value: "50% перед отправкой" },
              { label: "Упаковка", value: "Включена в стоимость" },
              { label: "Страховка", value: "По запросу" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-4">
                <span className="text-sm text-[var(--muted-foreground)]">{item.label}</span>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Важно знать</h2>
          <div className="flex flex-col gap-4 text-sm text-[var(--muted-foreground)] leading-relaxed">
            <p>
              <strong className="text-[var(--foreground)]">Габариты и вес.</strong>{" "}
              Полноразмерные акустические стойки весят ~31 кг пара. Доставка только СДЭК или курьерской службой — наземным транспортом
            </p>
            <p>
              <strong className="text-[var(--foreground)]">Транзитное время.</strong>{" "}
              К сроку изготовления прибавьте время доставки по вашему региону. По Москве и МО возможна курьерская доставка
            </p>
            <p>
              <strong className="text-[var(--foreground)]">Самовывоз.</strong>{" "}
              Возможен по договорённости. Уточняйте при оформлении заказа
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
