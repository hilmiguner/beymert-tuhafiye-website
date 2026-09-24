import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

import { ProductCatalog } from "@/components/products/product-catalog";
import { Container, Section } from "@/components/ui/container";
import { getCategories, getProducts } from "@/lib/public-content";

export const metadata: Metadata = buildPageMetadata({
  title: "Ürünler",
  description: "Beymert’in parti malzemeleri, balon, özel gün, hediyelik ve tuhafiye ürünlerini keşfedin.",
  path: "/urunler",
});

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
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
            Yayındaki ürünleri kategoriye göre filtreleyebilir, detaylarını
            inceleyebilir ve güncel bilgi için doğrudan mağazaya ulaşabilirsin.
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
