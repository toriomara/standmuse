import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { OrderConfigurator } from "@/components/configurator/OrderConfigurator"
import { OrderFaqSection } from "@/components/sections/OrderFaqSection"
import { PricingTiersSection } from "@/components/sections/PricingTiersSection"

export const metadata: Metadata = {
  title: "Купить акустические стойки на заказ — конфигуратор",
  description:
    "Сконфигурируйте стойки для акустических колонок под свою акустику: размеры, материал, высота, отделка. Комплект пары от 16 000 ₽, изготовление 14 дней, доставка по России.",
}

export default async function OrderPage() {
  const session = await auth()
  const sessionUser = session?.user as { id?: string } | undefined

  let userContact: { name?: string; email?: string; phone?: string } | undefined

  if (sessionUser?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { name: true, email: true, phone: true },
    })
    if (dbUser) userContact = { name: dbUser.name, email: dbUser.email, phone: dbUser.phone ?? undefined }
  }

  return (
    <>
      <PricingTiersSection />

      <div
        id="configurator"
        className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
      >
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-accent mb-3 block">
              Конфигуратор
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Ваш заказ</h2>
            <p className="text-muted-foreground leading-relaxed">
              Заполните параметры — мы свяжемся с вами в течение суток и уточним детали
            </p>
          </div>

          <OrderConfigurator user={userContact} />
        </div>
      </div>

      <OrderFaqSection />
    </>
  )
}
