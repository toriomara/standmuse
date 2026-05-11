export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "StandMuse",
  url: "https://standmuse.ru",
  logo: "https://standmuse.ru/logo.png",
  description: "Акустические стойки ручной работы на заказ",
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@standmuse.ru",
    contactType: "customer service",
  },
}

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "StandMuse",
  description: "Производство акустических стоек и HI-FI мебели на заказ",
  url: "https://standmuse.ru",
  email: "info@standmuse.ru",
  priceRange: "₽₽",
}

export function productSchema(p: {
  name: string
  description: string
  image?: string
  priceFrom?: number | null
  categoryName: string
  categorySlug: string
  slug: string
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    ...(p.image && { image: p.image }),
    brand: { "@type": "Brand", name: "StandMuse" },
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      ...(p.priceFrom && { price: p.priceFrom }),
      availability: "https://schema.org/InStockOnlineOnly",
      url: `https://standmuse.ru/catalog/${p.categorySlug}/${p.slug}`,
      seller: { "@type": "Organization", name: "StandMuse" },
    },
  }
}

export function breadcrumbSchema(
  items: { name: string; url?: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  }
}
