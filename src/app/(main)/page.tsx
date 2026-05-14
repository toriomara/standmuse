import type { Metadata } from "next"
import { HeroSection } from "@/components/sections/HeroSection"
import { FeaturedProjectsSection } from "@/components/sections/FeaturedProjectsSection"
import { FeaturedCategoriesSection } from "@/components/sections/FeaturedCategoriesSection"
import { BenefitsSection } from "@/components/sections/BenefitsSection"
import { HowItWorksSection } from "@/components/sections/HowItWorksSection"
import { MaterialsSection } from "@/components/sections/MaterialsSection"
import { FaqSection } from "@/components/sections/FaqSection"
import { CallbackCtaSection } from "@/components/sections/CallbackCtaSection"
import { ContactCtaSection } from "@/components/sections/ContactCtaSection"
import { JsonLd, organizationSchema, localBusinessSchema } from "@/components/shared/JsonLd"

export const metadata: Metadata = {
  title: "StandMuse — Акустические стойки на заказ | Стойки для акустических колонок",
  description:
    "Купить акустические стойки на заказ. Стойки под акустические колонки ручной работы — массив дерева, металл, виброразвязка. Комплект пары от 16 000 ₽. Изготовление 14 дней, доставка по России.",
  openGraph: {
    title: "StandMuse — Акустические стойки ручной работы на заказ",
    description:
      "Стойки для акустических колонок из массива дерева и металла. Комплект пары от 16 000 ₽, изготовление 14 дней.",
    url: "https://standmuse.ru",
    type: "website",
  },
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={localBusinessSchema} />
      <HeroSection />
      <FeaturedProjectsSection />
      <FeaturedCategoriesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <MaterialsSection />
      <FaqSection />
      <CallbackCtaSection />
      <ContactCtaSection />
    </>
  )
}
