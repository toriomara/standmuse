import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"
import { Badge } from "@/components/ui/Badge"
import { formatPrice } from "@/lib/utils"
import type { ProductData } from "@/types"

interface ProductCardProps {
  product: ProductData
  categorySlug: string
}

export function ProductCard({ product, categorySlug }: ProductCardProps) {
  return (
    <Link
      href={`/catalog/${categorySlug}/${product.slug}`}
      className="group block rounded-2xl border border-border bg-card overflow-hidden hover:border-accent/50 hover:shadow-lg transition-all"
    >
      {/* Image */}
      <div className="relative aspect-4/3 bg-muted overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ImagePlaceholder />
        )}
        {product.isFeatured && (
          <div className="absolute top-3 left-3">
            <Badge variant="accent">Хит</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-base leading-snug group-hover:text-accent transition-colors mb-1.5">
          {product.name}
        </h3>
        {product.shortDesc && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
            {product.shortDesc}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">
            {product.priceFrom ? `от ${formatPrice(product.priceFrom)}` : "По запросу"}
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  )
}
