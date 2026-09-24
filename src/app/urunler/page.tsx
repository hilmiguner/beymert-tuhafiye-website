import type { Metadata } from "next";

import { ProductCatalog } from "@/components/products/product-catalog";
import { Container, Section } from "@/components/ui/container";
import { getPublicCategories } from "@/lib/public-categories";
import { getPublicProducts } from "@/lib/public-products";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Ürünler",
  description:
    "Beymert’in parti malzemeleri, balon, özel gün, hediyelik ve tuhafiye ürünlerini keşfedin.",
  path: "/urunler",
});

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getPublicProducts(),
    getPublicCategories(),
  ]);

  return (
    <main id="main-content" tabIndex={-1}>
      <Section className="bt-brand-glow border-b border-border">
        <Container>
          <p className="bt-eyebrow text-primary">Ürün kataloğu</p>
          <h1 className="bt-display bt-balance mt-4 max-w-4xl text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
            Kutlamanı tamamlayan detayları keşfet.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Katalog mağaza içerik yönetiminden güncellenir. Ürün, renk ve stok
            bilgileri için güncel durumu WhatsApp üzerinden doğrulayabilirsin.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <ProductCatalog products={products} categories={categories} />
        </Container>
      </Section>
    </main>
  );
}
