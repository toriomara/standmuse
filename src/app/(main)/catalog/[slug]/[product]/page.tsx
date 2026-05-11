export const dynamic = "force-dynamic";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { JsonLd, productSchema, breadcrumbSchema } from "@/components/shared/JsonLd";
interface Props {
  params: Promise<{ slug: string; product: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product: productSlug } = await params;
  const product = await prisma.product
    .findUnique({ where: { slug: productSlug } })
    .catch(() => null);
  if (!product) return {};
  const title = product.seoTitle ?? `${product.name} — на заказ`;
  const description =
    product.seoDesc ?? product.shortDesc ?? product.description.slice(0, 160);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(product.images[0] && { images: [{ url: product.images[0] }] }),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug, product: productSlug } = await params;

  const product = await prisma.product
    .findUnique({
      where: { slug: productSlug },
      include: { category: true },
    })
    .catch(() => null);

  if (!product || !product.isActive) notFound();

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <JsonLd data={productSchema({
        name: product.name,
        description: product.shortDesc ?? product.description.slice(0, 200),
        image: product.images[0] ?? undefined,
        priceFrom: product.priceFrom,
        categoryName: product.category.name,
        categorySlug: product.category.slug,
        slug: product.slug,
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: "Каталог", url: "https://standmuse.ru/catalog" },
        { name: product.category.name, url: `https://standmuse.ru/catalog/${slug}` },
        { name: product.name },
      ])} />
      <Breadcrumbs
        className="mb-8"
        items={[
          { label: "Каталог", href: "/catalog" },
          { label: product.category.name, href: `/catalog/${slug}` },
          { label: product.name },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Images */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Info */}
        <div className="flex flex-col gap-6">
          {product.isFeatured && (
            <Badge variant="accent" className="w-fit">
              Хит
            </Badge>
          )}

          <div>
            <h1 className="text-4xl font-bold leading-tight mb-3">
              {product.name}
            </h1>
            {product.shortDesc && (
              <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
                {product.shortDesc}
              </p>
            )}
          </div>

          <div className="text-2xl font-bold">
            {product.priceFrom
              ? `от ${formatPrice(product.priceFrom)}`
              : "Цена по запросу"}
          </div>

          {product.features.length > 0 && (
            <div className="flex flex-col gap-2">
              {product.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}

          {product.materials.length > 0 && (
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-[var(--muted-foreground)] mb-2">
                Материалы
              </p>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((m) => (
                  <span
                    key={m}
                    className="text-xs px-3 py-1 rounded-full bg-[var(--muted)] text-[var(--foreground)]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link href={`/order?type=${product.categoryId}`} className="flex-1">
              <Button size="lg" className="w-full gap-2">
                Заказать <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contacts">
              <Button variant="outline" size="lg">
                Задать вопрос
              </Button>
            </Link>
          </div>

          <p className="text-xs text-[var(--muted-foreground)]">
            Срок изготовления: 14 рабочих дней. Доставка СДЭК / Почта России
          </p>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-16 pt-8 border-t border-[var(--border)]">
          <h2 className="text-2xl font-bold mb-6">Описание</h2>
          <div
            className="rich-content max-w-3xl"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}
    </div>
  );
}
