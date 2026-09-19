import Link from "next/link";

import { ProductCard } from "@/components/products/product-card";
import { Container, Section } from "@/components/ui/container";
import { products } from "@/data/products";

export function FeaturedProductsSection() {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 4);

  return (
    <Section className="border-y border-border bg-surface">
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="bt-eyebrow text-secondary">Öne çıkan ürünler</p>
            <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl lg:text-6xl">
              Kataloğa hızlı bir bakış.
            </h2>
          </div>
          <Link
            href="/urunler"
            className="w-fit text-sm font-extrabold text-primary hover:text-primary-hover"
          >
            Tüm ürünleri gör →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
